import { NavLink } from 'react-router';
import { menuItems } from './menuItems.ts';
import './style.css';

function Header() {
  return (
    <nav className="menu">
      {menuItems.map((item) => (
        <NavLink
          key={item.key}
          to={item.to}
          className={({ isActive }) => (isActive ? 'menu-item menu-item-active' : 'menu-item')}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Header;
