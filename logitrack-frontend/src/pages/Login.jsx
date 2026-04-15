import React, { useState } from 'react';

const Login = ({ onLogin, onIrARegistro }) => {
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Ahora guarda el texto del error
  const [mostrarPassword, setMostrarPassword] = useState(false); // Estado para el ojito

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const respuesta = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });
      const data = await respuesta.json();

      if (data.success) {
        onLogin(data.usuario); 
      } else {
        setError(data.mensaje); // Mostramos el mensaje que viene del backend
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', width: '350px' }}>
        
        {/* LOGO DE LA EMPRESA */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2763/2763263.png" 
            alt="LogiTrack Logo" 
            style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
          />
          <h2 style={{ margin: '10px 0 0 0', color: '#2c3e50' }}>LogiTrack</h2>
          <p style={{ margin: '5px 0 20px 0', color: '#7f8c8d', fontSize: '14px' }}>Gestión Logística Integral</p>
        </div>
        
        {/* MENSAJE DE ERROR AMIGABLE */}
        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', border: '1px solid #f5c6cb' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* INPUT CORREO LIMPIO */}
          <input 
            type="email" 
            name="email" 
            placeholder="Correo electrónico" 
            value={credenciales.email} 
            onChange={handleChange} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }}
          />
          
          {/* CONTENEDOR DE CONTRASEÑA CON OJITO */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type={mostrarPassword ? "text" : "password"} 
              name="password" 
              placeholder="Contraseña" 
              value={credenciales.password} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', paddingRight: '40px' }}
            />
            {/* BOTÓN DEL OJITO */}
            <button 
              type="button" 
              onClick={() => setMostrarPassword(!mostrarPassword)}
              style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#666' }}
              title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {mostrarPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
            Ingresar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <button type="button" onClick={onIrARegistro} style={{ background: 'none', border: 'none', color: '#28a745', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            ¿No tienes cuenta? Regístrate aquí
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;