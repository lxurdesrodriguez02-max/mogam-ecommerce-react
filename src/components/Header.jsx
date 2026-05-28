import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
          <li><Link to="/carrito">🛒 Carrito</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;