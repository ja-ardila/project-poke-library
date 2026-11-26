import type {
  CreateSavedPokemonData,
  CurrentUser,
  SavedPokemonEntry,
  UpdateSavedPokemonData,
} from '../interfaces';
import { AUTH_TOKEN_KEY } from './constants';
import { ApiError, requestJson } from './http';

function getAuthorizationHeaders(): HeadersInit {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    throw new ApiError(401, 'Inicia sesión para continuar.');
  }

  return { Authorization: `Bearer ${token}` };
}

function getCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  return requestJson<CurrentUser>('/users/me', {
    headers: getAuthorizationHeaders(),
    signal,
  });
}

function getSavedPokemon(
  signal?: AbortSignal,
): Promise<SavedPokemonEntry[]> {
  return requestJson<SavedPokemonEntry[]>('/pokemon', {
    headers: getAuthorizationHeaders(),
    signal,
  });
}

function createSavedPokemon(
  data: CreateSavedPokemonData,
): Promise<SavedPokemonEntry> {
  return requestJson<SavedPokemonEntry>('/pokemon', {
    method: 'POST',
    headers: getAuthorizationHeaders(),
    body: JSON.stringify(data),
  });
}

function updateSavedPokemon(
  entryId: string,
  data: UpdateSavedPokemonData,
): Promise<SavedPokemonEntry> {
  return requestJson<SavedPokemonEntry>(`/pokemon/${entryId}`, {
    method: 'PATCH',
    headers: getAuthorizationHeaders(),
    body: JSON.stringify(data),
  });
}

function deleteSavedPokemon(entryId: string): Promise<SavedPokemonEntry> {
  return requestJson<SavedPokemonEntry>(`/pokemon/${entryId}`, {
    method: 'DELETE',
    headers: getAuthorizationHeaders(),
  });
}

export {
  createSavedPokemon,
  deleteSavedPokemon,
  getCurrentUser,
  getSavedPokemon,
  updateSavedPokemon,
};
