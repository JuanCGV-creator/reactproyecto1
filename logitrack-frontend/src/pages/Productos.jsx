import React, { useState, useEffect } from 'react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  
  const [formulario, setFormulario] = useState({ 
    id_producto: null, 
    codigo_producto: '', 
    nombre_producto: '', 
    categoria: '', 
    precio: '',
    stock: ''
  });
  
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/productos');
      const datos = await respuesta.json();
      if (Array.isArray(datos)) {
        setProductos(datos);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // FUNCIÓN PARA PREPARAR LA EDICIÓN (Llena el formulario con los datos de la fila)
  const editarProducto = (producto) => {
    setFormulario(producto);
    setModoEdicion(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        // ACTUALIZAR (PUT) si estamos en modo edición
        await fetch(`http://localhost:3001/api/productos/${formulario.id_producto}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulario)
        });
        setModoEdicion(false); // Salimos del modo edición
      } else {
        // CREAR (POST) si es un registro nuevo
        await fetch('http://localhost:3001/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulario)
        });
      }
      
      obtenerProductos(); // Recargamos la tabla
      // Limpiamos el formulario
      setFormulario({ id_producto: null, codigo_producto: '', nombre_producto: '', categoria: '', precio: '', stock: '' });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await fetch(`http://localhost:3001/api/productos/${id}`, {
          method: 'DELETE'
        });
        obtenerProductos();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>📦 Gestión de Inventario</h2>
      
      <form onSubmit={guardarProducto} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '8px', border: '1px solid #bce8f1' }}>
        <h4 style={{ marginTop: 0 }}>{modoEdicion ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h4>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <input type="text" name="codigo_producto" value={formulario.codigo_producto} onChange={handleChange} placeholder="Código" required />
          <input type="text" name="nombre_producto" value={formulario.nombre_producto} onChange={handleChange} placeholder="Nombre del producto" required style={{flexGrow: 1}}/>
          <input type="text" name="categoria" value={formulario.categoria} onChange={handleChange} placeholder="Categoría" />
          <input type="number" name="precio" value={formulario.precio} onChange={handleChange} placeholder="Precio" required />
          <input type="number" name="stock" value={formulario.stock} onChange={handleChange} placeholder="Stock Inicial" required />
        </div>
        
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: modoEdicion ? '#f0ad4e' : '#0275d8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {modoEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>

        {modoEdicion && (
          <button type="button" onClick={() => { setModoEdicion(false); setFormulario({ id_producto: null, codigo_producto: '', nombre_producto: '', categoria: '', precio: '', stock: '' }); }} style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        )}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#292b2c', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Código</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nombre</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Categoría</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Precio</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stock</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estado</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos?.map((prod) => (
            <tr key={prod.id_producto} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', borderLeft: '1px solid #ddd' }}>{prod.codigo_producto}</td>
              <td style={{ padding: '10px' }}>{prod.nombre_producto}</td>
              <td style={{ padding: '10px' }}>{prod.categoria}</td>
              <td style={{ padding: '10px' }}>${prod.precio}</td>
              <td style={{ padding: '10px' }}>{prod.stock}</td>
              <td style={{ padding: '10px' }}>
                 <span style={{ padding: '3px 8px', borderRadius: '10px', backgroundColor: prod.estado === 'ACTIVO' ? '#d4edda' : '#f8d7da', color: prod.estado === 'ACTIVO' ? '#155724' : '#721c24', fontSize: '12px'}}>
                    {prod.estado}
                 </span>
              </td>
              <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>
                {/* AQUÍ ESTÁ EL BOTÓN DE EDITAR DE VUELTA */}
                <button type="button" onClick={() => editarProducto(prod)} style={{ color: '#0275d8', marginRight: '10px', cursor: 'pointer', border: 'none', background: 'none', fontWeight: 'bold' }}>Editar</button>
                <button type="button" onClick={() => eliminarProducto(prod.id_producto)} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none', fontWeight: 'bold' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;