export interface PokemonType {
  name: string;
  slot: number;
}

export interface PokemonAbility {
  isHidden: boolean;
  name: string;
  slot: number;
}

export interface PokemonStat {
  baseValue: number;
  effort: number;
  name: string;
}

export interface Pokemon {
  abilities: PokemonAbility[];
  apiName: string;
  baseExperience: number | null;
  height: number;
  id: number;
  imageUrl: string;
  name: string;
  stats: PokemonStat[];
  types: PokemonType[];
  weight: number;
}

export interface PokemonSpecies {
  apiName: string;
  baseHappiness: number | null;
  captureRate: number;
  category: string | null;
  color: string;
  description: string | null;
  genderRate: number;
  generation: string;
  growthRate: string;
  habitat: string | null;
  id: number;
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  name: string;
}

export interface PokemonDetails extends Pokemon {
  species: PokemonSpecies;
}

