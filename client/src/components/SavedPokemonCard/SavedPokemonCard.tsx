import type { SavedPokemonEntry } from '../../interfaces';
import {
  getPokemonTypeLabel,
  getPokemonTypeModifier,
} from '../../utils/pokemonTypes';

interface SavedPokemonCardProps {
  entry: SavedPokemonEntry;
  onSelect: (entry: SavedPokemonEntry) => void;
}

function SavedPokemonCard({
  entry,
  onSelect,
}: SavedPokemonCardProps): React.JSX.Element {
  const formattedId = String(entry.pokemonId).padStart(3, '0');

  return (
    <article className="saved-pokemon-card">
      <button
        className="saved-pokemon-card__action"
        type="button"
        aria-label={`Abrir información personal de ${entry.pokemonName}`}
        onClick={() => onSelect(entry)}
      />
      <div className="saved-pokemon-card__image-wrapper">
        <span className="saved-pokemon-card__number">#{formattedId}</span>
        <span className="saved-pokemon-card__preference">
          {entry.preference === 'favorite' ? 'Favorito' : 'No me gusta'}
        </span>
        <img
          className="saved-pokemon-card__image"
          src={entry.imageUrl}
          alt={entry.pokemonName}
          loading="lazy"
        />
      </div>
      <div className="saved-pokemon-card__content">
        <h3 className="saved-pokemon-card__name">{entry.pokemonName}</h3>
        <ul className="saved-pokemon-card__types" aria-label="Tipos">
          {entry.types.map((type) => (
            <li
              className={
                'pokemon-card__type pokemon-card__type_' +
                getPokemonTypeModifier(type)
              }
              key={type}
            >
              {getPokemonTypeLabel(type)}
            </li>
          ))}
        </ul>
        <p className="saved-pokemon-card__note">
          {entry.note ? 'Tiene una nota personal' : 'Sin nota personal'}
        </p>
      </div>
    </article>
  );
}

export default SavedPokemonCard;
