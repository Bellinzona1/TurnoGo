// Manejador de errores centralizado — registrar DESPUÉS de todas las rutas en index.js
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  if (status >= 500) {
    console.error(`[${req.method}] ${req.originalUrl} — ${status}:`, err);
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
