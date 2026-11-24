import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import CurrentUserContext from '../../contexts/CurrentUserContext';
import type {
  Pokemon,
  PokemonPreference,
  PokemonSpecies,
  SavedPokemonEntry,
} from '../../interfaces';
import {
  FIRST_POKEMON_ID,
  KANTO_POKEMON_LIMIT,
  POKEMON_BATCH_SIZE,
} from '../../utils/constants';
import {
  KANTO_TYPE_IDS,
  KANTO_TYPES,
  type KantoTypeName,
  isKantoTypeName,
} from '../../utils/kantoTypeIndex';
import pokeApi, { PokeApiError } from '../../utils/pokeApi';
import { getApiErrorMessage } from '../../utils/http';
import { getPokemonTypeLabel } from '../../utils/pokemonTypes';
import type { SortOption } from '../CatalogControls/CatalogControls';
import Main from '../Main/Main';
import PokemonDetails from '../PokemonDetails/PokemonDetails';

interface HomePageProps {
  onSavePokemon: (
    pokemon: Pokemon,
    preference: PokemonPreference,
  ) => Promise<void>;
  savedPokemon: SavedPokemonEntry[];
}

async function fetchPokemonIds(
  identifiers: readonly number[],
  signal: AbortSignal,
): Promise<Pokemon[]> {
  return await Promise.all(
    identifiers.map((identifier) => pokeApi.getPokemon(identifier, signal)),
  );
}

async function fetchPokemonBatch(
  startId: number,
  signal: AbortSignal,
): Promise<Pokemon[]> {
  const endId = Math.min(
    startId + POKEMON_BATCH_SIZE - 1,
    KANTO_POKEMON_LIMIT,
  );
  const identifiers = Array.from(
    { length: endId - startId + 1 },
    (_, index) => startId + index,
  );

  return await fetchPokemonIds(identifiers, signal);
}

function getRequestErrorMessage(error: unknown): string {
  if (error instanceof PokeApiError) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function mergePokemon(
  currentPokemon: Pokemon[],
  newPokemon: Pokemon[],
): Pokemon[] {
  const pokemonById = new Map(
    currentPokemon.map((pokemon) => [pokemon.id, pokemon]),
  );

  newPokemon.forEach((pokemon) => pokemonById.set(pokemon.id, pokemon));

  return [...pokemonById.values()].sort(
    (first, second) => first.id - second.id,
  );
}

function HomePage({
  onSavePokemon,
  savedPokemon,
}: HomePageProps): React.JSX.Element {
  const currentUser = useContext(CurrentUserContext);
  const catalogRequestRef = useRef<AbortController | null>(null);
  const searchRequestRef = useRef<AbortController | null>(null);
  const typeRequestRef = useRef<AbortController | null>(null);
  const detailsRequestRef = useRef<AbortController | null>(null);
  const [catalogPokemon, setCatalogPokemon] = useState<Pokemon[]>([]);
  const [nextPokemonId, setNextPokemonId] = useState(FIRST_POKEMON_ID);
  const [typePokemon, setTypePokemon] = useState<Pokemon[]>([]);
  const [nextTypeIndex, setNextTypeIndex] = useState(0);
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [searchEmptyMessage, setSearchEmptyMessage] = useState<string | null>(
    null,
  );
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTypeLoading, setIsTypeLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [selectedSpecies, setSelectedSpecies] =
    useState<PokemonSpecies | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsErrorMessage, setDetailsErrorMessage] = useState<
    string | null
  >(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [savingPreference, setSavingPreference] =
    useState<PokemonPreference | null>(null);

  const loadInitialCatalog = useCallback(async (): Promise<void> => {
    catalogRequestRef.current?.abort();
    const controller = new AbortController();
    catalogRequestRef.current = controller;

    setIsInitialLoading(true);
    setErrorMessage(null);

    try {
      const initialPokemon = await fetchPokemonBatch(
        FIRST_POKEMON_ID,
        controller.signal,
      );
      const lastLoadedId = initialPokemon.at(-1)?.id ?? FIRST_POKEMON_ID - 1;

      setCatalogPokemon(initialPokemon);
      setNextPokemonId(lastLoadedId + 1);
    } catch (error) {
      if (!isAbortError(error)) {
        setErrorMessage(getRequestErrorMessage(error));
      }
    } finally {
      if (catalogRequestRef.current === controller) {
        setIsInitialLoading(false);
      }
    }
  }, []);

  const loadTypePokemon = useCallback(
    async (
      type: KantoTypeName,
      startIndex: number,
      replaceCurrent: boolean,
    ): Promise<void> => {
      typeRequestRef.current?.abort();
      const controller = new AbortController();
      typeRequestRef.current = controller;
      const typeIds = KANTO_TYPE_IDS[type];
      const batchIds = typeIds.slice(
        startIndex,
        startIndex + POKEMON_BATCH_SIZE,
      );

      if (replaceCurrent) {
        setIsTypeLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setErrorMessage(null);

      try {
        const loadedPokemon = await fetchPokemonIds(
          batchIds,
          controller.signal,
        );

        setTypePokemon((currentPokemon) =>
          replaceCurrent
            ? loadedPokemon
            : mergePokemon(currentPokemon, loadedPokemon),
        );
        setNextTypeIndex(startIndex + batchIds.length);
      } catch (error) {
        if (!isAbortError(error)) {
          setErrorMessage(getRequestErrorMessage(error));
        }
      } finally {
        if (typeRequestRef.current === controller) {
          setIsTypeLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const loadTimeout = window.setTimeout(() => {
      void loadInitialCatalog();
    }, 0);

    return () => {
      window.clearTimeout(loadTimeout);
      catalogRequestRef.current?.abort();
      searchRequestRef.current?.abort();
      typeRequestRef.current?.abort();
      detailsRequestRef.current?.abort();
    };
  }, [loadInitialCatalog]);

  const handleTypeChange = useCallback(
    (type: string): void => {
      searchRequestRef.current?.abort();
      setIsSearching(false);
      setIsSearchMode(false);
      setSearchResult(null);
      setSearchEmptyMessage(null);
      setLastSearchQuery('');
      setSelectedType(type);
      setErrorMessage(null);

      typeRequestRef.current?.abort();
      setTypePokemon([]);
      setNextTypeIndex(0);

      if (type === 'all') {
        setIsTypeLoading(false);
        return;
      }

      if (isKantoTypeName(type)) {
        void loadTypePokemon(type, 0, true);
      }
    },
    [loadTypePokemon],
  );

  const handleLoadMore = useCallback(async (): Promise<void> => {
    if (isLoadingMore || isSearchMode) {
      return;
    }

    if (isKantoTypeName(selectedType)) {
      if (nextTypeIndex >= KANTO_TYPE_IDS[selectedType].length) {
        return;
      }

      await loadTypePokemon(selectedType, nextTypeIndex, false);
      return;
    }

    if (nextPokemonId > KANTO_POKEMON_LIMIT) {
      return;
    }

    catalogRequestRef.current?.abort();
    const controller = new AbortController();
    catalogRequestRef.current = controller;

    setIsLoadingMore(true);
    setErrorMessage(null);

    try {
      const newPokemon = await fetchPokemonBatch(
        nextPokemonId,
        controller.signal,
      );
      const lastLoadedId = newPokemon.at(-1)?.id ?? nextPokemonId - 1;

      setCatalogPokemon((currentPokemon) =>
        mergePokemon(currentPokemon, newPokemon),
      );
      setNextPokemonId(lastLoadedId + 1);
    } catch (error) {
      if (!isAbortError(error)) {
        setErrorMessage(getRequestErrorMessage(error));
      }
    } finally {
      if (catalogRequestRef.current === controller) {
        setIsLoadingMore(false);
      }
    }
  }, [
    isLoadingMore,
    isSearchMode,
    loadTypePokemon,
    nextPokemonId,
    nextTypeIndex,
    selectedType,
  ]);

  const handleSearch = useCallback(
    async (query: string): Promise<void> => {
      searchRequestRef.current?.abort();
      typeRequestRef.current?.abort();
      const controller = new AbortController();
      searchRequestRef.current = controller;

      setIsSearching(true);
      setIsSearchMode(true);
      setLastSearchQuery(query);
      setSearchResult(null);
      setSearchEmptyMessage(null);
      setSelectedType('all');
      setTypePokemon([]);
      setNextTypeIndex(0);
      setIsTypeLoading(false);
      setErrorMessage(null);

      try {
        const pokemon = await pokeApi.getPokemon(query, controller.signal);

        if (pokemon.id > KANTO_POKEMON_LIMIT) {
          setSearchEmptyMessage(
            'Ese Pokémon no pertenece a la Pokédex de Kanto.',
          );
          return;
        }

        setSearchResult(pokemon);
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        if (error instanceof PokeApiError && error.status === 404) {
          setSearchEmptyMessage(
            'Revisa el nombre o número e intenta nuevamente.',
          );
          return;
        }

        setErrorMessage(getRequestErrorMessage(error));
      } finally {
        if (searchRequestRef.current === controller) {
          setIsSearching(false);
        }
      }
    },
    [],
  );

  const handleClearSearch = useCallback((): void => {
    searchRequestRef.current?.abort();
    typeRequestRef.current?.abort();
    searchRequestRef.current = null;
    setIsSearching(false);
    setIsSearchMode(false);
    setSearchResult(null);
    setSearchEmptyMessage(null);
    setLastSearchQuery('');
    setSelectedType('all');
    setTypePokemon([]);
    setNextTypeIndex(0);
    setIsTypeLoading(false);
    setErrorMessage(null);
  }, []);

  const loadPokemonSpecies = useCallback(
    async (pokemon: Pokemon): Promise<void> => {
      detailsRequestRef.current?.abort();
      const controller = new AbortController();
      detailsRequestRef.current = controller;

      setSelectedSpecies(null);
      setDetailsErrorMessage(null);
      setIsDetailsLoading(true);

      try {
        const species = await pokeApi.getPokemonSpecies(
          pokemon.id,
          controller.signal,
        );

        if (detailsRequestRef.current === controller) {
          setSelectedSpecies(species);
        }
      } catch (error) {
        if (!isAbortError(error)) {
          setDetailsErrorMessage(getRequestErrorMessage(error));
        }
      } finally {
        if (detailsRequestRef.current === controller) {
          setIsDetailsLoading(false);
        }
      }
    },
    [],
  );

  const handlePokemonSelect = useCallback(
    (pokemon: Pokemon): void => {
      setSaveErrorMessage(null);
      setSelectedPokemon(pokemon);
      void loadPokemonSpecies(pokemon);
    },
    [loadPokemonSpecies],
  );

  const handleCloseDetails = useCallback((): void => {
    detailsRequestRef.current?.abort();
    detailsRequestRef.current = null;
    setSelectedPokemon(null);
    setSelectedSpecies(null);
    setDetailsErrorMessage(null);
    setSaveErrorMessage(null);
    setSavingPreference(null);
    setIsDetailsLoading(false);
  }, []);

  const handleRetryDetails = useCallback((): void => {
    if (selectedPokemon) {
      void loadPokemonSpecies(selectedPokemon);
    }
  }, [loadPokemonSpecies, selectedPokemon]);

  const handleSavePreference = useCallback(
    async (preference: PokemonPreference): Promise<void> => {
      if (!selectedPokemon) {
        return;
      }

      setSaveErrorMessage(null);
      setSavingPreference(preference);

      try {
        await onSavePokemon(selectedPokemon, preference);
      } catch (error) {
        setSaveErrorMessage(
          getApiErrorMessage(
            error,
            'No pudimos guardar tu preferencia. Inténtalo nuevamente.',
          ),
        );
      } finally {
        setSavingPreference(null);
      }
    },
    [onSavePokemon, selectedPokemon],
  );

  const selectedSavedEntry = useMemo(
    () =>
      selectedPokemon
        ? (savedPokemon.find(
            (entry) => entry.pokemonId === selectedPokemon.id,
          ) ?? null)
        : null,
    [savedPokemon, selectedPokemon],
  );

  const availableTypes = useMemo(
    () =>
      [...KANTO_TYPES].sort((first, second) =>
        getPokemonTypeLabel(first).localeCompare(
          getPokemonTypeLabel(second),
          'es',
        ),
      ),
    [],
  );

  const visiblePokemon = useMemo(() => {
    const sourcePokemon = isSearchMode
      ? searchResult
        ? [searchResult]
        : []
      : selectedType === 'all'
        ? catalogPokemon
        : typePokemon;

    return [...sourcePokemon].sort((first, second) =>
      sortBy === 'name'
        ? first.name.localeCompare(second.name, 'es')
        : first.id - second.id,
    );
  }, [
    catalogPokemon,
    isSearchMode,
    searchResult,
    selectedType,
    sortBy,
    typePokemon,
  ]);

  const catalogStatus = useMemo(() => {
    if (isSearching) {
      return 'Buscando Pokémon';
    }

    if (isSearchMode) {
      return searchResult ? '1 resultado' : 'Sin resultados';
    }

    if (isKantoTypeName(selectedType)) {
      const typeLabel = getPokemonTypeLabel(selectedType);

      if (isTypeLoading) {
        return 'Cargando tipo ' + typeLabel;
      }

      return (
        typePokemon.length +
        ' de ' +
        KANTO_TYPE_IDS[selectedType].length +
        ' Pokémon de tipo ' +
        typeLabel
      );
    }

    if (isInitialLoading) {
      return 'Cargando catálogo';
    }

    return catalogPokemon.length + ' Pokémon cargados';
  }, [
    catalogPokemon.length,
    isInitialLoading,
    isSearchMode,
    isSearching,
    isTypeLoading,
    searchResult,
    selectedType,
    typePokemon.length,
  ]);

  const handleRetry = useCallback((): void => {
    if (isSearchMode && lastSearchQuery) {
      void handleSearch(lastSearchQuery);
      return;
    }

    if (isKantoTypeName(selectedType)) {
      void loadTypePokemon(
        selectedType,
        typePokemon.length === 0 ? 0 : nextTypeIndex,
        typePokemon.length === 0,
      );
      return;
    }

    if (catalogPokemon.length === 0) {
      void loadInitialCatalog();
      return;
    }

    void handleLoadMore();
  }, [
    catalogPokemon.length,
    handleLoadMore,
    handleSearch,
    isSearchMode,
    lastSearchQuery,
    loadInitialCatalog,
    loadTypePokemon,
    nextTypeIndex,
    selectedType,
    typePokemon.length,
  ]);

  return (
    <>
      <Main
        availableTypes={availableTypes}
        canLoadMore={
          !isSearchMode &&
          (isKantoTypeName(selectedType)
            ? nextTypeIndex < KANTO_TYPE_IDS[selectedType].length
            : nextPokemonId <= KANTO_POKEMON_LIMIT)
        }
        catalogStatus={catalogStatus}
        errorMessage={errorMessage}
        isInitialLoading={
          !isSearchMode &&
          (isTypeLoading ||
            (selectedType === 'all' && isInitialLoading))
        }
        isLoadingMore={isLoadingMore}
        isSearching={isSearching}
        isSearchMode={isSearchMode}
        onClearFilters={() => handleTypeChange('all')}
        onClearSearch={handleClearSearch}
        onLoadMore={() => void handleLoadMore()}
        onPokemonSelect={handlePokemonSelect}
        onRetry={handleRetry}
        onSearch={handleSearch}
        onSortChange={setSortBy}
        onTypeChange={handleTypeChange}
        pokemon={visiblePokemon}
        searchEmptyMessage={searchEmptyMessage}
        selectedType={selectedType}
        sortBy={sortBy}
      />

      <PokemonDetails
        errorMessage={detailsErrorMessage}
        isAuthenticated={Boolean(currentUser)}
        isLoading={isDetailsLoading}
        onClose={handleCloseDetails}
        onRetry={handleRetryDetails}
        onSavePreference={handleSavePreference}
        pokemon={selectedPokemon}
        savedPreference={selectedSavedEntry?.preference ?? null}
        saveErrorMessage={saveErrorMessage}
        savingPreference={savingPreference}
        species={selectedSpecies}
      />
    </>
  );
}

export default HomePage;

