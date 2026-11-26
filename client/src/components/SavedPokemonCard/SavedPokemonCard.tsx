import type { SavedPokemonEntry } from '../../interfaces';
import {
  getPokemonTypeLabel,
  getPokemonTypeModifier,
} from '../../utils/pokemonTypes';

interface SavedPokemonCardProps {
  entry: SavedPokemonEntry;
  onRequestDelete: (entry: SavedPokemonEntry) => void;
  onSelect: (entry: SavedPokemonEntry) => void;
}

function SavedPokemonCard({
  entry,
  onRequestDelete,
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
      <button
        className="saved-pokemon-card__delete"
        type="button"
        aria-label={`Eliminar a ${entry.pokemonName} de mi biblioteca`}
        title="Eliminar de mi biblioteca"
        onClick={() => onRequestDelete(entry)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="m6.5 7 .7 13h9.6l.7-13" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      </button>
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
