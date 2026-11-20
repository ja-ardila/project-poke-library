import { Link } from 'react-router-dom';

import logo from '../../images/pokeball.svg';
import Navigation from '../Navigation/Navigation';

function Header(): React.JSX.Element {
  return (
    <header className="header">
      <div className="header__content page__section">
        <Link className="header__brand" to="/" aria-label="Ir al inicio">
          <img className="header__logo" src={logo} alt="" />
          <span className="header__name">Poké Library</span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;

