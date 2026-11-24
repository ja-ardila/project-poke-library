export const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';
export const FIRST_POKEMON_ID = 1;
export const KANTO_POKEMON_LIMIT = 151;
export const POKEMON_BATCH_SIZE = 12;
export const FALLBACK_POKEMON_IMAGE = '/pokemon-placeholder.svg';
export const AUTH_TOKEN_KEY = 'jwt';
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
).replace(/\/$/, '');

