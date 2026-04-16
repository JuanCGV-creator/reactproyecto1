import React, { useState, useEffect } from 'react';
import Productos from './Productos';
import Ejemplos from './Ejemplos';

const Panel = ({ usuario, onLogout }) => {
  // Estado para controlar qué vista se muestra
  const [vistaActual, setVistaActual] = useState('inicio');
  
  // Estado para las métricas del Dashboard
  const [metricas, setMetricas] = useState({ totalProductos: 0, productosStockBajo: 0, productosActivos: 0 });

  useEffect(() => {
    if (vistaActual === 'inicio') {
      obtenerMetricas();
    }
  }, [vistaActual]);

  const obtenerMetricas = async () => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/dashboard');
      const datos = await respuesta.json();
      setMetricas(datos);
    } catch (error) {
      console.error("Error al cargar las métricas:", error);
    }
  };

  // Estilo dinámico para los botones del menú
  const estiloItemMenu = (vista) => ({
    padding: '15px 20px', 
    cursor: 'pointer', 
    borderBottom: '1px solid #34495e',
    backgroundColor: vistaActual === vista ? '#34495e' : 'transparent',
    color: vistaActual === vista ? '#34db98' : '#ecf0f1',
    fontWeight: vistaActual === vista ? 'bold' : 'normal',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: '0.3s'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial' }}>
      
      {/* --- BARRA LATERAL (SIDEBAR) --- */}
      <nav style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', backgroundColor: '#1a252f', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#34db98' }}>LogiTrack</h2>
          
          <div style={{ borderTop: '1px solid #34495e', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* AVATAR DINÁMICO CREADO CON EL NOMBRE DEL USUARIO */}
            <img 
              src={`https://ui-avatars.com/api/?name=${usuario.nombres}&background=34db98&color=fff&rounded=true&size=64`} 
              alt="Avatar del usuario" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
            />
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{usuario.nombres}</p>
            <span style={{ fontSize: '11px', backgroundColor: '#e67e22', padding: '3px 10px', borderRadius: '12px', marginTop: '8px', fontWeight: 'bold', letterSpacing: '1px' }}>
              {usuario.rol}
            </span>
          </div>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
          <li onClick={() => setVistaActual('inicio')} style={estiloItemMenu('inicio')}>
            <span>🏠</span> Panel de Inicio
          </li>
          
          {/* CAMBIO: Ahora se llama Productos en lugar de Inventario */}
          <li onClick={() => setVistaActual('productos')} style={estiloItemMenu('productos')}>
            <span>📦</span> Productos
          </li>

          {/* NUEVO: Módulo de Clientes */}
          <li onClick={() => setVistaActual('clientes')} style={estiloItemMenu('clientes')}>
            <span>👥</span> Clientes
          </li>

          {/* NUEVO: Módulo de Pedidos */}
          <li onClick={() => setVistaActual('pedidos')} style={estiloItemMenu('pedidos')}>
            <span>🚚</span> Pedidos
          </li>
          
          {/* Módulo de Usuarios (Solo visible para ADMIN) */}
          {usuario.rol === 'ADMIN' && (
            <li onClick={() => setVistaActual('usuarios')} style={estiloItemMenu('usuarios')}>
              <span>🛡️</span> Usuarios
            </li>
          )}
          
          {/* CAMBIO: Ahora se llama Reportes */}
          <li onClick={() => setVistaActual('reportes')} style={estiloItemMenu('reportes')}>
            <span>📊</span> Reportes
          </li>

          {/* SE MANTIENE: Configuración */}
          <li onClick={() => setVistaActual('configuracion')} style={estiloItemMenu('configuracion')}>
            <span>⚙️</span> Configuración
          </li>

           <li onClick={() => setVistaActual('ejemplos')} style={estiloItemMenu('ejemplos')}>
            <span>📚</span> Ejemplos Técnicos
          </li>


        </ul>

          <div style={{ padding: '20px' }}>
          <button onClick={onLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* --- ÁREA DE CONTENIDO PRINCIPAL --- */}
      <main style={{ flexGrow: 1, backgroundColor: '#f4f6f9', overflowY: 'auto' }}>
        
        {/* VISTA: INICIO */}
        {vistaActual === 'inicio' && (
          <div style={{ padding: '40px' }}>
            <h1 style={{ color: '#333' }}>Dashboard Logístico</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div style={estiloTarjeta('#007bff')}>
                <h4>Total Productos</h4>
                <p>{metricas.totalProductos}</p>
              </div>
              <div style={estiloTarjeta('#dc3545')}>
                <h4>Stock Crítico</h4>
                <p>{metricas.productosStockBajo}</p>
              </div>
              <div style={estiloTarjeta('#28a745')}>
                <h4>Productos Activos</h4>
                <p>{metricas.productosActivos}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* VISTA: PRODUCTOS (Tu tabla principal) */}
        {vistaActual === 'productos' && <Productos />}

        {/* CONTENEDORES PARA NUEVOS MÓDULOS */}
        {vistaActual === 'clientes' && <SeccionPlaceholder titulo="👥 Gestión de Clientes" />}
        {vistaActual === 'pedidos' && <SeccionPlaceholder titulo="🚚 Gestión de Pedidos" />}
        {vistaActual === 'usuarios' && <SeccionPlaceholder titulo="🛡️ Control de Usuarios" />}
        {vistaActual === 'reportes' && <SeccionPlaceholder titulo="📊 Reportes del Sistema" />}
        {vistaActual === 'configuracion' && <SeccionPlaceholder titulo="⚙️ Configuración" />}
        {vistaActual === 'ejemplos' && <Ejemplos />}

      </main>
    </div>
  );
};

// Estilos auxiliares para las tarjetas
const estiloTarjeta = (color) => ({
  flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '10px', 
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: `6px solid ${color}`
});

// Componente temporal para las secciones que aún no tienen CRUD
const SeccionPlaceholder = ({ titulo }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2 style={{ color: '#2c3e50' }}>{titulo}</h2>
    <div style={{ marginTop: '30px', padding: '50px', border: '2px dashed #ccc', borderRadius: '15px', backgroundColor: '#fff' }}>
      <p style={{ color: '#7f8c8d', fontSize: '18px' }}>Módulo en desarrollo para LogiTrack.</p>
      <small>Próximamente: Conexión con las tablas correspondientes en MySQL.</small>
    </div>
  </div>
);

export default Panel;