// Script para listar todos los planes existentes en MercadoPago
const axios = require('axios');

const listExistingPlans = async () => {
  try {
    const response = await axios.get('https://api.mercadopago.com/preapproval_plan/search', {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📋 Planes existentes:');
    response.data.results.forEach(plan => {
      console.log(`- ${plan.reason} (ID: ${plan.id})`);
      console.log(`  Precio: $${plan.auto_recurring.transaction_amount}`);
      console.log(`  Status: ${plan.status}`);
      console.log('---');
    });

    return response.data.results;
  } catch (error) {
    console.error('Error obteniendo planes:', error.response?.data || error);
  }
};

// Ejecutar
listExistingPlans();
