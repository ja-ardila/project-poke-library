import type { Pokemon } from '../../interfaces';
import {
  getPokemonTypeLabel,
  getPokemonTypeModifier,
} from '../../utils/pokemonTypes';

interface PokemonCardProps {
  pokemon: Pokemon;
}

function PokemonCard({ pokemon }: PokemonCardProps): React.JSX.Element {
  const formattedId = String(pokemon.id).padStart(3, '0');

  return (
    <article className="pokemon-card">
      <div className="pokemon-card__image-wrapper">
        <span className="pokemon-card__number">#{formattedId}</span>
        <img
          className="pokemon-card__image"
          src={pokemon.imageUrl}
          alt={pokemon.name}
          loading="lazy"
        />
      </div>
      <div className="pokemon-card__content">
        <h3 className="pokemon-card__name">{pokemon.name}</h3>
        <ul className="pokemon-card__types" aria-label="Tipos">
          {pokemon.types.map((type) => (
            <li
              className={
                'pokemon-card__type pokemon-card__type_' +
                getPokemonTypeModifier(type.name)
              }
              key={type.slot}
            >
              {getPokemonTypeLabel(type.name)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default PokemonCard;

