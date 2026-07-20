import React, { createContext, useState, useContext } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  return useContext(CarritoContext);
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prevCarrito) => {
      const itemExiste = prevCarrito.find((item) => item.id === producto.id);
      if (itemExiste) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => {
      const itemExiste = prevCarrito.find((item) => item.id === id);
      
      if (itemExiste && itemExiste.cantidad > 1) {
        return prevCarrito.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      }
      
      return prevCarrito.filter((item) => item.id !== id);
    });
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const obtenerCantidadTotal = () => {
    return carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  };

  const obtenerPrecioTotal = () => {
    return carrito.reduce((acumulado, item) => acumulado + (item.price * item.cantidad), 0);
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        obtenerCantidadTotal,
        obtenerPrecioTotal
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}; 