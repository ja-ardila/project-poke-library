import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import About from './components/About/About';
import AppLayout from './components/AppLayout/AppLayout';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import MyPokemon from './components/MyPokemon/MyPokemon';
import NotFound from './components/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute/PublicOnlyRoute';
import Register from './components/Register/Register';
import CurrentUserContext from './contexts/CurrentUserContext';
import type {
  CurrentUser,
  LoginCredentials,
  Pokemon,
  PokemonPreference,
  RegisterData,
  SavedPokemonEntry,
  UpdateSavedPokemonData,
} from './interfaces';
import {
  createSavedPokemon,
  deleteSavedPokemon,
  getCurrentUser,
  getSavedPokemon,
  updateSavedPokemon,
} from './utils/api';
import { signIn, signUp } from './utils/auth';
import { AUTH_TOKEN_KEY } from './utils/constants';
import { ApiError, getApiErrorMessage } from './utils/http';

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function App(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [savedPokemon, setSavedPokemon] = useState<SavedPokemonEntry[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(() =>
    Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  );
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [libraryErrorMessage, setLibraryErrorMessage] = useState<string | null>(
    null,
  );

  const clearSession = useCallback((): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setCurrentUser(null);
    setSavedPokemon([]);
    setLibraryErrorMessage(null);
    setIsLibraryLoading(false);
  }, []);

  const expireSession = useCallback((): void => {
    clearSession();
    navigate('/signin', {
      replace: true,
      state: { sessionExpired: true },
    });
  }, [clearSession, navigate]);

  const loadLibrary = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      setIsLibraryLoading(true);
      setLibraryErrorMessage(null);

      try {
        const entries = await getSavedPokemon(signal);
        setSavedPokemon(entries);
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          expireSession();
          return;
        }

        setLibraryErrorMessage(
          getApiErrorMessage(
            error,
            'No pudimos cargar tu biblioteca. Inténtalo nuevamente.',
          ),
        );
      } finally {
        if (!signal?.aborted) {
          setIsLibraryLoading(false);
        }
      }
    },
    [expireSession],
  );

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      return undefined;
    }

    const controller = new AbortController();

    async function restoreSession(): Promise<void> {
      try {
        const user = await getCurrentUser(controller.signal);
        setCurrentUser(user);
        await loadLibrary(controller.signal);
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        if (
          error instanceof ApiError &&
          (error.status === 401 || error.status === 404)
        ) {
          clearSession();
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingAuth(false);
        }
      }
    }

    void restoreSession();

    return () => controller.abort();
  }, [clearSession, loadLibrary]);

  const handleRegister = useCallback(
    async (data: RegisterData): Promise<void> => {
      await signUp(data);
      navigate('/signin', {
        replace: true,
        state: { registrationSuccess: true },
      });
    },
    [navigate],
  );

  const handleLogin = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      const authResponse = await signIn(credentials);

      localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
      setCurrentUser(authResponse.user);
      setIsCheckingAuth(false);
      await loadLibrary();
      navigate('/', { replace: true });
    },
    [loadLibrary, navigate],
  );

  const handleLogout = useCallback((): void => {
    clearSession();
    navigate('/', { replace: true });
  }, [clearSession, navigate]);

  const handleSavePokemon = useCallback(
    async (
      pokemon: Pokemon,
      preference: PokemonPreference,
    ): Promise<void> => {
      try {
        const existingEntry = savedPokemon.find(
          (entry) => entry.pokemonId === pokemon.id,
        );

        if (existingEntry) {
          const updatedEntry = await updateSavedPokemon(existingEntry._id, {
            preference,
          });
          setSavedPokemon((entries) =>
            entries.map((entry) =>
              entry._id === updatedEntry._id ? updatedEntry : entry,
            ),
          );
          return;
        }

        const createdEntry = await createSavedPokemon({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          imageUrl: pokemon.imageUrl,
          types: pokemon.types.map((type) => type.name),
          preference,
          note: '',
        });
        setSavedPokemon((entries) => [createdEntry, ...entries]);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          expireSession();
        }

        throw error;
      }
    },
    [expireSession, savedPokemon],
  );

  const handleUpdateSavedPokemon = useCallback(
    async (
      entryId: string,
      data: UpdateSavedPokemonData,
    ): Promise<SavedPokemonEntry> => {
      try {
        const updatedEntry = await updateSavedPokemon(entryId, data);
        setSavedPokemon((entries) =>
          entries.map((entry) =>
            entry._id === updatedEntry._id ? updatedEntry : entry,
          ),
        );
        return updatedEntry;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          expireSession();
        }

        throw error;
      }
    },
    [expireSession],
  );

  const handleDeleteSavedPokemon = useCallback(
    async (entryId: string): Promise<void> => {
      try {
        await deleteSavedPokemon(entryId);
        setSavedPokemon((entries) =>
          entries.filter((entry) => entry._id !== entryId),
        );
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          expireSession();
        }

        throw error;
      }
    },
    [expireSession],
  );

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route
          element={
            <AppLayout
              isCheckingAuth={isCheckingAuth}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            index
            element={
              <HomePage
                onSavePokemon={handleSavePokemon}
                savedPokemon={savedPokemon}
              />
            }
          />
          <Route path="about" element={<About />} />
          <Route
            path="signin"
            element={
              <PublicOnlyRoute isCheckingAuth={isCheckingAuth}>
                <Login onLogin={handleLogin} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="signup"
            element={
              <PublicOnlyRoute isCheckingAuth={isCheckingAuth}>
                <Register onRegister={handleRegister} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="mypokemon"
            element={
              <ProtectedRoute isCheckingAuth={isCheckingAuth}>
                <MyPokemon
                  entries={savedPokemon}
                  errorMessage={libraryErrorMessage}
                  isLoading={isLibraryLoading}
                  onDelete={handleDeleteSavedPokemon}
                  onRetry={loadLibrary}
                  onUpdate={handleUpdateSavedPokemon}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CurrentUserContext.Provider>
  );
}

export default App;
