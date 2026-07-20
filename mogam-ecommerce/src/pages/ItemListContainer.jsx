import React, { useState, useEffect } from 'react';
import Item from '../components/Item';
import Formulario from '../components/Formulario';
import { useCarrito } from '../context/CarritoContext'; 
import { db } from '../firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';

const ItemListContainer = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { agregarAlCarrito } = useCarrito(); 

  useEffect(() => {
    const obtenerProductosCliente = async () => {
      setLoading(true);
      try {
        const productosCollectionRef = collection(db, 'productos');
        const data = await getDocs(productosCollectionRef);
        setProductos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (err) {
        console.error("Error cargando los productos desde Firestore:", err);
      } finally {
        setLoading(false); 
      }
    }; 

    obtenerProductosCliente();
  }, []);

  return (
    <>
      <section id="productos">
        <h2 className="titulo-seccion">Catálogo de Productos</h2>
        
        {loading ? (
          <div className="spinner-contenedor" style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p style={{ color: '#666', marginTop: '1rem' }}>Conectando con Firestore...</p>
          </div>
        ) : (
          <div className="productos--contenedor">
            {productos.map((prod) => (
              <Item
                key={prod.id}
                id={prod.id}
                name={prod.name}
                price={prod.price}
                img={prod.img}
                description={prod.description}
                onAddToCart={() => agregarAlCarrito(prod, 1)} 
              />
            ))}
          </div>
        )}
      </section>

      <Formulario />
    </>
  );
};

export default ItemListContainer;