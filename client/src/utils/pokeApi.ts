import type {
  PokeApiAbility,
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  PokeApiStat,
  PokeApiType,
  Pokemon,
  PokemonDetails,
  PokemonSpecies,
} from '../interfaces/index.ts';
import { POKE_API_BASE_URL } from './constants.ts';
import {
  normalizePokemon,
  normalizePokemonSpecies,
} from './pokemonMappers.ts';

export type PokemonIdentifier = number | string;

export class PokeApiError extends Error {
  public readonly status: number | null;

  constructor(message: string, status: number | null = null, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'PokeApiError';
    this.status = status;
  }
}

type Validator<T> = (data: unknown) => data is T;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNullableNumber(value: unknown): value is number | null {
  return typeof value === 'number' || value === null;
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === 'string' || value === null;
}

function isNamedResource(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.url === 'string'
  );
}

function isAbility(value: unknown): value is PokeApiAbility {
  return (
    isRecord(value) &&
    isNamedResource(value.ability) &&
    typeof value.is_hidden === 'boolean' &&
    typeof value.slot === 'number'
  );
}

function isStat(value: unknown): value is PokeApiStat {
  return (
    isRecord(value) &&
    typeof value.base_stat === 'number' &&
    typeof value.effort === 'number' &&
    isNamedResource(value.stat)
  );
}

function isType(value: unknown): value is PokeApiType {
  return (
    isRecord(value) &&
    typeof value.slot === 'number' &&
    isNamedResource(value.type)
  );
}

function isSprites(value: unknown): boolean {
  if (!isRecord(value) || !isNullableString(value.front_default)) {
    return false;
  }

  if (value.other === undefined) {
    return true;
  }

  const otherSprites = value.other;

  if (!isRecord(otherSprites)) {
    return false;
  }

  return ['official-artwork', 'home'].every((key) => {
    const spriteSet = otherSprites[key];
    return (
      spriteSet === undefined ||
      (isRecord(spriteSet) && isNullableString(spriteSet.front_default))
    );
  });
}

function isPokemonResponse(data: unknown): data is PokeApiPokemon {
  return (
    isRecord(data) &&
    Array.isArray(data.abilities) &&
    data.abilities.every(isAbility) &&
    isNullableNumber(data.base_experience) &&
    typeof data.height === 'number' &&
    typeof data.id === 'number' &&
    typeof data.name === 'string' &&
    isSprites(data.sprites) &&
    Array.isArray(data.stats) &&
    data.stats.every(isStat) &&
    Array.isArray(data.types) &&
    data.types.every(isType) &&
    typeof data.weight === 'number'
  );
}

function hasLocalizedText(
  value: unknown,
  property: 'flavor_text' | 'genus' | 'name',
): boolean {
  return (
    isRecord(value) &&
    typeof value[property] === 'string' &&
    isNamedResource(value.language)
  );
}

function isSpeciesResponse(data: unknown): data is PokeApiPokemonSpecies {
  return (
    isRecord(data) &&
    isNullableNumber(data.base_happiness) &&
    typeof data.capture_rate === 'number' &&
    isNamedResource(data.color) &&
    Array.isArray(data.flavor_text_entries) &&
    data.flavor_text_entries.every(
      (entry) =>
        hasLocalizedText(entry, 'flavor_text') &&
        isRecord(entry) &&
        isNamedResource(entry.version),
    ) &&
    typeof data.gender_rate === 'number' &&
    Array.isArray(data.genera) &&
    data.genera.every((entry) => hasLocalizedText(entry, 'genus')) &&
    isNamedResource(data.generation) &&
    isNamedResource(data.growth_rate) &&
    (data.habitat === null || isNamedResource(data.habitat)) &&
    typeof data.id === 'number' &&
    typeof data.is_baby === 'boolean' &&
    typeof data.is_legendary === 'boolean' &&
    typeof data.is_mythical === 'boolean' &&
    typeof data.name === 'string' &&
    Array.isArray(data.names) &&
    data.names.every((entry) => hasLocalizedText(entry, 'name'))
  );
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function normalizeIdentifier(identifier: PokemonIdentifier): string {
  if (typeof identifier === 'number') {
    if (!Number.isInteger(identifier) || identifier < 1) {
      throw new PokeApiError('El número del Pokémon debe ser un entero positivo.');
    }

    return String(identifier);
  }

  const normalizedIdentifier = identifier
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

  if (!normalizedIdentifier) {
    throw new PokeApiError('Escribe el nombre o el número de un Pokémon.');
  }

  if (/^\d+$/.test(normalizedIdentifier)) {
    const numericIdentifier = Number(normalizedIdentifier);

    if (!Number.isSafeInteger(numericIdentifier) || numericIdentifier < 1) {
      throw new PokeApiError('El número del Pokémon no es válido.');
    }

    return String(numericIdentifier);
  }

  if (!/^[a-z0-9-]+$/.test(normalizedIdentifier)) {
    throw new PokeApiError(
      'El nombre solo puede contener letras, números y guiones.',
    );
  }

  return normalizedIdentifier;
}

export class PokeApi {
  private readonly baseUrl: string;
  private readonly cache = new Map<string, unknown>();

  constructor(baseUrl = POKE_API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private async request<T>(
    endpoint: string,
    validator: Validator<T>,
    signal?: AbortSignal,
  ): Promise<T> {
    const url = this.baseUrl + endpoint;
    const cachedData = this.cache.get(url);

    if (cachedData !== undefined && validator(cachedData)) {
      return cachedData;
    }

    let response: Response;

    try {
      response = await fetch(url, signal ? { signal } : undefined);
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }

      throw new PokeApiError(
        'No fue posible conectarse con PokéAPI. Revisa tu conexión.',
        null,
        error,
      );
    }

    if (!response.ok) {
      const message =
        response.status === 404
          ? 'No encontramos un Pokémon con ese nombre o número.'
          : 'PokéAPI respondió con el estado ' + response.status + '.';

      throw new PokeApiError(message, response.status);
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch (error) {
      throw new PokeApiError(
        'PokéAPI devolvió una respuesta que no es JSON válido.',
        response.status,
        error,
      );
    }

    if (!validator(data)) {
      throw new PokeApiError(
        'PokéAPI devolvió datos con una estructura inesperada.',
        response.status,
      );
    }

    this.cache.set(url, data);
    return data;
  }

  public async getPokemon(
    identifier: PokemonIdentifier,
    signal?: AbortSignal,
  ): Promise<Pokemon> {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    const data = await this.request(
      '/pokemon/' + encodeURIComponent(normalizedIdentifier) + '/',
      isPokemonResponse,
      signal,
    );

    return normalizePokemon(data);
  }

  public async getPokemonSpecies(
    identifier: PokemonIdentifier,
    signal?: AbortSignal,
  ): Promise<PokemonSpecies> {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    const data = await this.request(
      '/pokemon-species/' + encodeURIComponent(normalizedIdentifier) + '/',
      isSpeciesResponse,
      signal,
    );

    return normalizePokemonSpecies(data);
  }

  public async getPokemonDetails(
    identifier: PokemonIdentifier,
    signal?: AbortSignal,
  ): Promise<PokemonDetails> {
    const [pokemon, species] = await Promise.all([
      this.getPokemon(identifier, signal),
      this.getPokemonSpecies(identifier, signal),
    ]);

    return {
      ...pokemon,
      name: species.name,
      species,
    };
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
  }
}

const pokeApi = new PokeApi();

export default pokeApi;

