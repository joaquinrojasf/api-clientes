/**
 * src/models/cliente.model.js
 * =========================================================================
 * Capa de acceso a datos para la entidad 'cliente'.
 *
 * Esta capa es la UNICA que conoce la base de datos. Si manana cambiamos
 * MySQL por PostgreSQL, solo modificamos este archivo.
 *
 * 🛡️ SEGURIDAD CRITICA:
 *   TODAS las consultas usan prepared statements (parametros con '?').
 *   Esto previene la inyeccion SQL porque los valores nunca se concatenan
 *   directamente al string SQL: el driver mysql2 los escapa y los envia
 *   por separado al motor de base de datos.
 *
 *   ❌ INSEGURO: `SELECT * FROM cliente WHERE id = ${id}`
 *   ✅ SEGURO:   pool.query('SELECT * FROM cliente WHERE id = ?', [id])
 * =========================================================================
 */
const pool = require('../config/database');

// Campos que devolvemos al cliente (no exponer nada que no querramos)
const CAMPOS = 'id_cliente, nombre, email, telefono, created_at';

/**
 * Obtiene todos los clientes ordenados por fecha de creacion descendente.
 * @returns {Promise<Array>} lista de clientes
 */
async function obtenerTodos() {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS} FROM cliente ORDER BY id_cliente DESC`
  );
  return rows;
}

/**
 * Busca un cliente por su id.
 * @param {number} id
 * @returns {Promise<Object|null>} cliente o null si no existe
 */
async function obtenerPorId(id) {
  const [rows] = await pool.query(
    `SELECT ${CAMPOS} FROM cliente WHERE id_cliente = ?`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Busca un cliente por su email (usado para validar duplicados).
 * @param {string} email
 * @param {number} [excluirId] - opcional: id a excluir (util en updates)
 * @returns {Promise<Object|null>}
 */
async function obtenerPorEmail(email, excluirId = null) {
  let sql = `SELECT id_cliente, email FROM cliente WHERE email = ?`;
  const params = [email];
  if (excluirId !== null) {
    sql += ` AND id_cliente <> ?`;
    params.push(excluirId);
  }
  const [rows] = await pool.query(sql, params);
  return rows[0] || null;
}

/**
 * Crea un nuevo cliente.
 * @param {{nombre: string, email: string, telefono: string}} datos
 * @returns {Promise<Object>} cliente recien creado
 */
async function crear({ nombre, email, telefono }) {
  const [result] = await pool.query(
    `INSERT INTO cliente (nombre, email, telefono, created_at)
     VALUES (?, ?, ?, NOW())`,
    [nombre, email, telefono]
  );
  return obtenerPorId(result.insertId);
}

/**
 * Actualiza un cliente existente (reemplazo completo).
 * @param {number} id
 * @param {{nombre: string, email: string, telefono: string}} datos
 * @returns {Promise<Object>} cliente actualizado
 */
async function actualizar(id, { nombre, email, telefono }) {
  await pool.query(
    `UPDATE cliente
        SET nombre = ?, email = ?, telefono = ?
      WHERE id_cliente = ?`,
    [nombre, email, telefono, id]
  );
  return obtenerPorId(id);
}

/**
 * Elimina un cliente por su id.
 * @param {number} id
 * @returns {Promise<boolean>} true si se elimino, false si no existia
 */
async function eliminar(id) {
  const [result] = await pool.query(
    `DELETE FROM cliente WHERE id_cliente = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  obtenerPorEmail,
  crear,
  actualizar,
  eliminar
};
