import { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
}

function SearchForm({ onSearch }: SearchFormProps): React.JSX.Element {
  const [query, setQuery] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      onSearch(normalizedQuery);
    }
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label className="search-form__label" htmlFor="pokemon-search">
        Busca por nombre o número
      </label>
      <div className="search-form__controls">
        <input
          className="search-form__input"
          id="pokemon-search"
          name="pokemon"
          placeholder="Ej. Pikachu o 25"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="button search-form__button" type="submit">
          Buscar
        </button>
      </div>
    </form>
  );
}

export default SearchForm;

