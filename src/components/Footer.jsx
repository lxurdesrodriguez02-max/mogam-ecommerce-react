import React from 'react';

const Footer = () => {
  const equipo = [
    { id: 1, nombre: "Lourdes Rodriguez", rol: "Fundadora & Directora Ejecutiva" },
    { id: 2, nombre: "Paul Gomez", rol: "Coordinador de Logística y Calidad" },
    { id: 3, nombre: "Lautaro Silva", rol: "Desarrollador de Software" }
  ];

  return (
    <footer id="footer">
      <div className="footer-empresa-info" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3>MOGAM CALZADO</h3>
        <p>Calzado de alta calidad en cuero vacuno hecho con procesos artesanales.</p>
        <p>📍 Flores, CABA, Argentina</p>
      </div>

      <div className="equipo-contenedor" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {equipo.map(persona => (
          <div key={persona.id} className="tarjeta-persona" style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '8px', minWidth: '220px', textAlign: 'center', border: '1px solid #dcd1be' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{persona.nombre}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#333' }}>{persona.rol}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1.5rem' }}>
        <p>Mogam Calzado - © 2026. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;