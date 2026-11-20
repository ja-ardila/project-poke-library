import type { Pokemon } from '../../interfaces';
import Button from '../Button/Button';
import CatalogControls, {
  type SortOption,
} from '../CatalogControls/CatalogControls';
import EmptyState from '../EmptyState/EmptyState';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import PokemonGrid from '../PokemonGrid/PokemonGrid';
import Preloader from '../Preloader/Preloader';
import SearchForm from '../SearchForm/SearchForm';

interface MainProps {
  availableTypes: string[];
  canLoadMore: boolean;
  catalogStatus: string;
  errorMessage: string | null;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  isSearchMode: boolean;
  isSearching: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
  onLoadMore: () => void;
  onPokemonSelect: (pokemon: Pokemon) => void;
  onRetry: () => void;
  onSearch: (query: string) => Promise<void>;
  onSortChange: (sort: SortOption) => void;
  onTypeChange: (type: string) => void;
  pokemon: Pokemon[];
  searchEmptyMessage: string | null;
  selectedType: string;
  sortBy: SortOption;
}

function Main({
  availableTypes,
  canLoadMore,
  catalogStatus,
  errorMessage,
  isInitialLoading,
  isLoadingMore,
  isSearchMode,
  isSearching,
  onClearFilters,
  onClearSearch,
  onLoadMore,
  onPokemonSelect,
  onRetry,
  onSearch,
  onSortChange,
  onTypeChange,
  pokemon,
  searchEmptyMessage,
  selectedType,
  sortBy,
}: MainProps): React.JSX.Element {
  const hasBlockingError = Boolean(errorMessage) && pokemon.length === 0;
  const hasFilteredEmptyState =
    !isInitialLoading &&
    !hasBlockingError &&
    !searchEmptyMessage &&
    pokemon.length === 0;

  return (
    <main className="main page__section">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="hero__eyebrow">Enciclopedia Pokémon</p>
          <h1 className="hero__title" id="hero-title">
            Encuentra información de tus Pokémon favoritos
          </h1>
          <p className="hero__description">
            Explora los Pokémon de Kanto por nombre o número y consulta sus
            datos esenciales en un solo lugar.
          </p>
          <SearchForm
            isLoading={isSearching}
            onClear={onClearSearch}
            onSearch={onSearch}
            showClearButton={isSearchMode && !searchEmptyMessage}
          />
        </div>
        <div className="hero__visual" aria-hidden="true" />
      </section>

      <section
        className="catalog"
        aria-busy={isInitialLoading || isLoadingMore || isSearching}
        aria-labelledby="catalog-title"
      >
        <div className="catalog__heading">
          <div>
            <p className="catalog__eyebrow">Primera generación</p>
            <h2 className="catalog__title" id="catalog-title">
              Pokédex de Kanto
            </h2>
          </div>
          <span className="catalog__status">{catalogStatus}</span>
        </div>

        <CatalogControls
          availableTypes={availableTypes}
          disabled={isInitialLoading || isSearching}
          onSortChange={onSortChange}
          onTypeChange={onTypeChange}
          selectedType={selectedType}
          sortBy={sortBy}
        />

        {errorMessage && (
          <ErrorMessage message={errorMessage} onRetry={onRetry} />
        )}

        {isInitialLoading && (
          <Preloader label="Cargando la Pokédex de Kanto" />
        )}

        {!isInitialLoading && searchEmptyMessage && (
          <EmptyState
            actionLabel="Volver al catálogo"
            message={searchEmptyMessage}
            onAction={onClearSearch}
            title="No encontramos ese Pokémon"
          />
        )}

        {hasFilteredEmptyState && (
          <EmptyState
            actionLabel="Limpiar filtros"
            message="Prueba con otro tipo o vuelve a mostrar todos los Pokémon."
            onAction={onClearFilters}
            title="No hay coincidencias"
          />
        )}

        {!isInitialLoading && pokemon.length > 0 && (
          <PokemonGrid
            onPokemonSelect={onPokemonSelect}
            pokemon={pokemon}
          />
        )}

        {canLoadMore && !isInitialLoading && !hasBlockingError && (
          <div className="catalog__load-more">
            <Button
              isLoading={isLoadingMore}
              loadingLabel="Cargando más"
              onClick={onLoadMore}
            >
              Cargar más Pokémon
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Main;

