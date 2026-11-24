export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokeApiAbility {
  ability: NamedApiResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokeApiStat {
  base_stat: number;
  effort: number;
  stat: NamedApiResource;
}

export interface PokeApiType {
  slot: number;
  type: NamedApiResource;
}

interface PokeApiSpriteSet {
  front_default: string | null;
}

export interface PokeApiSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: PokeApiSpriteSet;
    home?: PokeApiSpriteSet;
  };
}

export interface PokeApiPokemon {
  abilities: PokeApiAbility[];
  base_experience: number | null;
  height: number;
  id: number;
  name: string;
  sprites: PokeApiSprites;
  stats: PokeApiStat[];
  types: PokeApiType[];
  weight: number;
}

export interface PokeApiLocalizedName {
  language: NamedApiResource;
  name: string;
}

export interface PokeApiGenus {
  genus: string;
  language: NamedApiResource;
}

export interface PokeApiFlavorText {
  flavor_text: string;
  language: NamedApiResource;
  version: NamedApiResource;
}

export interface PokeApiPokemonSpecies {
  base_happiness: number | null;
  capture_rate: number;
  color: NamedApiResource;
  flavor_text_entries: PokeApiFlavorText[];
  gender_rate: number;
  genera: PokeApiGenus[];
  generation: NamedApiResource;
  growth_rate: NamedApiResource;
  habitat: NamedApiResource | null;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: PokeApiLocalizedName[];
}

