import { NavLink } from 'react-router-dom';

function Navigation(): React.JSX.Element {
  return (
    <nav className="navigation" aria-label="Navegación principal">
      <NavLink
        className={({ isActive }) =>
          'navigation__link' +
          (isActive ? ' navigation__link_active' : '')
        }
        end
        to="/"
      >
        Pokédex
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          'navigation__link' +
          (isActive ? ' navigation__link_active' : '')
        }
        to="/about"
      >
        Sobre el autor
      </NavLink>
    </nav>
  );
}

export default Navigation;

