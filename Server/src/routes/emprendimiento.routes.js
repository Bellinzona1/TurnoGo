const express = require('express');
const {
  createEmprendimiento,
  getEmprendimientos,
  getEmprendimientoByUserId,
  editEmprendimientoByUserId,
  getEmprendimientoByName,
} = require('../controllers/emprendimiento.controller');
const { addService, deleteService } = require('../controllers/servicio.controller');
const { addRed, clearRedes }        = require('../controllers/red.controller');
const authMiddleware                = require('../middlewares/auth.middleware');

const router = express.Router();

// Rutas específicas y de recursos anidados ANTES de la ruta dinámica /:id
router.get('/',                                    getEmprendimientos);
router.get('/getByname/:name',                     getEmprendimientoByName);
router.post('/servicio/:emprendimientoId',  authMiddleware, addService);
router.delete('/servicio/:emprendimientoId', authMiddleware, deleteService);
router.post('/red/:emprendimientoId',        authMiddleware, addRed);
router.delete('/redes/:emprendimientoId',    authMiddleware, clearRedes);

// Rutas con parámetro dinámico al final para evitar conflictos con las anteriores
router.post('/:id',  authMiddleware, createEmprendimiento);
router.get('/:id',                   getEmprendimientoByUserId);
router.put('/:id',   authMiddleware, editEmprendimientoByUserId);

module.exports = router;
