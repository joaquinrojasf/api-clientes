/**
 * src/validators/cliente.validator.js
 * =========================================================================
 * Reglas de validacion para la entidad 'cliente' usando express-validator.
 *
 * Toda entrada del usuario se valida ANTES de llegar a la base de datos.
 * Esto cumple dos objetivos:
 *   1) Seguridad: rechaza datos malformados o maliciosos.
 *   2) UX: devuelve mensajes 400 claros indicando que campo fallo.
 * =========================================================================
 */
const { body, param, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// ------------------------------------------------------------------
//  REGLAS REUTILIZABLES PARA EL CUERPO (POST / PUT)
// ------------------------------------------------------------------
const reglasCuerpo = [
  body('nombre')
    .exists({ checkFalsy: true }).withMessage('El campo nombre es obligatorio')
    .bail()
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s.'-]+$/).withMessage('El nombre solo admite letras, espacios y los simbolos . \' -'),

  body('email')
    .exists({ checkFalsy: true }).withMessage('El campo email es obligatorio')
    .bail()
    .isString().withMessage('El email debe ser una cadena de texto')
    .trim()
    .isEmail().withMessage('Debe ser un correo electronico valido')
    .normalizeEmail()
    .isLength({ max: 150 }).withMessage('El email no puede exceder los 150 caracteres'),

  body('telefono')
    .exists({ checkFalsy: true }).withMessage('El campo telefono es obligatorio')
    .bail()
    .isString().withMessage('El telefono debe ser una cadena de texto')
    .trim()
    .isLength({ min: 7, max: 20 }).withMessage('El telefono debe tener entre 7 y 20 caracteres')
    .matches(/^[0-9+\-\s()]+$/).withMessage('El telefono solo admite numeros y los simbolos + - ( )')
];

// ------------------------------------------------------------------
//  VALIDACION DE PARAMETRO :id EN LA URL
// ------------------------------------------------------------------
const validarParamId = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un numero entero positivo')
    .toInt()
];

// ------------------------------------------------------------------
//  COMBINACIONES POR OPERACION
// ------------------------------------------------------------------
const validarCrear     = reglasCuerpo;
const validarActualizar = [...validarParamId, ...reglasCuerpo];
const validarId        = validarParamId;

// ------------------------------------------------------------------
//  MIDDLEWARE QUE REVISA LOS RESULTADOS Y LANZA 400 SI HUBO ERRORES
// ------------------------------------------------------------------
const verificarValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const detalles = errores.array().map(e => ({
      campo:   e.path,
      mensaje: e.msg,
      valor:   e.value
    }));
    return next(new ApiError(400, 'Datos de entrada invalidos', detalles));
  }
  next();
};

module.exports = {
  validarCrear,
  validarActualizar,
  validarId,
  verificarValidacion
};
