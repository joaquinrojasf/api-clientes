/**
 * src/routes/cliente.routes.js
 * =========================================================================
 * Definicion de las rutas REST para la entidad 'cliente'.
 *
 * Cada ruta encadena, en este orden:
 *   1) Validacion de entrada (express-validator)
 *   2) Verificacion de errores de validacion -> 400 si los hay
 *   3) Controlador correspondiente envuelto con asyncHandler para que
 *      cualquier error vaya a errorHandler.
 *
 * Convenciones REST aplicadas:
 *   GET    /api/clientes      -> coleccion
 *   GET    /api/clientes/:id  -> recurso individual
 *   POST   /api/clientes      -> crear (cuerpo en JSON)
 *   PUT    /api/clientes/:id  -> reemplazar recurso completo
 *   DELETE /api/clientes/:id  -> eliminar recurso
 * =========================================================================
 */
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/cliente.controller');
const asyncHandler = require('../utils/asyncHandler');
const {
  validarCrear,
  validarActualizar,
  validarId,
  verificarValidacion
} = require('../validators/cliente.validator');

// ---------------------------------------------------------------------
//  GET  /api/clientes  ->  Listar todos
// ---------------------------------------------------------------------
router.get(
  '/',
  asyncHandler(ctrl.listar)
);

// ---------------------------------------------------------------------
//  GET  /api/clientes/:id  ->  Obtener por id
// ---------------------------------------------------------------------
router.get(
  '/:id',
  validarId,
  verificarValidacion,
  asyncHandler(ctrl.obtener)
);

// ---------------------------------------------------------------------
//  POST /api/clientes  ->  Crear
// ---------------------------------------------------------------------
router.post(
  '/',
  validarCrear,
  verificarValidacion,
  asyncHandler(ctrl.crear)
);

// ---------------------------------------------------------------------
//  PUT  /api/clientes/:id  ->  Actualizar
// ---------------------------------------------------------------------
router.put(
  '/:id',
  validarActualizar,
  verificarValidacion,
  asyncHandler(ctrl.actualizar)
);

// ---------------------------------------------------------------------
//  DELETE /api/clientes/:id  ->  Eliminar
// ---------------------------------------------------------------------
router.delete(
  '/:id',
  validarId,
  verificarValidacion,
  asyncHandler(ctrl.eliminar)
);

module.exports = router;
