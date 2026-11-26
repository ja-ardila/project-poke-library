import { useState } from 'react';

import type { SavedPokemonEntry } from '../../interfaces';
import { getApiErrorMessage } from '../../utils/http';
import Button from '../Button/Button';
import Popup from '../Popup/Popup';

interface DeletePokemonConfirmationProps {
  entry: SavedPokemonEntry;
  onClose: () => void;
  onConfirm: (entryId: string) => Promise<void>;
}

function DeletePokemonConfirmation({
  entry,
  onClose,
  onConfirm,
}: DeletePokemonConfirmationProps): React.JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const titleId = `delete-pokemon-${entry._id}`;

  async function handleConfirm(): Promise<void> {
    setErrorMessage(null);
    setIsDeleting(true);

    try {
      await onConfirm(entry._id);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No pudimos eliminar este Pokémon. Inténtalo nuevamente.',
        ),
      );
      setIsDeleting(false);
    }
  }

  return (
    <Popup
      contentClassName="popup__content_type_delete-confirmation"
      isOpen
      onClose={isDeleting ? () => undefined : onClose}
      titleId={titleId}
    >
      <div className="delete-confirmation">
        <div className="delete-confirmation__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16" />
            <path d="M9 7V4h6v3" />
            <path d="m6.5 7 .7 13h9.6l.7-13" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </div>
        <p className="delete-confirmation__eyebrow">Biblioteca privada</p>
        <h2 className="delete-confirmation__title" id={titleId}>
          ¿Eliminar a {entry.pokemonName}?
        </h2>
        <p className="delete-confirmation__description">
          Se eliminarán su preferencia y su nota personal. Esta acción no se
          puede deshacer.
        </p>
        {errorMessage && (
          <p className="delete-confirmation__error" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="delete-confirmation__actions">
          <Button
            className="delete-confirmation__submit"
            isLoading={isDeleting}
            loadingLabel="Eliminando"
            type="button"
            onClick={() => void handleConfirm()}
          >
            Eliminar
          </Button>
          <Button
            disabled={isDeleting}
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Popup>
  );
}

export default DeletePokemonConfirmation;
