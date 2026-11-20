import type { Pokemon } from '../../interfaces';
import PokemonCard from '../PokemonCard/PokemonCard';

interface PokemonGridProps {
  pokemon: Pokemon[];
}

function PokemonGrid({ pokemon }: PokemonGridProps): React.JSX.Element {
  return (
    <ul className="pokemon-grid" aria-label="Catálogo de Pokémon">
      {pokemon.map((item) => (
        <li className="pokemon-grid__item" key={item.id}>
          <PokemonCard pokemon={item} />
        </li>
      ))}
    </ul>
  );
}

export default PokemonGrid;

