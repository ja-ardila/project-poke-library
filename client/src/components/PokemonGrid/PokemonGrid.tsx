import type { Pokemon } from '../../interfaces';
import PokemonCard from '../PokemonCard/PokemonCard';

interface PokemonGridProps {
  onPokemonSelect: (pokemon: Pokemon) => void;
  pokemon: Pokemon[];
}

function PokemonGrid({
  onPokemonSelect,
  pokemon,
}: PokemonGridProps): React.JSX.Element {
  return (
    <ul className="pokemon-grid" aria-label="Catálogo de Pokémon">
      {pokemon.map((item) => (
        <li className="pokemon-grid__item" key={item.id}>
          <PokemonCard
            onSelect={onPokemonSelect}
            pokemon={item}
          />
        </li>
      ))}
    </ul>
  );
}

export default PokemonGrid;

