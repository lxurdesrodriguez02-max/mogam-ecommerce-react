import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ItemDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch('/data/productos.json')
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find((p) => p.id === Number(id));
        setProducto(encontrado);
      })
      .catch((err) => console.error("Error en detalle:", err));
  }, [id]);

  if (!producto) {
    return <p style={{ padding: '3rem', textAlign: 'center' }}>Cargando detalles del calzado...</p>;
  }

  return (
    <section style={{ padding: '3rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/productos" style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#0077b5', fontWeight: 'bold' }}>
        ← Volver al catálogo
      </Link>
      <div className="detalle-contenedor" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <img src={producto.img} alt={producto.name} style={{ width: '100%', maxWidth: '350px', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>{producto.name}</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444', marginBottom: '1.5rem' }}>{producto.description}</p>
          </div>
          <div>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#222', marginBottom: '1.5rem' }}>
              {'$' + producto.price.toLocaleString('es-AR')}
            </p>
            <button className="add-to-cart" onClick={() => onAddToCart(producto)} style={{ width: '100%', padding: '1rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', cursor: 'pointer' }}>
              Agregar al Carrito de Compras
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItemDetail;