const axios = require('axios');

// Configuración de los planes disponibles (precios en ARS)
const PLANES_CONFIGURACION = {
  picadito: {
    name:  'Plan Picadito',
    price: 9990,
  },
  pro: {
    name:  'Plan PRO',
    price: 15990,
  },
  premium: {
    name:  'Plan 5 Estrellas',
    price: 25990,
  },
};

const crearTodosLosPlanes = async (req, res, next) => {
  try {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return res.status(400).json({ success: false, error: 'Token de MercadoPago no configurado' });
    }

    const planesCreados = [];

    for (const [key, planConfig] of Object.entries(PLANES_CONFIGURACION)) {
      try {
        const response = await axios.post(
          'https://api.mercadopago.com/preapproval_plan',
          {
            reason: planConfig.name,
            auto_recurring: {
              frequency:          1,
              frequency_type:     'months',
              transaction_amount: planConfig.price,
              currency_id:        'ARS',
            },
            payment_methods_allowed: {
              payment_types:   [{ id: 'credit_card' }, { id: 'debit_card' }],
              payment_methods: [{ id: 'visa' }, { id: 'master' }, { id: 'amex' }],
            },
            back_url: process.env.MP_BACK_URL_SUCCESS,
          },
          {
            headers: {
              Authorization:  `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        planesCreados.push({
          tipo:   key,
          id:     response.data.id,
          name:   response.data.reason,
          price:  response.data.auto_recurring.transaction_amount,
          status: response.data.status,
        });
      } catch (planError) {
        planesCreados.push({ tipo: key, error: planError.response?.data || planError.message });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Proceso de creación de planes completado',
      planes:  planesCreados,
    });
  } catch (error) {
    next(error);
  }
};

const testConnection = async (req, res, next) => {
  try {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return res.status(400).json({ success: false, error: 'Token de MercadoPago no configurado' });
    }

    const response = await axios.get('https://api.mercadopago.com/users/me', {
      headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
    });

    res.status(200).json({
      success:   true,
      message:   'Conexión con MercadoPago exitosa',
      user_info: {
        id:         response.data.id,
        nickname:   response.data.nickname,
        country_id: response.data.country_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getConfiguracionPlanes = (req, res) => {
  res.status(200).json({ success: true, configuracion: PLANES_CONFIGURACION });
};

const actualizarPrecios = (req, res) => {
  const { nuevosPrecios } = req.body;

  if (!nuevosPrecios) {
    return res.status(400).json({ success: false, error: 'nuevosPrecios es requerido' });
  }

  for (const [plan, precio] of Object.entries(nuevosPrecios)) {
    if (PLANES_CONFIGURACION[plan]) PLANES_CONFIGURACION[plan].price = precio;
  }

  res.status(200).json({
    success:       true,
    message:       'Precios actualizados',
    configuracion: PLANES_CONFIGURACION,
  });
};

module.exports = { crearTodosLosPlanes, testConnection, getConfiguracionPlanes, actualizarPrecios };
