/**
 * server.js
 * =========================================================================
 * Punto de entrada de la aplicacion.
 * - Carga variables de entorno desde el archivo .env
 * - Levanta el servidor HTTP en el puerto configurado
 * - Implementa cierre ordenado (graceful shutdown) ante senales del SO
 *   para liberar recursos correctamente (importante en produccion).
 * =========================================================================
 */
require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('=========================================');
  console.log(`  🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`  📋 URL: http://localhost:${PORT}`);
  console.log(`  🌎 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('=========================================');
});

/**
 * Cierre ordenado del servidor.
 * Cierra el pool de la base de datos antes de detener el proceso.
 */
const shutdown = async (signal) => {
  console.log(`\n📴 Senal ${signal} recibida. Cerrando servidor...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log('✅ Conexiones de base de datos cerradas.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error cerrando el pool:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Captura de errores no manejados (ultimo recurso)
process.on('unhandledRejection', (reason) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Excepcion no capturada:', err);
  process.exit(1);
});
