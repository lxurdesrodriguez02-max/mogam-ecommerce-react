import React, { useState, useEffect } from 'react';
import Item from '../components/Item';
import Formulario from '../components/Formulario';

const ItemListContainer = ({ onAddToCart }) => {
  const [productos, setProductos] = useState([]);

  // Consumo asincrónico mediante Fetch del archivo JSON local (Simulación API)
  useEffect(() => {
    fetch('/data/productos.json')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando la API local de productos:", err));
  }, []);

  return (
    <>
      <section id="productos">
        <h2 className="titulo-seccion">Catálogo de Productos</h2>
        <div className="productos--contenedor">
          {productos.map((prod) => (
            <Item
              key={prod.id}
              id={prod.id}
              name={prod.name}
              price={prod.price}
              img={prod.img}
              description={prod.description}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Formulario obligatorio de clase 6 situado debajo de los productos */}
      <Formulario />
    </>
  );
};

export default ItemListContainer;