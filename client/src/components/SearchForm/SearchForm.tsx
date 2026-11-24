import { useState } from 'react';

import { KANTO_POKEMON_LIMIT } from '../../utils/constants';
import Button from '../Button/Button';

interface SearchFormProps {
  isLoading: boolean;
  onClear: () => void;
  onSearch: (query: string) => Promise<void> | void;
  showClearButton: boolean;
}

function SearchForm({
  isLoading,
  onClear,
  onSearch,
  showClearButton,
}: SearchFormProps): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      setValidationError('Escribe el nombre o el número de un Pokémon.');
      return;
    }

    if (!/^[a-z0-9 -]+$/.test(normalizedQuery)) {
      setValidationError(
        'Usa solamente letras, números, espacios o guiones.',
      );
      return;
    }

    if (/^\d+$/.test(normalizedQuery)) {
      const pokemonId = Number(normalizedQuery);

      if (pokemonId < 1 || pokemonId > KANTO_POKEMON_LIMIT) {
        setValidationError('Escribe un número entre 1 y 151.');
        return;
      }
    }

    setValidationError(null);
    void onSearch(normalizedQuery);
  }

  function handleClear(): void {
    setQuery('');
    setValidationError(null);
    onClear();
  }

  return (
    <form
      className="search-form"
      role="search"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="search-form__label" htmlFor="pokemon-search">
        Busca por nombre o número
      </label>
      <div className="search-form__controls">
        <input
          className="search-form__input"
          aria-describedby={
            validationError ? 'pokemon-search-error' : undefined
          }
          aria-invalid={Boolean(validationError)}
          autoComplete="off"
          disabled={isLoading}
          id="pokemon-search"
          name="pokemon"
          placeholder="Ej. Pikachu o 25"
          required
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setValidationError(null);
          }}
        />
        <Button
          className="search-form__button"
          isLoading={isLoading}
          loadingLabel="Buscando"
          type="submit"
        >
          Buscar
        </Button>
      </div>
      {validationError && (
        <p
          className="search-form__error"
          id="pokemon-search-error"
          role="alert"
        >
          {validationError}
        </p>
      )}
      {showClearButton && (
        <Button
          className="search-form__clear"
          variant="ghost"
          onClick={handleClear}
        >
          Volver al catálogo
        </Button>
      )}
    </form>
  );
}

export default SearchForm;

