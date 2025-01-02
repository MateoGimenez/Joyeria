import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <nav className="contenedor-header">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/productos" >Productos</Link>
        </li>
        <li>
          <Link to="/ventas">Ventas</Link>
        </li>
      </ul>
    </nav>
  );
};
