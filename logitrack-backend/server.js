const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuraciones intermedias
app.use(cors()); // Permite que React (puerto 3000) se conecte aquí
app.use(express.json()); // Permite recibir datos en formato JSON

// 1. CONEXIÓN A MYSQL WORKBENCH
const db = mysql.createConnection({
    host: 'localhost', // Volvemos a localhost
    user: 'root',
    password: 'Daniel142417$', 
    database: 'db_distribucionmercancia_react'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

// DASHBOARD: Obtener métricas rápidas del inventario
app.get('/api/dashboard', (req, res) => {
    // Usamos SQL para contar totales y evaluar condiciones (stock bajo y activos)
    const query = `
        SELECT 
            COUNT(*) as totalProductos, 
            SUM(CASE WHEN stock <= stock_minimo THEN 1 ELSE 0 END) as productosStockBajo,
            SUM(CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END) as productosActivos
        FROM tb_productos
    `;
    
    db.query(query, (err, resultados) => {
        if (err) {
            console.error("Error cargando métricas:", err);
            return res.status(500).json(err);
        }
        
        // Formateamos los datos. Si la tabla está vacía, evitamos que envíe "null"
        const metricas = {
            totalProductos: resultados[0].totalProductos || 0,
            productosStockBajo: resultados[0].productosStockBajo || 0,
            productosActivos: resultados[0].productosActivos || 0
        };
        
        res.json(metricas);
    });
});

// 2. RUTAS DE LA API

// LEER (GET): Traer todos los productos
app.get('/api/productos', (req, res) => {
    const query = 'SELECT * FROM tb_productos ORDER BY id_producto DESC'; 
    db.query(query, (err, resultados) => {
        if (err) {
            console.error("Error en SELECT:", err);
            return res.status(500).json(err);
        }
        res.json(resultados);
    });
});

// CREAR (POST): Guardar un producto nuevo
app.post('/api/productos', (req, res) => {
    // Capturamos los datos que manda React
    const { codigo_producto, nombre_producto, categoria, precio, stock } = req.body;
    
    // Insertamos en los campos obligatorios de tu nueva tabla
    const query = 'INSERT INTO tb_productos (codigo_producto, nombre_producto, categoria, precio, stock) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [codigo_producto, nombre_producto, categoria, precio, stock || 0], (err, resultado) => {
        if (err) {
            console.error("Error en INSERT:", err);
            return res.status(500).json(err);
        }
        res.json({ mensaje: 'Producto creado', id: resultado.insertId });
    });
});

// ACTUALIZAR (PUT): Modificar un producto existente
app.put('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    const { codigo_producto, nombre_producto, categoria, precio, stock } = req.body;
    
    // La consulta SQL UPDATE para modificar los campos
    const query = 'UPDATE tb_productos SET codigo_producto = ?, nombre_producto = ?, categoria = ?, precio = ?, stock = ? WHERE id_producto = ?';
    
    db.query(query, [codigo_producto, nombre_producto, categoria, precio, stock, id], (err, resultado) => {
        if (err) {
            console.error("Error en UPDATE:", err);
            return res.status(500).json(err);
        }
        res.json({ mensaje: 'Producto actualizado exitosamente' });
    });
});

// ELIMINAR (DELETE): Borrar un producto
app.delete('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM tb_productos WHERE id_producto = ?'; 
    
    db.query(query, [id], (err, resultado) => {
        if (err) {
            console.error("Error en DELETE:", err);
            return res.status(500).json(err);
        }
        res.json({ mensaje: 'Producto eliminado' });
    });
});

// 3. ARRANCAR EL SERVIDOR EN EL PUERTO 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});

// RUTA DE AUTENTICACIÓN (LOGIN)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

// REGISTRO DE NUEVOS USUARIOS (POST)
app.post('/api/registro', (req, res) => {
    const { nombres, apellidos, cedula, fecha_nacimiento, correo_electronico, password_hash } = req.body;
    
    // El rol por defecto será 'CLIENTE', como lo definiste en tu base de datos
    const query = 'INSERT INTO tb_usuarios (nombres, apellidos, cedula, fecha_nacimiento, correo_electronico, password_hash, rol) VALUES (?, ?, ?, ?, ?, ?, "CLIENTE")';
    
    db.query(query, [nombres, apellidos, cedula, fecha_nacimiento, correo_electronico, password_hash], (err, resultado) => {
        if (err) {
            console.error("🚨 Error al registrar usuario:", err);
            // El error suele ocurrir si el correo o la cédula ya existen (UNIQUE)
            return res.status(500).json({ success: false, mensaje: "Error al registrar. Es posible que el correo o cédula ya estén en uso." });
        }
        res.json({ success: true, mensaje: "Usuario registrado exitosamente" });
    });
});

    
    // Consultamos en tu tabla tb_usuarios
    const query = 'SELECT * FROM tb_usuarios WHERE correo_electronico = ? AND password_hash = ? AND estado = "ACTIVO"';
    
    db.query(query, [email, password], (err, resultados) => {
        if (err) {
            console.error("Error en el login:", err);
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }
        
        if (resultados.length > 0) {
            // Si hay coincidencia, devolvemos los datos básicos del usuario
            const usuario = resultados[0];
            res.json({ 
                success: true, 
                usuario: {
                    nombres: usuario.nombres,
                    rol: usuario.rol
                } 
            });
        } else {
            // Si no hay coincidencia, devolvemos un error de credenciales
            res.status(401).json({ 
                success: false, 
                mensaje: "Cuenta no encontrada o datos incorrectos. ¡Te invitamos a registrarte!" 
            });
        }
    });
});