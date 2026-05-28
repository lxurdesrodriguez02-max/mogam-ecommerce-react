import React from 'react';

const Formulario = () => {
  return (
    <section id="contacto">
      <h2 className="titulo-contacto">
        <i className="fas fa-envelope"></i> Contacto
      </h2>

      <form action="https://formspree.io/f/mwpwvgyw" method="POST">
        <label>
          Nombre:
          <input type="text" name="Nombre" required />
        </label>
        <label>
          Correo electrónico:
          <input type="email" name="email" required />
        </label>
        <label>
          Asunto:
          <input type="text" name="Asunto" required />
        </label>
        <label>
          Mensaje:
          <textarea name="message" required></textarea>
        </label>
        <button type="submit">Enviar Mensaje</button>
      </form>
    </section>
  );
};

export default Formulario;