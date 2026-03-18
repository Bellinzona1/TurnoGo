const axios = require('axios');
const User = require('../models/user.model');
const { PLAN_TO_ROLE_MAPPING } = require('../constants/mercadopago.constants');

const handleWebhook = async (req, res, next) => {
  try {
    const { type, data, action } = req.body;

    if (type === 'subscription_preapproval' && (action === 'updated' || action === 'created')) {
      const subscriptionId      = data.id;
      const subscriptionDetails = await getSubscriptionDetails(subscriptionId);

      if (subscriptionDetails?.status === 'authorized') {
        await processSubscriptionUpdate(subscriptionDetails, subscriptionId);
      }
    }

    res.status(200).json({ message: 'Webhook procesado correctamente' });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const response = await axios.get(
      `https://api.mercadopago.com/preapproval/${subscriptionId}`,
      {
        headers: {
          Authorization:  `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error obteniendo detalles de suscripción:', error.response?.data || error.message);
    return null;
  }
};

const processSubscriptionUpdate = async (subscriptionDetails, subscriptionId) => {
  const statusMapping = {
    authorized: 'active',
    active:     'active',
    paused:     'inactive',
    cancelled:  'cancelled',
    pending:    'pending',
  };

  const mappedStatus    = statusMapping[subscriptionDetails.status] || 'pending';
  let   userEmail       = subscriptionDetails.payer_email;
  const planId          = subscriptionDetails.preapproval_plan_id;
  const externalReference = subscriptionDetails.external_reference;
  const payerId         = subscriptionDetails.payer_id;

  // Prioridad 1: payer_email de la suscripción
  // Prioridad 2: email embebido en external_reference
  if (!userEmail && externalReference) {
    const parts = externalReference.split('_');
    if (parts.length >= 3) userEmail = parts.slice(2).join('_');
  }

  // Prioridad 3: suscripción pendiente guardada (más específico) o payer_id existente
  if (!userEmail && payerId) {
    const userWithPending = await User.findOne({
      'pendingSubscription.planId':    planId,
      'pendingSubscription.timestamp': { $gte: new Date(Date.now() - 30 * 60 * 1000) },
    }).sort({ 'pendingSubscription.timestamp': -1 });

    if (userWithPending) {
      userEmail = userWithPending.email;
      userWithPending.mercadoPagoPayerId  = payerId;
      userWithPending.pendingSubscription = undefined;
      await userWithPending.save();
    } else {
      const userByPayerId = await User.findOne({ mercadoPagoPayerId: payerId });
      if (userByPayerId) userEmail = userByPayerId.email;
    }
  }

  const planConfig = PLAN_TO_ROLE_MAPPING[planId];

  if (planConfig && userEmail) {
    if (subscriptionDetails.status === 'authorized' || subscriptionDetails.status === 'active') {
      const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        {
          role:               planConfig.role,
          accountStatus:      planConfig.accountStatus,
          subscriptionId,
          subscriptionStatus: mappedStatus,
          mercadoPagoPayerId: payerId,
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error(`Usuario con email ${userEmail} no encontrado en la BD`);
      }
    }
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { email, role, accountStatus } = req.body;

    if (!email || !role || !accountStatus) {
      return res.status(400).json({ error: 'Email, rol y accountStatus son requeridos' });
    }

    const updatedUser = await User.findOneAndUpdate({ email }, { role, accountStatus }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user: {
        id:            updatedUser._id,
        email:         updatedUser.email,
        role:          updatedUser.role,
        accountStatus: updatedUser.accountStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

const linkPayerId = async (req, res, next) => {
  try {
    const { email, payerId } = req.body;

    if (!email || !payerId) {
      return res.status(400).json({ error: 'Email y payerId son requeridos' });
    }

    const updatedUser = await User.findOneAndUpdate({ email }, { mercadoPagoPayerId: payerId }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.status(200).json({
      message: 'Payer ID vinculado correctamente',
      user: {
        id:                 updatedUser._id,
        email:              updatedUser.email,
        mercadoPagoPayerId: updatedUser.mercadoPagoPayerId,
      },
    });
  } catch (error) {
    next(error);
  }
};

const clearSubscriptionData = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email es requerido' });

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $unset: { subscriptionId: 1, subscriptionStatus: 1, pendingSubscription: 1 } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.status(200).json({
      message: 'Datos temporales de suscripción limpiados (payer_id conservado)',
      user: {
        id:            updatedUser._id,
        email:         updatedUser.email,
        role:          updatedUser.role,
        accountStatus: updatedUser.accountStatus,
        hasPayerId:    !!updatedUser.mercadoPagoPayerId,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleWebhook, updateUserRole, linkPayerId, clearSubscriptionData };
