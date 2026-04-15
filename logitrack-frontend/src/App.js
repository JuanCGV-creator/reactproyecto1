import React, { useState } from 'react';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Panel from './pages/Panel';

function App() {
  // 1. INICIALIZAR EL ESTADO LEYENDO EL DISCO DURO (localStorage)
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('logitrack_usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });
  
  const [pantallaPublica, setPantallaPublica] = useState('login'); 

  // 2. MODIFICAMOS INICIAR SESIÓN PARA QUE GUARDE LOS DATOS
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('logitrack_usuario', JSON.stringify(datosUsuario)); // Guardamos la "llave"
  };

  // 3. MODIFICAMOS CERRAR SESIÓN PARA QUE BORRE LOS DATOS
  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('logitrack_usuario'); // Destruimos la "llave"
  };

  const irARegistro = () => setPantallaPublica('registro');
  const irALogin = () => setPantallaPublica('login');

  return (
    <div className="App">
      {usuario ? (
        <Panel usuario={usuario} onLogout={cerrarSesion} />
      ) : (
        pantallaPublica === 'login' ? (
          <Login onLogin={iniciarSesion} onIrARegistro={irARegistro} />
        ) : (
          <Registro onVolverAlLogin={irALogin} />
        )
      )}
    </div>
  );
}

export default App;