/**
 * src/middlewares/errorHandler.js
 * =========================================================================
 * Manejador CENTRAL de errores.
 *
 * Cualquier error lanzado en cualquier punto de la API termina aqui.
 * Su trabajo es:
 *   1) Identificar el tipo de error (controlado vs inesperado).
 *   2) Mapear errores conocidos de MySQL a codigos HTTP apropiados.
 *   3) Devolver una respuesta JSON consistente.
 *   4) Loguear los errores graves para que el desarrollador los vea.
 *
 * Codigos manejados: 400, 404, 409, 500.
 * =========================================================================
 */
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let mensaje    = err.message    || 'Error interno del servidor';
  let detalles   = err.details    || null;

  // -------------------------------------------------------------------
  //  MAPEO DE ERRORES ESPECIFICOS DE MySQL A CODIGOS HTTP
  // -------------------------------------------------------------------
  if (err.code === 'ER_DUP_ENTRY') {
    // Violacion de restriccion UNIQUE (ej. email duplicado)
    statusCode = 409;
    mensaje    = 'El recurso ya existe (valor duplicado)';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    mensaje    = 'Referencia invalida a otra entidad';
  } else if (err.code === 'ER_BAD_FIELD_ERROR') {
    statusCode = 400;
    mensaje    = 'Campo invalido en la consulta';
  } else if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    statusCode = 503;
    mensaje    = 'Base de datos no disponible';
  } else if (err.type === 'entity.parse.failed') {
    // express.json fallo al parsear el body
    statusCode = 400;
    mensaje    = 'JSON malformado en el cuerpo de la peticion';
  }

  // -------------------------------------------------------------------
  //  LOGGING (solo errores 500: los esperados no ensucian la consola)
  // -------------------------------------------------------------------
  if (statusCode >= 500) {
    console.error('❌ ERROR 500:', {
      ruta:    `${req.method} ${req.originalUrl}`,
      mensaje: err.message,
      stack:   err.stack
    });
  }

  // -------------------------------------------------------------------
  //  RESPUESTA JSON ESTANDAR
  // -------------------------------------------------------------------
  const respuesta = {
    success: false,
    statusCode,
    error:   nombreDeError(statusCode),
    mensaje
  };

  if (detalles) respuesta.detalles = detalles;

  // En desarrollo agregamos el stack para depurar; en produccion no.
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    respuesta.stack = err.stack;
  }

  res.status(statusCode).json(respuesta);
};

/**
 * Devuelve el nombre estandar del error segun el codigo HTTP.
 */
function nombreDeError(code) {
  const mapa = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    503: 'Service Unavailable'
  };
  return mapa[code] || 'Error';
}

module.exports = errorHandler;
