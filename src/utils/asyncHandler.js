/**
 * src/utils/asyncHandler.js
 * =========================================================================
 * Wrapper para funciones controladoras asincronicas.
 *
 * Evita repetir try/catch en cada controller. Si la funcion lanza un error
 * (o una promesa es rechazada), pasa el error a Express con next(err),
 * que lo enviara al middleware errorHandler.
 *
 * Uso:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 * =========================================================================
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
