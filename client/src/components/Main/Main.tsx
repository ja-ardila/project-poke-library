import SearchForm from '../SearchForm/SearchForm';

function Main(): React.JSX.Element {
  function handleSearch(query: string): void {
    // La consulta se conectará con PokéAPI en la siguiente fase.
    console.info('Búsqueda preparada: ' + query);
  }

  return (
    <main className="main page__section">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="hero__eyebrow">Enciclopedia Pokémon</p>
          <h1 className="hero__title" id="hero-title">
            Encuentra información de tus Pokémon favoritos
          </h1>
          <p className="hero__description">
            Explora los Pokémon de Kanto por nombre o número y consulta sus
            datos esenciales en un solo lugar.
          </p>
          <SearchForm onSearch={handleSearch} />
        </div>
        <div className="hero__visual" aria-hidden="true" />
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="catalog__heading">
          <div>
            <p className="catalog__eyebrow">Primera generación</p>
            <h2 className="catalog__title" id="catalog-title">
              Pokédex de Kanto
            </h2>
          </div>
          <span className="catalog__status">Preparando el catálogo</span>
        </div>
        <div className="catalog__placeholder">
          <p className="catalog__placeholder-title">
            La estructura del frontend está lista.
          </p>
          <p className="catalog__placeholder-text">
            En la siguiente fase conectaremos estas vistas con PokéAPI y
            construiremos las tarjetas reutilizables.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Main;

