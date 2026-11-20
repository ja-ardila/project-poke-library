import { Link } from 'react-router-dom';

function NotFound(): React.JSX.Element {
  return (
    <main className="not-found page__section">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Esta ruta no existe</h1>
      <p className="not-found__text">
        Parece que este Pokémon escapó antes de que llegaras.
      </p>
      <Link className="button not-found__link" to="/">
        Volver a la Pokédex
      </Link>
    </main>
  );
}

export default NotFound;

