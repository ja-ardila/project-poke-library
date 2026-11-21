import { getPokemonTypeLabel } from '../../utils/pokemonTypes';

export type SortOption = 'id' | 'name';

interface CatalogControlsProps {
  availableTypes: string[];
  disabled?: boolean;
  onSortChange: (sort: SortOption) => void;
  onTypeChange: (type: string) => void;
  selectedType: string;
  sortBy: SortOption;
}

function CatalogControls({
  availableTypes,
  disabled = false,
  onSortChange,
  onTypeChange,
  selectedType,
  sortBy,
}: CatalogControlsProps): React.JSX.Element {
  return (
    <div className="catalog-controls" aria-label="Controles del catálogo">
      <label className="catalog-controls__field">
        <span className="catalog-controls__label">Tipo</span>
        <select
          className="catalog-controls__select"
          disabled={disabled}
          value={selectedType}
          onChange={(event) => onTypeChange(event.target.value)}
        >
          <option value="all">Todos</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {getPokemonTypeLabel(type)}
            </option>
          ))}
        </select>
      </label>

      <label className="catalog-controls__field">
        <span className="catalog-controls__label">Ordenar por</span>
        <select
          className="catalog-controls__select"
          disabled={disabled}
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value as SortOption)
          }
        >
          <option value="id">Número</option>
          <option value="name">Nombre</option>
        </select>
      </label>
    </div>
  );
}

export default CatalogControls;

