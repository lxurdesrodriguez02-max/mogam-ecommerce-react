import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext'; // Importamos tu contexto global

const Header = () => {
  const { obtenerCantidadTotal } = useCarrito(); // Traemos la función del total de prendas

  return (
    <header>
      <div className="marca">
        <img src="/logo.jpg" alt="Logo M" className="logo" />
        <span className="marca-texto">OGAM</span>
      </div>

      <nav>
        <ul>
          <li><Link to="/">⌂ Inicio</Link></li>
          <li><Link to="/productos">📦︎ Productos</Link></li>
          <li>
            <Link to="/carrito">
              🛒 Carrito 
              {obtenerCantidadTotal() > 0 && (
                <span className="burbuja-carrito" style={{ marginLeft: '5px', backgroundColor: '#dc3545', color: '#fff', padding: '2px 6px', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {obtenerCantidadTotal()}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 