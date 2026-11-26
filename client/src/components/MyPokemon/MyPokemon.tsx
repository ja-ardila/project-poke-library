import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CurrentUserContext from '../../contexts/CurrentUserContext';
import type {
  SavedPokemonEntry,
  UpdateSavedPokemonData,
} from '../../interfaces';
import DeletePokemonConfirmation from '../DeletePokemonConfirmation/DeletePokemonConfirmation';
import EmptyState from '../EmptyState/EmptyState';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Preloader from '../Preloader/Preloader';
import SavedPokemonCard from '../SavedPokemonCard/SavedPokemonCard';
import SavedPokemonDetails from '../SavedPokemonDetails/SavedPokemonDetails';

interface MyPokemonProps {
  entries: SavedPokemonEntry[];
  errorMessage: string | null;
  isLoading: boolean;
  onDelete: (entryId: string) => Promise<void>;
  onRetry: () => Promise<void>;
  onUpdate: (
    entryId: string,
    data: UpdateSavedPokemonData,
  ) => Promise<SavedPokemonEntry>;
}

function MyPokemon({
  entries,
  errorMessage,
  isLoading,
  onDelete,
  onRetry,
  onUpdate,
}: MyPokemonProps): React.JSX.Element {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] =
    useState<SavedPokemonEntry | null>(null);
  const [entryPendingDeletion, setEntryPendingDeletion] =
    useState<SavedPokemonEntry | null>(null);
  const favoriteEntries = useMemo(
    () => entries.filter((entry) => entry.preference === 'favorite'),
    [entries],
  );
  const dislikedEntries = useMemo(
    () => entries.filter((entry) => entry.preference === 'disliked'),
    [entries],
  );

  async function handleUpdate(
    entryId: string,
    data: UpdateSavedPokemonData,
  ): Promise<SavedPokemonEntry> {
    const updatedEntry = await onUpdate(entryId, data);
    setSelectedEntry(updatedEntry);
    return updatedEntry;
  }

  async function handleDelete(entryId: string): Promise<void> {
    await onDelete(entryId);
    setEntryPendingDeletion(null);

    if (selectedEntry?._id === entryId) {
      setSelectedEntry(null);
    }
  }

  function handleRequestDelete(entry: SavedPokemonEntry): void {
    if (selectedEntry?._id === entry._id) {
      setSelectedEntry(entry);
    }

    setEntryPendingDeletion(entry);
  }

  function renderEntryList(
    listEntries: SavedPokemonEntry[],
    label: string,
  ): React.JSX.Element | null {
    if (listEntries.length === 0) {
      return null;
    }

    return (
      <ul className="my-pokemon__grid" aria-label={label}>
        {listEntries.map((entry) => (
          <li className="my-pokemon__item" key={entry._id}>
            <SavedPokemonCard
              entry={entry}
              onRequestDelete={handleRequestDelete}
              onSelect={setSelectedEntry}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="my-pokemon page__section">
      <header className="my-pokemon__header">
        <p className="my-pokemon__eyebrow">Biblioteca privada</p>
        <h1 className="my-pokemon__title">Mis Pokémon</h1>
        <p className="my-pokemon__description">
          {currentUser?.name}, aquí puedes revisar tus preferencias y abrir
          cada tarjeta para editar una nota personal.
        </p>
        {!isLoading && !errorMessage && entries.length > 0 && (
          <p className="my-pokemon__count">
            {entries.length} {entries.length === 1 ? 'Pokémon guardado' : 'Pokémon guardados'}
          </p>
        )}
      </header>

      {isLoading && <Preloader label="Cargando tu biblioteca" />}

      {!isLoading && errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onRetry={() => void onRetry()}
        />
      )}

      {!isLoading && !errorMessage && entries.length === 0 && (
        <EmptyState
          actionLabel="Explorar la Pokédex"
          message="Abre el detalle de un Pokémon y guárdalo como favorito o como uno que no te gusta."
          onAction={() => navigate('/')}
          title="Tu biblioteca está vacía"
        />
      )}

      {!isLoading && !errorMessage && favoriteEntries.length > 0 && (
        <section className="my-pokemon__section" aria-labelledby="favorites-title">
          <div className="my-pokemon__section-heading">
            <h2 className="my-pokemon__section-title" id="favorites-title">
              Favoritos
            </h2>
            <span>{favoriteEntries.length}</span>
          </div>
          {renderEntryList(favoriteEntries, 'Pokémon favoritos')}
        </section>
      )}

      {!isLoading && !errorMessage && dislikedEntries.length > 0 && (
        <section className="my-pokemon__section" aria-labelledby="disliked-title">
          <div className="my-pokemon__section-heading">
            <h2 className="my-pokemon__section-title" id="disliked-title">
              No me gustan
            </h2>
            <span>{dislikedEntries.length}</span>
          </div>
          {renderEntryList(dislikedEntries, 'Pokémon que no me gustan')}
        </section>
      )}

      {selectedEntry && !entryPendingDeletion && (
        <SavedPokemonDetails
          key={selectedEntry._id}
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onRequestDelete={handleRequestDelete}
          onUpdate={handleUpdate}
        />
      )}

      {entryPendingDeletion && (
        <DeletePokemonConfirmation
          key={entryPendingDeletion._id}
          entry={entryPendingDeletion}
          onClose={() => setEntryPendingDeletion(null)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}

export default MyPokemon;
