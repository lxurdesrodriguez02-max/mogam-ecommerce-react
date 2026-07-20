import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useCarrito } from '../context/CarritoContext';

const CarritoView = () => {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, obtenerPrecioTotal } = useCarrito();

  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuento, setDescuento] = useState(0); 
  const [cuponAplicado, setCuponAplicado] = useState('');
  const [mensajeCupon, setMensajeCupon] = useState({ texto: '', tipo: '' }); 
  const [cargando, setCargando] = useState(false);

  const subtotal = obtenerPrecioTotal();
  const montoDescuento = subtotal * (descuento / 100);
  const total = subtotal - montoDescuento;

  const formatoPrecio = (val) => {
    return '$' + Number(val).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const aplicarCupon = async (e) => {
    e.preventDefault();
    if (!codigoCupon.trim()) return;

    setCargando(true);
    setMensajeCupon({ texto: '', tipo: '' });

    try {
      const cuponRef = doc(db, 'cupones', codigoCupon.trim().toUpperCase());
      const cuponSnap = await getDoc(cuponRef);

      if (cuponSnap.exists()) {
        const datosCupon = cuponSnap.data();
        if (datosCupon.activo === false) {
          setMensajeCupon({ texto: 'Este cupón ya no está activo.', tipo: 'error' });
          setDescuento(0);
          setCuponAplicado('');
        } else {
          setDescuento(datosCupon.porcentaje);
          setCuponAplicado(codigoCupon.trim().toUpperCase());
          setMensajeCupon({ 
            texto: `¡Cupón '${codigoCupon.toUpperCase()}' aplicado! Descuento del ${datosCupon.porcentaje}%`, 
            tipo: 'exito' 
          });
        }
      } else {
        setMensajeCupon({ texto: 'El código ingresado no existe.', tipo: 'error' });
        setDescuento(0);
        setCuponAplicado('');
      }
    } catch (error) {
      setMensajeCupon({ texto: 'Error al validar el cupón.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const removerCupon = () => {
    setDescuento(0);
    setCuponAplicado('');
    setCodigoCupon('');
    setMensajeCupon({ texto: 'Cupón removido.', tipo: 'exito' });
  };

  const handleCheckoutClick = () => {
    if (carrito.length === 0) return;
    const lines = [
      'Hola, quiero seguir esta compra con un vendedor de Tienda MOGAM:',
      ...carrito.map(item => `• ${item.name} x${item.cantidad} = ${formatoPrecio(item.price * item.cantidad)}`),
      descuento > 0 ? `Descuento aplicado: -${descuento}% (${cuponAplicado})` : '',
      `Total estimado: ${formatoPrecio(total)}`
    ].filter(line => line !== '');
    
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/5491124641254?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <section id="carrito" style={{ padding: '3rem 1rem' }}>
      <div className="container" style={{ padding: '2rem', backgroundColor: 'papayawhip', borderRadius: '12px', maxWidth: '700px', margin: '0 auto' }}>
        <h2>Carrito de Compras</h2>
        
        <ul style={{ padding: 0, marginTop: '1.5rem' }}>
          {carrito.length === 0 ? (
            <li className="list-group-item" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', listStyle: 'none', border: '1px solid #e5dec9' }}>
              Tu carrito está vacío actualmente.
            </li>
          ) : (
            carrito.map((item) => (
              <li key={item.id} style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5dec9' }}>
                <div>
                  <strong>{item.name}</strong> — {formatoPrecio(item.price)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dc3545', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff' }}>
                  <button 
                    onClick={() => eliminarDelCarrito(item.id)} 
                    style={{ border: 'none', background: 'none', color: '#dc3545', padding: '0.4rem 0.8rem', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    —
                  </button>
                  <span style={{ padding: '0 0.5rem', minWidth: '20px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
                    {item.cantidad}
                  </span>
                  <button 
                    onClick={() => agregarAlCarrito(item, 1)} 
                    style={{ border: 'none', background: 'none', color: '#dc3545', padding: '0.4rem 0.8rem', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {carrito.length > 0 && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5dec9' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem' }}>¿Tenés un cupón de descuento?</h4>
            
            {!cuponAplicado ? (
              <form onSubmit={aplicarCupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Ej: MOGAM15" 
                  value={codigoCupon}
                  onChange={(e) => setCodigoCupon(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }}
                  disabled={cargando}
                />
                <button 
                  type="submit" 
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  disabled={cargando}
                >
                  {cargando ? 'Validando...' : 'Aplicar'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#198754' }}>Cupón Activo: {cuponAplicado} (-{descuento}%)</span>
                <button 
                  onClick={removerCupon}
                  style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Quitar cupón
                </button>
              </div>
            )}

            {mensajeCupon.texto && (
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                fontSize: '0.9rem', 
                color: mensajeCupon.tipo === 'exito' ? '#198754' : '#dc3545',
                fontWeight: '500'
              }}>
                {mensajeCupon.texto}
              </p>
            )}
          </div>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          {descuento > 0 && (
            <>
              <p style={{ fontSize: '1.1rem', margin: '0.3rem 0' }}>
                Subtotal: <span style={{ textDecoration: 'line-through', color: '#6c757d' }}>{formatoPrecio(subtotal)}</span>
              </p>
              <p style={{ fontSize: '1.1rem', margin: '0.3rem 0', color: '#198754' }}>
                Descuento ({descuento}%): <strong>-{formatoPrecio(montoDescuento)}</strong>
              </p>
            </>
          )}
          <p style={{ fontSize: '1.3rem', marginTop: '0.5rem' }}>
            Total Estimado: <strong>{formatoPrecio(total)}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn btn-dark" disabled={carrito.length === 0} onClick={vaciarCarrito} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer' }}>
            Vaciar Carrito
          </button>
          <button className="btn btn-primary" disabled={carrito.length === 0} onClick={handleCheckoutClick} style={{ padding: '0.6rem 1.2rem', backgroundColor: carrito.length === 0 ? '#6c757d' : '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer' }}>
            Finalizar Compra por WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default CarritoView;