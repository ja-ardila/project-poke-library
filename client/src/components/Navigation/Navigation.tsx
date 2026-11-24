import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import CurrentUserContext from '../../contexts/CurrentUserContext';

interface NavigationProps {
  isCheckingAuth: boolean;
  onLogout: () => void;
}

function getLinkClassName(isActive: boolean): string {
  return (
    'navigation__link' + (isActive ? ' navigation__link_active' : '')
  );
}

function Navigation({
  isCheckingAuth,
  onLogout,
}: NavigationProps): React.JSX.Element {
  const currentUser = useContext(CurrentUserContext);

  return (
    <nav className="navigation" aria-label="Navegación principal">
      <NavLink
        className={({ isActive }) => getLinkClassName(isActive)}
        end
        to="/"
      >
        Pokédex
      </NavLink>
      <NavLink
        className={({ isActive }) => getLinkClassName(isActive)}
        to="/about"
      >
        Sobre el autor
      </NavLink>

      {!isCheckingAuth && currentUser && (
        <>
          <NavLink
            className={({ isActive }) => getLinkClassName(isActive)}
            to="/mypokemon"
          >
            Mi biblioteca
          </NavLink>
          <span className="navigation__user" title={currentUser.email}>
            {currentUser.name}
          </span>
          <button
            className="navigation__logout"
            type="button"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </>
      )}

      {!isCheckingAuth && !currentUser && (
        <NavLink
          className={({ isActive }) => getLinkClassName(isActive)}
          to="/signin"
        >
          Iniciar sesión
        </NavLink>
      )}
    </nav>
  );
}

export default Navigation;
