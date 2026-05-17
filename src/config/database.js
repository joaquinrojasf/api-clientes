/**
 * src/config/database.js
 * =========================================================================
 * Pool de conexiones a MySQL usando mysql2/promise.
 *
 * 🛡️ SEGURIDAD:
 *   - Las credenciales NUNCA estan en el codigo: se leen de .env
 *   - El .env esta excluido del repositorio (.gitignore)
 *   - Usamos un POOL en vez de conexiones sueltas: reusa conexiones,
 *     mejor rendimiento y tolera bien picos de trafico.
 * =========================================================================
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  database:        process.env.DB_NAME     || 'cib302_clientes',
  port:            process.env.DB_PORT     || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Buena practica: la zona horaria explicita evita sorpresas con created_at
  timezone: 'Z',
  // El charset debe coincidir con el de la BD para tildes y enie correctos
  charset: 'utf8mb4_unicode_ci'
});

// Prueba la conexion al iniciar el servidor para fallar rapido si algo esta mal
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexion a MySQL establecida correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err.message);
    console.error('   Revisa tus credenciales en el archivo .env');
  });

module.exports = pool;
