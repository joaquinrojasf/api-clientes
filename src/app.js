/**
 * src/app.js
 * =========================================================================
 * Configuracion principal de la aplicacion Express.
 *
 * Aqui se aplican TODAS las medidas de seguridad y middlewares globales:
 *  - helmet           -> cabeceras HTTP seguras (XSS, clickjacking, etc.)
 *  - cors             -> control de origenes permitidos (CORS)
 *  - express-rate-limit -> limita peticiones por IP (anti fuerza bruta / DoS)
 *  - express.json     -> parseo de cuerpo JSON con limite de tamano
 *  - morgan           -> logging de peticiones HTTP
 *
 * El orden de los middlewares importa: seguridad primero, luego parseo,
 * luego rutas, luego manejo de errores al final.
 * =========================================================================
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const clienteRoutes = require('./routes/cliente.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// ============================================================
//  MIDDLEWARES DE SEGURIDAD Y CONFIGURACION
// ============================================================

// Helmet -> agrega cabeceras HTTP seguras (X-Frame-Options, CSP, etc.)
app.use(helmet());

// CORS -> permite peticiones desde otros origenes (por ejemplo, un frontend)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Logging de peticiones (solo en desarrollo, evita ruido en produccion)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limita el tamano del body para evitar payloads maliciosos enormes
app.use(express.json({ limit: '10kb' }));

// Rate limiter -> protege contra fuerza bruta y DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // ventana de 15 minutos
  max: 100,                    // maximo 100 peticiones por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas peticiones',
    mensaje: 'Has superado el limite de peticiones. Intenta nuevamente en 15 minutos.'
  }
});
app.use('/api', limiter);

// ============================================================
//  RUTAS
// ============================================================

// Documentacion rapida en la raiz
app.get('/', (req, res) => {
  res.status(200).json({
    api: 'API REST de Clientes',
    version: '1.0.0',
    asignatura: 'CIB302 - Taller de Plataformas Web - AIEP',
    endpoints: {
      listar:     'GET    /api/clientes',
      obtener:    'GET    /api/clientes/:id',
      crear:      'POST   /api/clientes',
      actualizar: 'PUT    /api/clientes/:id',
      eliminar:   'DELETE /api/clientes/:id'
    }
  });
});

// Health-check para monitoreo (buena practica)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rutas de la entidad cliente
app.use('/api/clientes', clienteRoutes);

// ============================================================
//  MANEJO DE ERRORES (siempre al final)
// ============================================================
app.use(notFound);     // ruta no encontrada -> 404
app.use(errorHandler); // manejador central de errores -> 400/404/409/500

module.exports = app;
