import React, { useState } from 'react';

const Registro = ({ onVolverAlLogin }) => {
  const [formulario, setFormulario] = useState({
    nombres: '', apellidos: '', cedula: '', fecha_nacimiento: '', correo_electronico: '', password_hash: ''
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: 'Procesando...', tipo: 'info' });

    try {
      const respuesta = await fetch('http://localhost:3001/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });
      const data = await respuesta.json();

      if (data.success) {
        setMensaje({ texto: '✅ ' + data.mensaje + '. Ya puedes iniciar sesión.', tipo: 'exito' });
        // Limpiamos el formulario
        setFormulario({ nombres: '', apellidos: '', cedula: '', fecha_nacimiento: '', correo_electronico: '', password_hash: '' });
      } else {
        setMensaje({ texto: '❌ ' + data.mensaje, tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: '❌ Error de conexión con el servidor.', tipo: 'error' });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '400px' }}>
        
        <h2 style={{ textAlign: 'center', color: '#333' }}>Crear Cuenta LogiTrack</h2>
        
        {/* PANEL DE MENSAJES DE ERROR O ÉXITO */}
        {mensaje.texto && (
          <div style={{ 
            padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold',
            backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : mensaje.tipo === 'error' ? '#f8d7da' : '#e2e3e5',
            color: mensaje.tipo === 'exito' ? '#155724' : mensaje.tipo === 'error' ? '#721c24' : '#383d41'
          }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="nombres" placeholder="Nombres" value={formulario.nombres} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" name="apellidos" placeholder="Apellidos" value={formulario.apellidos} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" name="cedula" placeholder="Cédula" value={formulario.cedula} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          
          <label style={{ fontSize: '12px', color: '#666', marginBottom: '-10px' }}>Fecha de Nacimiento:</label>
          <input type="date" name="fecha_nacimiento" value={formulario.fecha_nacimiento} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          
          <input type="email" name="correo_electronico" placeholder="Correo Electrónico" value={formulario.correo_electronico} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="password" name="password_hash" placeholder="Contraseña" value={formulario.password_hash} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          
          <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Registrarse
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={onVolverAlLogin} style={{ background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', textDecoration: 'underline' }}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>

      </div>
    </div>
  );
};

export default Registro;