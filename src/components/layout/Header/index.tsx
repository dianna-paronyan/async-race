import { NavLink } from 'react-router';
import { menuItems } from './menuItems.ts';
import './style.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store.tsx';

function Header() {
  const { racing } = useSelector((state: RootState) => state.cars);

  return (
    <nav className="menu">
      {menuItems.map((item) => (
        <NavLink
          key={item.key}
          to={item.to}
          className={({ isActive }) => (isActive ? 'menu-item menu-item-active' : 'menu-item')}
          style={racing ? { pointerEvents: 'none', opacity: 0.5 } : {}}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Header;
