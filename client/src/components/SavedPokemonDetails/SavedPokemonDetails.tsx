import { useState } from 'react';
import type { FormEvent } from 'react';

import type {
  PokemonPreference,
  SavedPokemonEntry,
  UpdateSavedPokemonData,
} from '../../interfaces';
import { getApiErrorMessage } from '../../utils/http';
import {
  getPokemonTypeLabel,
  getPokemonTypeModifier,
} from '../../utils/pokemonTypes';
import Button from '../Button/Button';
import Popup from '../Popup/Popup';

interface SavedPokemonDetailsProps {
  entry: SavedPokemonEntry;
  onClose: () => void;
  onDelete: (entryId: string) => Promise<void>;
  onUpdate: (
    entryId: string,
    data: UpdateSavedPokemonData,
  ) => Promise<SavedPokemonEntry>;
}

function SavedPokemonDetails({
  entry,
  onClose,
  onDelete,
  onUpdate,
}: SavedPokemonDetailsProps): React.JSX.Element {
  const [note, setNote] = useState(entry.note);
  const [preference, setPreference] = useState<PokemonPreference>(
    entry.preference,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const titleId = `saved-pokemon-${entry._id}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      await onUpdate(entry._id, { note, preference });
      setSuccessMessage('Tus cambios se guardaron correctamente.');
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No pudimos actualizar este Pokémon. Inténtalo nuevamente.',
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(): Promise<void> {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDeleting(true);

    try {
      await onDelete(entry._id);
      onClose();
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No pudimos eliminar este Pokémon. Inténtalo nuevamente.',
        ),
      );
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  }

  return (
    <Popup
      contentClassName="popup__content_type_saved-pokemon"
      isOpen
      onClose={onClose}
      titleId={titleId}
    >
      <article className="saved-details">
        <header className="saved-details__header">
          <img
            className="saved-details__image"
            src={entry.imageUrl}
            alt={entry.pokemonName}
          />
          <div className="saved-details__heading">
            <p className="saved-details__number">
              #{String(entry.pokemonId).padStart(3, '0')}
            </p>
            <h2 className="saved-details__title" id={titleId}>
              {entry.pokemonName}
            </h2>
            <ul className="saved-details__types" aria-label="Tipos">
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
          </div>
        </header>

        <form className="saved-details__form" onSubmit={handleSubmit}>
          <fieldset className="saved-details__fieldset">
            <legend className="saved-details__legend">Tu preferencia</legend>
            <label className="saved-details__option">
              <input
                type="radio"
                name="preference"
                value="favorite"
                checked={preference === 'favorite'}
                onChange={() => setPreference('favorite')}
              />
              <span>Favorito</span>
            </label>
            <label className="saved-details__option">
              <input
                type="radio"
                name="preference"
                value="disliked"
                checked={preference === 'disliked'}
                onChange={() => setPreference('disliked')}
              />
              <span>No me gusta</span>
            </label>
          </fieldset>

          <label className="saved-details__note-field">
            <span className="saved-details__label">Nota personal</span>
            <textarea
              className="saved-details__textarea"
              name="note"
              placeholder="Escribe aquí lo que quieras recordar..."
              maxLength={1000}
              rows={6}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <span className="saved-details__counter">{note.length}/1000</span>
          </label>

          {errorMessage && (
            <p className="saved-details__message saved-details__message_error" role="alert">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="saved-details__message" role="status">
              {successMessage}
            </p>
          )}

          <div className="saved-details__actions">
            <Button
              isLoading={isSaving}
              loadingLabel="Guardando"
              type="submit"
            >
              Guardar cambios
            </Button>
            {!isConfirmingDelete ? (
              <Button
                className="saved-details__delete"
                type="button"
                variant="ghost"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Eliminar de mi biblioteca
              </Button>
            ) : (
              <div className="saved-details__confirmation" role="alert">
                <span>¿Eliminar definitivamente?</span>
                <Button
                  className="saved-details__confirm-delete"
                  isLoading={isDeleting}
                  loadingLabel="Eliminando"
                  type="button"
                  onClick={() => void handleDelete()}
                >
                  Sí, eliminar
                </Button>
                <Button
                  disabled={isDeleting}
                  type="button"
                  variant="secondary"
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </form>
      </article>
    </Popup>
  );
}

export default SavedPokemonDetails;
