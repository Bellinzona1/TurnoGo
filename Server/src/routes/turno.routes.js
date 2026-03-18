const express = require('express');
const {
  createTurno,
  getTurnos,
  getTurnoById,
  getTurnosByEmprendimientoId,
  editTurno,
  deleteTurno,
} = require('../controllers/turno.controller');
const { agregarReserva, getTurnoConReservas, eliminarReserva } = require('../controllers/reserva.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Rutas específicas primero para evitar conflictos con /:id
router.get('/emprendimiento/:emprendimientoId', getTurnosByEmprendimientoId);

router.get('/',    getTurnos);
router.get('/:id', getTurnoById);
router.post('/:emprendimientoId',  authMiddleware, createTurno);
router.put('/:id',                 authMiddleware, editTurno);
router.delete('/:id',              authMiddleware, deleteTurno);

// Sub-recurso: reservas de un turno
router.get('/:id/reservas',                     getTurnoConReservas);
router.post('/:id/reservas',                    agregarReserva);
router.delete('/:id/reservas/:reservaId',       authMiddleware, eliminarReserva);

module.exports = router;
