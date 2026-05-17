/**
 * src/middlewares/notFound.js
 * =========================================================================
 * Middleware para rutas no definidas en la API.
 * Lanza un ApiError 404 que sera capturado por errorHandler.
 * =========================================================================
 */
const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
