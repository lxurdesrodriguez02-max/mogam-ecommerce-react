import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc,
  setDoc
} from 'firebase/firestore';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [idEdicion, setIdEdicion] = useState(null);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [cupones, setCupones] = useState([]);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [porcentajeCupon, setPorcentajeCupon] = useState('');
  const [errorCupon, setErrorCupon] = useState('');

  const productosCollectionRef = collection(db, 'productos');
  const cuponesCollectionRef = collection(db, 'cupones');

  const obtenerProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDocs(productosCollectionRef);
      setProductos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      setError('Error al conectar con Firestore. Revisa las reglas de seguridad o tu configuración.');
    } finally {
      setLoading(false);
    }
  };

  const obtenerCupones = async () => {
    try {
      const data = await getDocs(cuponesCollectionRef);
      setCupones(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error cargando cupones:", err);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCupones();
  }, []);

  const guardarProducto = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre del producto no puede estar vacío.');
      return;
    }
    if (parseFloat(precio) <= 0 || isNaN(precio)) {
      setError('El precio debe ser un número válido mayor a 0.');
      return;
    }

    const datosProducto = {
      name: nombre,
      price: parseFloat(precio),
      img: imagen.trim() || 'https://via.placeholder.com/150',
      description: descripcion.trim()
    };

    try {
      if (idEdicion) {
        const productoDoc = doc(db, 'productos', idEdicion);
        await updateDoc(productoDoc, datosProducto);
        setIdEdicion(null);
      } else {
        await addDoc(productosCollectionRef, datosProducto);
      }
      
      setNombre('');
      setPrecio('');
      setImagen('');
      setDescripcion('');
      
      obtenerProductos();
    } catch (err) {
      setError('No se pudieron guardar los cambios en la base de datos.');
    }
  };

  const guardarCupon = async (e) => {
    e.preventDefault();
    setErrorCupon('');

    const codigoLimpio = codigoCupon.trim().toUpperCase();
    const porcentajeNum = parseInt(porcentajeCupon);

    if (!codigoLimpio) {
      setErrorCupon('El código del cupón no puede estar vacío.');
      return;
    }
    if (isNaN(porcentajeNum) || porcentajeNum <= 0 || porcentajeNum > 100) {
      setErrorCupon('El porcentaje debe ser un número entre 1 y 100.');
      return;
    }

    try {
      const cuponDocRef = doc(db, 'cupones', codigoLimpio);
      await setDoc(cuponDocRef, {
        porcentaje: porcentajeNum,
        activo: true
      });
      setCodigoCupon('');
      setPorcentajeCupon('');
      obtenerCupones();
    } catch (err) {
      setErrorCupon('Error al guardar el cupón en la base de datos.');
    }
  };

  const eliminarCupon = async (id) => {
    try {
      const cuponDoc = doc(db, 'cupones', id);
      await deleteDoc(cuponDoc);
      obtenerCupones();
    } catch (err) {
      setErrorCupon('No se pudo eliminar el cupón.');
    }
  };

  const toggleActivoCupon = async (cupon) => {
    try {
      const cuponDoc = doc(db, 'cupones', cupon.id);
      await updateDoc(cuponDoc, { activo: !cupon.activo });
      obtenerCupones();
    } catch (err) {
      console.error(err);
    }
  };

  const iniciarEdicion = (prod) => {
    setIdEdicion(prod.id);
    setNombre(prod.name);
    setPrecio(prod.price);
    setImagen(prod.img);
    setDescripcion(prod.description);
  };

  const solicitarEliminar = (prod) => {
    setProductoAEliminar(prod);
    setMostrarModal(true);
  };

  const ejecutarEliminacion = async () => {
    if (!productoAEliminar) return;
    try {
      const productoDoc = doc(db, 'productos', productoAEliminar.id);
      await deleteDoc(productoDoc);
      setMostrarModal(false);
      setProductoAEliminar(null);
      obtenerProductos();
    } catch (err) {
      setError('Ocurrió un error al intentar eliminar el producto.');
    }
  };

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Panel de Control - MOGAM E-Commerce</h2>
      
      {error && <div className="alerta-error" style={{ color: '#dc3545', padding: '1rem', background: '#f8d7da', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {/* Formulario de Carga / Edición de Productos */}
        <form onSubmit={guardarProducto} className="admin-form" style={{ flex: 2, minWidth: '300px', background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <h3>{idEdicion ? '✏️ Editar Producto' : '📦 Cargar Nuevo Producto'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="Nombre del Producto" required value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="number" step="0.01" placeholder="Precio ($)" required value={precio} onChange={(e) => setPrecio(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="URL de la Imagen (Opcional)" value={imagen} onChange={(e) => setImagen(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <textarea placeholder="Descripción del Producto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '8px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#212529', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {idEdicion ? 'Guardar Cambios' : 'Agregar Producto'}
            </button>
            {idEdicion && (
              <button type="button" onClick={() => { setIdEdicion(null); setNombre(''); setPrecio(''); setImagen(''); setDescripcion(''); }} style={{ padding: '0.6rem 1.2rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* GESTIÓN DE CUPONES */}
        <form onSubmit={guardarCupon} style={{ flex: 1, minWidth: '250px', background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <h3>🎟️ Cupones de Descuento</h3>
          {errorCupon && <div style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{errorCupon}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="Ej: MOGAM20" value={codigoCupon} onChange={(e) => setCodigoCupon(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }} />
            <input type="number" placeholder="Descuento (%)" value={porcentajeCupon} onChange={(e) => setPorcentajeCupon(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#198754', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Crear Cupón
          </button>

          <ul style={{ padding: 0, marginTop: '1rem', listStyle: 'none' }}>
            {cupones.map(cup => (
              <li key={cup.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: cup.activo ? '#198754' : '#6c757d' }}>{cup.id}</strong> (-{cup.porcentaje}%)
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button type="button" onClick={() => toggleActivoCupon(cup)} style={{ background: 'none', border: 'none', color: '#0d6efd', cursor: 'pointer', fontSize: '0.8rem' }}>
                    {cup.activo ? 'Pausar' : 'Activar'}
                  </button>
                  <button type="button" onClick={() => eliminarCupon(cup.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.8rem' }}>
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </form>
      </div>

      
      {loading ? (
        <div className="spinner-contenedor" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Conectando con Firestore...</p>
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <table className="tabla-admin" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Imagen</th>
                <th style={{ padding: '0.5rem' }}>Nombre</th>
                <th style={{ padding: '0.5rem' }}>Precio</th>
                <th style={{ padding: '0.5rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <img src={prod.img} alt={prod.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '0.5rem' }}>{prod.name}</td>
                  <td style={{ padding: '0.5rem' }}>
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(prod.price)}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <button onClick={() => iniciarEdicion(prod)} style={{ marginRight: '5px', padding: '0.3rem 0.6rem', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => solicitarEliminar(prod)} style={{ padding: '0.3rem 0.6rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-box" style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
            <h4>⚠️ ¿Estás segura de eliminar este producto?</h4>
            <p>Se borrará permanentemente el producto <strong>{productoAEliminar?.name}</strong> de la base de datos.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button onClick={ejecutarEliminacion} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sí, eliminar</button>
              <button onClick={() => setMostrarModal(false)} style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;