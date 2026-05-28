import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import ItemListContainer from './pages/ItemListContainer';
import ItemDetail from './pages/ItemDetail';
import CarritoView from './pages/CarritoView';
import './styles/styles.css';

function App() {
  const CART_KEY = 'mogamCart';

  // Cargar estado inicial del carrito desde LocalStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en LocalStorage de manera automática ante cambios en el carrito
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = ({ id, name, price, img }) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === id || item.name === name);
      if (existing) {
        return prevCart.map((item) =>
          (item.id === id || item.name === name) ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { id, name, price, img, qty: 1 }];
    });
  };

  const handleClearCart = () => setCart([]);

  const handleRemoveItem = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const formatoPrecio = (val) => '$' + Number(val).toLocaleString('es-AR');

    const lines = [
      'Hola, quiero seguir esta compra con un vendedor de Tienda MOGAM:',
      ...cart.map(item => `• ${item.name} x${item.qty} = ${formatoPrecio(item.price * item.qty)}`),
      `Total estimado: ${formatoPrecio(total)}`
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/5491124641254?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<ItemListContainer onAddToCart={handleAddToCart} />} />
          <Route path="/producto/:id" element={<ItemDetail onAddToCart={handleAddToCart} />} />
          <Route path="/carrito" element={<CarritoView cart={cart} onClear={handleClearCart} onRemove={handleRemoveItem} onCheckout={handleCheckout} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;