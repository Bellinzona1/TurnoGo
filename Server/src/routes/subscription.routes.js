const express = require('express');
const { createCustomSubscription, testMercadoPago, testConnection } = require('../controllers/subscription.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/create-custom-subscription', authMiddleware, createCustomSubscription);
router.post('/test-mercadopago',           testMercadoPago);
router.get('/test-connection',             testConnection);

module.exports = router;
