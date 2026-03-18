const express = require('express');
const {
  crearTodosLosPlanes,
  testConnection,
  getConfiguracionPlanes,
  actualizarPrecios,
} = require('../controllers/planes.controller');

const router = express.Router();

router.post('/crear-planes-app',    crearTodosLosPlanes);
router.get('/test-connection',      testConnection);
router.get('/configuracion-planes', getConfiguracionPlanes);
router.put('/actualizar-precios',   actualizarPrecios);

module.exports = router;
