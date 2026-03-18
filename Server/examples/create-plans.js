// Ejemplo de cómo crear planes y obtener sus IDs
const axios = require('axios');

const createSubscriptionPlan = async (planData) => {
  try {
    const response = await axios.post('https://api.mercadopago.com/preapproval_plan', {
      reason: planData.name,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: planData.price,
        currency_id: "ARS"
      },
      payment_methods_allowed: {
        payment_types: [
          { id: "credit_card" },
          { id: "debit_card" }
        ],
        payment_methods: [
          { id: "visa" },
          { id: "master" }
        ]
      },
      back_url: "https://tuapp.com/success"
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Plan creado:', response.data);
    console.log('ID del plan:', response.data.id); // ← ESTE ES EL ID QUE NECESITAS
    
    return response.data;
  } catch (error) {
    console.error('Error creando plan:', error.response?.data || error);
  }
};

// Ejemplos de planes
const plans = [
  { name: "Plan PRO", price: 15000 },
  { name: "Plan 5 Estrellas", price: 25000 }
];

// Crear los planes y obtener los IDs
plans.forEach(async (plan) => {
  const createdPlan = await createSubscriptionPlan(plan);
  console.log(`${plan.name} - ID: ${createdPlan.id}`);
});
