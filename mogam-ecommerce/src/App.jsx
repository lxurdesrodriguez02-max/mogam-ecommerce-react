import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import ItemListContainer from './pages/ItemListContainer';
import ItemDetail from './pages/ItemDetail';
import CarritoView from './pages/CarritoView';

import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext'; // Importación clave
import RutaProtegida from './components/RutaProtegida';
import Login from './components/Login';
import AdminProductos from './components/AdminProductos';

import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* El CarritoProvider envuelve a Layout y las Routes para darles acceso global */}
        <CarritoProvider>
          <Layout>
            <Routes>
              {/* Rutas Públicas - Ya no pasan ninguna prop del carrito */}
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<ItemListContainer />} />
              <Route path="/producto/:id" element={<ItemDetail />} />
              <Route path="/carrito" element={<CarritoView />} />

              {/* Rutas Privadas / Auth */}
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <RutaProtegida>
                    <AdminProductos />
                  </RutaProtegida>
                } 
              />
            </Routes>
          </Layout>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 