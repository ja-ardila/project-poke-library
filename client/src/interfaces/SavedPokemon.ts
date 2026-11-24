export type PokemonPreference = 'favorite' | 'disliked';

export interface SavedPokemonEntry {
  _id: string;
  pokemonId: number;
  pokemonName: string;
  imageUrl: string;
  types: string[];
  preference: PokemonPreference;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedPokemonData {
  pokemonId: number;
  pokemonName: string;
  imageUrl: string;
  types: string[];
  preference: PokemonPreference;
  note?: string;
}

export interface UpdateSavedPokemonData {
  preference?: PokemonPreference;
  note?: string;
}
