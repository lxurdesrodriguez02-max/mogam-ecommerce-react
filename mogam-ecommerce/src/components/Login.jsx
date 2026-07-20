import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [error, setError] = useState('');
  const { loginUsuario, registrarUsuario } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      if (esRegistro) {
        await registrarUsuario(email, password);
      } else {
        await loginUsuario(email, password);
      }
      navigate('/admin'); 
    } catch (err) {
      setError('Error de autenticación. Verifica el email y la contraseña.');
    }
  };

  return (
    <div className="login-container">
      <h2>{esRegistro ? 'Registrarse en MOGAM' : 'Iniciar Sesión'}</h2>
      {error && <p className="alerta-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            required 
            placeholder="ejemplo@correo.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            required 
            placeholder="Mínimo 6 caracteres"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn-primario">
          {esRegistro ? 'Registrarse' : 'Ingresar'}
        </button>
      </form>
      <button className="btn-secundario" onClick={() => setEsRegistro(!esRegistro)}>
        {esRegistro ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
      </button>
    </div>
  );
};

export default Login;