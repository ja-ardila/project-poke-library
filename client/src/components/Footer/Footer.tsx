function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content page__section">
        <p className="footer__copyright">
          © {currentYear} Poké Library
        </p>
        <p className="footer__source">
          Información proporcionada por{' '}
          <a
            className="footer__link"
            href="https://pokeapi.co/"
            target="_blank"
            rel="noreferrer"
          >
            PokéAPI
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

