/**
 * src/controllers/cliente.controller.js
 * =========================================================================
 * Capa de control: traduce peticiones HTTP a llamadas al modelo y arma
 * las respuestas JSON con el codigo HTTP adecuado.
 *
 * Reglas que aplicamos:
 *   - Respuesta exitosa: { success: true,  data: ... }
 *   - Respuesta fallida: { success: false, error: ..., mensaje: ... }
 *     (el formato fallido lo arma el middleware errorHandler)
 *
 * Codigos HTTP devueltos por cada operacion:
 *   GET    /api/clientes      -> 200
 *   GET    /api/clientes/:id  -> 200 | 404
 *   POST   /api/clientes      -> 201 | 400 | 409
 *   PUT    /api/clientes/:id  -> 200 | 400 | 404 | 409
 *   DELETE /api/clientes/:id  -> 200 | 404
 * =========================================================================
 */
const Cliente = require('../models/cliente.model');
const ApiError = require('../utils/ApiError');

// =====================================================================
//  GET /api/clientes  ->  Listar todos
// =====================================================================
const listar = async (req, res) => {
  const clientes = await Cliente.obtenerTodos();
  res.status(200).json({
    success: true,
    total: clientes.length,
    data: clientes
  });
};

// =====================================================================
//  GET /api/clientes/:id  ->  Obtener por id
// =====================================================================
const obtener = async (req, res) => {
  const { id } = req.params;
  const cliente = await Cliente.obtenerPorId(id);

  if (!cliente) {
    throw new ApiError(404, `No existe un cliente con ID ${id}`);
  }

  res.status(200).json({ success: true, data: cliente });
};

// =====================================================================
//  POST /api/clientes  ->  Crear
// =====================================================================
const crear = async (req, res) => {
  const { nombre, email, telefono } = req.body;

  // Verificacion previa del email duplicado para devolver 409 claro.
  // (Tambien tenemos un fallback en errorHandler por si la BD lo lanza
  // directamente con ER_DUP_ENTRY, pero asi el mensaje es mas amigable.)
  const existente = await Cliente.obtenerPorEmail(email);
  if (existente) {
    throw new ApiError(409, `Ya existe un cliente con el correo ${email}`);
  }

  const nuevo = await Cliente.crear({ nombre, email, telefono });

  res.status(201).json({
    success: true,
    mensaje: 'Cliente creado correctamente',
    data: nuevo
  });
};

// =====================================================================
//  PUT /api/clientes/:id  ->  Actualizar
// =====================================================================
const actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;

  // 1) Verificar que exista
  const existente = await Cliente.obtenerPorId(id);
  if (!existente) {
    throw new ApiError(404, `No existe un cliente con ID ${id}`);
  }

  // 2) Verificar que el nuevo email no este en uso por OTRO cliente
  const conflicto = await Cliente.obtenerPorEmail(email, id);
  if (conflicto) {
    throw new ApiError(409, `El correo ${email} ya esta siendo usado por otro cliente`);
  }

  // 3) Actualizar y devolver el resultado
  const actualizado = await Cliente.actualizar(id, { nombre, email, telefono });

  res.status(200).json({
    success: true,
    mensaje: 'Cliente actualizado correctamente',
    data: actualizado
  });
};

// =====================================================================
//  DELETE /api/clientes/:id  ->  Eliminar
// =====================================================================
const eliminar = async (req, res) => {
  const { id } = req.params;
  const eliminado = await Cliente.eliminar(id);

  if (!eliminado) {
    throw new ApiError(404, `No existe un cliente con ID ${id}`);
  }

  res.status(200).json({
    success: true,
    mensaje: `Cliente con ID ${id} eliminado correctamente`
  });
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};
