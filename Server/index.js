require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const connectDB           = require('./src/config/db');
const userRoutes          = require('./src/routes/user.routes');
const emprendimientoRoutes = require('./src/routes/emprendimiento.routes');
const turnoRoutes         = require('./src/routes/turno.routes');
const mercadopagoRoutes   = require('./src/routes/mercadopago.routes');
const webhookRoutes       = require('./src/routes/webhook.routes');
const planesRoutes        = require('./src/routes/planes.routes');
const subscriptionRoutes  = require('./src/routes/subscription.routes');
const errorHandler        = require('./src/middlewares/errorHandler.middleware');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/users',          userRoutes);
app.use('/api/emprendimientos', emprendimientoRoutes);
app.use('/api/turnos',         turnoRoutes);
app.use('/api/mercadopago',    mercadopagoRoutes);
app.use('/api/webhook',        webhookRoutes);
app.use('/api/planes',         planesRoutes);
app.use('/api/subscriptions',  subscriptionRoutes);

// Manejador de errores centralizado — debe ir DESPUÉS de todas las rutas
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
