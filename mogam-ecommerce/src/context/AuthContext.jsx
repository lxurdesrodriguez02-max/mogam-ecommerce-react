import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registrar un nuevo usuario en Firebase
  const registrarUsuario = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Iniciar sesión con email y contraseña
  const loginUsuario = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Cerrar sesión
  const logoutUsuario = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (userCurrentUser) => {
      setUsuario(userCurrentUser);
      setLoading(false);
    });
    return () => desuscribir();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, registrarUsuario, loginUsuario, logoutUsuario, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};