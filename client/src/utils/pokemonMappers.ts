import type {
  NamedApiResource,
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  Pokemon,
  PokemonSpecies,
} from '../interfaces/index.ts';
import { FALLBACK_POKEMON_IMAGE } from './constants.ts';

interface LocalizedEntry {
  language: NamedApiResource;
}

function selectLocalizedValue<T extends LocalizedEntry>(
  entries: T[],
  getValue: (entry: T) => string,
): string | null {
  const selectedEntry =
    entries.find((entry) => entry.language.name === 'es') ??
    entries.find((entry) => entry.language.name === 'en') ??
    entries[0];

  return selectedEntry ? getValue(selectedEntry) : null;
}

export function formatResourceName(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function cleanFlavorText(text: string): string {
  return text
    .normalize('NFKC')
    .replace(/[\n\r\f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatGeneration(name: string): string {
  const generation = name.replace(/^generation-/, '').toUpperCase();
  return generation ? 'Generación ' + generation : formatResourceName(name);
}

function getPokemonImage(data: PokeApiPokemon): string {
  return (
    data.sprites.other?.['official-artwork']?.front_default ??
    data.sprites.other?.home?.front_default ??
    data.sprites.front_default ??
    FALLBACK_POKEMON_IMAGE
  );
}

export function normalizePokemon(data: PokeApiPokemon): Pokemon {
  return {
    abilities: [...data.abilities]
      .sort((first, second) => first.slot - second.slot)
      .map(({ ability, is_hidden: isHidden, slot }) => ({
        isHidden,
        name: formatResourceName(ability.name),
        slot,
      })),
    apiName: data.name,
    baseExperience: data.base_experience,
    height: data.height,
    id: data.id,
    imageUrl: getPokemonImage(data),
    name: formatResourceName(data.name),
    stats: data.stats.map(({ base_stat: baseValue, effort, stat }) => ({
      baseValue,
      effort,
      name: formatResourceName(stat.name),
    })),
    types: [...data.types]
      .sort((first, second) => first.slot - second.slot)
      .map(({ slot, type }) => ({
        name: formatResourceName(type.name),
        slot,
      })),
    weight: data.weight,
  };
}

export function normalizePokemonSpecies(
  data: PokeApiPokemonSpecies,
): PokemonSpecies {
  const localizedName = selectLocalizedValue(data.names, (entry) => entry.name);
  const localizedCategory = selectLocalizedValue(
    data.genera,
    (entry) => entry.genus,
  );
  const localizedDescription = selectLocalizedValue(
    data.flavor_text_entries,
    (entry) => entry.flavor_text,
  );

  return {
    apiName: data.name,
    baseHappiness: data.base_happiness,
    captureRate: data.capture_rate,
    category: localizedCategory,
    color: formatResourceName(data.color.name),
    description: localizedDescription
      ? cleanFlavorText(localizedDescription)
      : null,
    genderRate: data.gender_rate,
    generation: formatGeneration(data.generation.name),
    growthRate: formatResourceName(data.growth_rate.name),
    habitat: data.habitat ? formatResourceName(data.habitat.name) : null,
    id: data.id,
    isBaby: data.is_baby,
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
    name: localizedName ?? formatResourceName(data.name),
  };
}

