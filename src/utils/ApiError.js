/**
 * src/utils/ApiError.js
 * =========================================================================
 * Clase de error personalizada para errores controlados de la API.
 *
 * Permite lanzar errores con un codigo HTTP especifico desde cualquier
 * capa del codigo:
 *     throw new ApiError(404, 'Cliente no encontrado');
 *
 * El middleware errorHandler los captura y los traduce a respuestas JSON
 * con el codigo HTTP correcto.
 * =========================================================================
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - Codigo HTTP (400, 404, 409, etc.)
   * @param {string} message    - Mensaje legible para el cliente
   * @param {Array}  [details]  - Detalles opcionales (ej. errores de validacion)
   */
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // marca: es un error esperado, no un bug
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
