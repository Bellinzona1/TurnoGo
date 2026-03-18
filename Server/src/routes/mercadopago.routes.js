const express = require('express');
const {
  conectarMercadoPago,
  desconectarMercadoPago,
  crearPreference,
  webhookMP,
  getPlanes,
  createPlan,
} = require('../controllers/mercadopago.controller');

const router = express.Router();

router.post('/token',            conectarMercadoPago);
router.post('/desconectar',      desconectarMercadoPago);
router.post('/crear-preferencia', crearPreference);
router.post('/webhook',          webhookMP);
router.get('/planes',            getPlanes);
router.post('/crear-plan',       createPlan);

module.exports = router;
