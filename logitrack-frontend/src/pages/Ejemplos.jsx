import React, { Component, useState } from 'react';

// --- EL EJEMPLO1 (Componente de Clase) ---
class SaludoDistribucion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: 'Administrador'
    };
  }

  render() {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
        <h3 style={{ color: '#2c3e50' }}>1. Versión: Componente de Clase</h3>
        <p>Este componente usa la sintaxis clásica de <code>class</code> y <code>this.state</code>.</p>
        <div style={{ padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
            <h1>Bienvenido al Sistema de Logística</h1>
            <p>Usuario activo: <strong>{this.state.usuario}</strong></p>
        </div>
      </div>
    );
  }
}

// --- LA VERSIÓN MODERNA (Componente Funcional) ---
const SaludoFuncional = () => {
  const [usuario] = useState('Administrador');

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3 style={{ color: '#2c3e50' }}>2. Versión: Componente Funcional</h3>
      <p>Este componente usa <code>Hooks</code> (useState), que es la forma moderna que usamos en LogiTrack.</p>
      <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '4px' }}>
          <h1>Bienvenido al Sistema de Logística</h1>
          <p>Usuario activo: <strong>{usuario}</strong></p>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL DE EJEMPLOS ---
const Ejemplos = () => {
  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ color: '#333' }}>📚 Repositorio de Ejemplos Técnicos</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Esta sección sirve para comparar las dos formas principales de crear componentes en React.
      </p>
      
      <SaludoDistribucion />
      <SaludoFuncional />
    </div>
  );
};

export default Ejemplos;