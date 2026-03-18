const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const Turno = require('../models/turno.model');

const conectarMercadoPago = async (req, res, next) => {
  try {
    const { code, code_verifier, userId_body } = req.body;

    if (!code || !code_verifier) {
      return res.status(400).json({ message: 'Faltan parámetros' });
    }

    const response = await axios.post('https://api.mercadopago.com/oauth/token', {
      grant_type:    'authorization_code',
      client_id:     process.env.MP_CLIENT_ID,
      client_secret: process.env.MP_CLIENT_SECRET,
      code,
      code_verifier,
      redirect_uri:  process.env.MP_REDIRECT_URI,
    });

    const { access_token, user_id } = response.data;

    const user = await User.findByIdAndUpdate(
      userId_body,
      { mercadoPagoToken: access_token, mercadoPagoUserId: user_id },
      { new: true }
    );

    res.json({ message: 'Vinculación exitosa', user });
  } catch (error) {
    next(error);
  }
};

const desconectarMercadoPago = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { mercadoPagoToken: null, mercadoPagoUserId: null },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Cuenta de Mercado Pago desconectada con éxito', user });
  } catch (error) {
    next(error);
  }
};

const crearPreference = async (req, res, next) => {
  try {
    const { emprendimiento, price, nombreCancha, reserva, turnoId } = req.body;

    const user = await User.findOne({ emprendimiento: emprendimiento._id });
    if (!user?.mercadoPagoToken) {
      return res.status(400).json({ message: 'El emprendimiento no está vinculado a una cuenta de Mercado Pago' });
    }

    const turno = await Turno.findById(turnoId);
    if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

    const yaReservado = turno.reservas.some(
      (r) =>
        r.estado === 'Confirmado' &&
        new Date(r.fecha).toISOString() === new Date(reserva.fecha).toISOString()
    );

    if (yaReservado) {
      return res.status(409).json({ message: 'Ya existe una reserva para ese horario.' });
    }

    const idReserva = uuidv4();
    turno.reservas.push({ ...reserva, estado: 'pendiente', idReserva });
    await turno.save();

    const externalRef = `${turnoId}|${idReserva}`;

    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items: [
          {
            title:       `Reserva en ${emprendimiento.nombre} - ${nombreCancha}`,
            description: `${nombreCancha}`,
            quantity:    1,
            currency_id: 'ARS',
            unit_price:  price,
          },
        ],
        back_urls: {
          success: process.env.MP_BACK_URL_SUCCESS,
          failure: process.env.MP_BACK_URL_FAILURE,
          pending: process.env.MP_BACK_URL_PENDING,
        },
        auto_return:      'approved',
        notification_url: process.env.MP_NOTIFICATION_URL,
        external_reference: externalRef,
      },
      { headers: { Authorization: `Bearer ${user.mercadoPagoToken}` } }
    );

    res.json({ init_point: response.data.init_point });
  } catch (error) {
    next(error);
  }
};

const webhookMP = async (req, res, next) => {
  try {
    const paymentId = req.query['data.id'];
    const topic     = req.query['type'];

    if (topic === 'payment') {
      const paymentResponse = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        { headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` } }
      );

      const payment     = paymentResponse.data;
      const externalRef = payment.external_reference;

      if (!externalRef) return res.status(400).send('Falta external_reference');

      const [turnoId, idReserva] = externalRef.split('|');
      if (!turnoId || !idReserva) return res.status(400).send('Formato incorrecto de external_reference');

      const turno = await Turno.findById(turnoId);
      if (!turno) return res.status(404).send('Turno no encontrado');

      const reserva = turno.reservas.find((r) => r.idReserva === idReserva);
      if (!reserva) return res.status(404).send('Reserva no encontrada');

      if (payment.status === 'approved') {
        reserva.estado = 'Confirmado';
        turno.markModified('reservas');
        await turno.save();
      }
    }

    res.status(200).send('Webhook procesado');
  } catch (error) {
    next(error);
  }
};

const getPlanes = async (req, res, next) => {
  try {
    const response = await axios.get('https://api.mercadopago.com/preapproval_plan/search', {
      headers: {
        Authorization:  `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const planes = response.data.results.map((plan) => ({
      id:             plan.id,
      name:           plan.reason,
      price:          plan.auto_recurring.transaction_amount,
      currency:       plan.auto_recurring.currency_id,
      frequency:      plan.auto_recurring.frequency,
      frequency_type: plan.auto_recurring.frequency_type,
      status:         plan.status,
    }));

    res.status(200).json({ success: true, planes });
  } catch (error) {
    next(error);
  }
};

const createPlan = async (req, res, next) => {
  try {
    const { name, price, frequency = 1, frequency_type = 'months' } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, error: 'Nombre y precio son requeridos' });
    }

    const planData = {
      reason: name,
      auto_recurring: {
        frequency,
        frequency_type,
        transaction_amount: price,
        currency_id: 'ARS',
      },
      payment_methods_allowed: {
        payment_types:   [{ id: 'credit_card' }, { id: 'debit_card' }],
        payment_methods: [{ id: 'visa' }, { id: 'master' }],
      },
      back_url: process.env.MP_BACK_URL_SUCCESS,
    };

    const response = await axios.post('https://api.mercadopago.com/preapproval_plan', planData, {
      headers: {
        Authorization:  `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(201).json({
      success: true,
      plan: {
        id:     response.data.id,
        name:   response.data.reason,
        price:  response.data.auto_recurring.transaction_amount,
        status: response.data.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { conectarMercadoPago, desconectarMercadoPago, crearPreference, webhookMP, getPlanes, createPlan };
