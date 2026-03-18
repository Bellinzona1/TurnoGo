const axios = require('axios');
const User = require('../models/user.model');
const { PLAN_CONFIGS } = require('../constants/mercadopago.constants');

const createCustomSubscription = async (req, res, next) => {
  try {
    const { planType } = req.body;

    if (!planType) return res.status(400).json({ error: 'planType es requerido' });

    const planConfig = PLAN_CONFIGS[planType];
    if (!planConfig) return res.status(400).json({ error: 'Tipo de plan no válido' });

    const userId = req.user.userId || req.user.id;
    const user   = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Corregir estado inválido heredado
    if (user.subscriptionStatus === 'authorized') {
      user.subscriptionStatus = 'active';
    }

    // Guardar intención de suscripción para que el webhook pueda identificar al usuario
    user.pendingSubscription = {
      planId:    planConfig.planId,
      planType,
      timestamp: new Date(),
      userId,
    };

    await user.save();

    const subscriptionUrl = new URL('https://www.mercadopago.com.ar/subscriptions/checkout');
    subscriptionUrl.searchParams.set('preapproval_plan_id',  planConfig.planId);
    subscriptionUrl.searchParams.set('external_reference',   `user_${userId}_${user.email}`);
    subscriptionUrl.searchParams.set('back_url',             process.env.MP_BACK_URL_SUCCESS);

    res.json({
      success:            true,
      subscriptionUrl:    subscriptionUrl.toString(),
      planName:           planConfig.planName,
      external_reference: `user_${userId}_${user.email}`,
    });
  } catch (error) {
    next(error);
  }
};

const testMercadoPago = async (req, res, next) => {
  try {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Token no configurado' });
    }

    const response = await axios.get('https://api.mercadopago.com/users/me', {
      headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
    });

    res.json({
      success:  true,
      message:  'Conexión a MercadoPago exitosa',
      userInfo: { id: response.data.id, email: response.data.email },
    });
  } catch (error) {
    next(error);
  }
};

const testConnection = (req, res) => {
  res.json({
    success:   true,
    message:   'Endpoint de suscripciones funcionando correctamente',
    timestamp: new Date().toISOString(),
    hasToken:  !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
  });
};

module.exports = { createCustomSubscription, testMercadoPago, testConnection };
