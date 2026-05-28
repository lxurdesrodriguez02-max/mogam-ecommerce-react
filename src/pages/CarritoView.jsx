import React from 'react';

const CarritoView = ({ cart, onClear, onRemove, onCheckout }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const formatoPrecio = (val) => {
    return '$' + Number(val).toLocaleString('es-AR');
  };

  return (
    <section id="carrito" style={{ padding: '3rem 1rem' }}>
      <div className="container" style={{ padding: '2rem', backgroundColor: 'papayawhip', borderRadius: '12px', maxWidth: '700px', margin: '0 auto' }}>
        <h2>Carrito de Compras</h2>
        
        <ul style={{ padding: 0, marginTop: '1.5rem' }}>
          {cart.length === 0 ? (
            <li className="list-group-item" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', listStyle: 'none', border: '1px solid #e5dec9' }}>
              Tu carrito está vacío actualmente.
            </li>
          ) : (
            cart.map((item, index) => (
              <li key={index} style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5dec9' }}>
                <div>
                  <strong>{item.name}</strong> — {formatoPrecio(item.price)} x{item.qty}
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => onRemove(index)} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Quitar
                </button>
              </li>
            ))
          )}
        </ul>

        <p style={{ fontSize: '1.3rem', marginTop: '1.5rem' }}>
          Total Estimado: <strong>{formatoPrecio(total)}</strong>
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn btn-dark" disabled={cart.length === 0} onClick={onClear} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}>
            Vaciar Carrito
          </button>
          <button className="btn btn-primary" disabled={cart.length === 0} onClick={onCheckout} style={{ padding: '0.6rem 1.2rem', backgroundColor: cart.length === 0 ? '#6c757d' : '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}>
            Finalizar Compra por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default CarritoView;