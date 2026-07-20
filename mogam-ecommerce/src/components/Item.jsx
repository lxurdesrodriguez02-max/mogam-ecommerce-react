import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Item = ({ id, name, price, img, description, onAddToCart }) => {
  // Estado local para alternar la descripción larga
  const [expandido, setExpandido] = useState(false);

  const formatoPrecio = (val) => {
    return '$' + Number(val).toLocaleString('es-AR');
  };

  return (
    <article className="producto">
      <div className="producto--imagen">
        <img src={img} alt={name} />
      </div>
      <div className="producto--contenido">
        <h3>{name}</h3>
        
        <p className={`producto--detalle--texto ${expandido ? 'expandido' : ''}`}>
          {description}
        </p>

        <button 
          className="toggle-descripcion" 
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? 'Ocultar descripción' : 'Mostrar descripción'}
        </button>

        <p className="producto--detalle--precio">{formatoPrecio(price)}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to={`/producto/${id}`} className="btn-detalle" style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#0077b5', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>
            Ver Detalle del Producto
          </Link>
          
          <button className="add-to-cart" onClick={() => onAddToCart({ id, name, price, img })}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
};

export default Item;