const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración del Pool de conexiones a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'novashop_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba rápida de verificación de conexión
pool.getConnection()
  .then(connection => {
    console.log('[NovaShop BD] Conexión exitosa a la base de datos MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('[NovaShop BD] Error al conectar con MySQL:', err.message);
  });

module.exports = pool;