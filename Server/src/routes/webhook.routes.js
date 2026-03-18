const express = require('express');
const { handleWebhook, updateUserRole, linkPayerId, clearSubscriptionData } = require('../controllers/webhook.controller');

const router = express.Router();

// MercadoPago envía POST sin autenticación — no agregar authMiddleware aquí
router.post('/mercadopago',      handleWebhook);
router.put('/update-user-role',  updateUserRole);
router.post('/link-payer',       linkPayerId);
router.post('/clear-user',       clearSubscriptionData);

module.exports = router;
