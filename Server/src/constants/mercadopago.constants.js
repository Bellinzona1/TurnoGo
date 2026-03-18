// Mapeo de plan IDs de MercadoPago a roles y estados de cuenta del usuario
const PLAN_TO_ROLE_MAPPING = {
  'c8fe032c34eb47cba047a70e9c8fc4c6': { role: 'owner', accountStatus: 'Picado' }, // Plan Picadito Original
  'd9d53576e2ce4827841c81b3dce57f7e': { role: 'owner', accountStatus: 'Picado' }, // Plan Picadito Test
  '1cf532e13e6d4430abebf9bdf58f855a': { role: 'owner', accountStatus: 'Pro' },    // Plan PRO
  '4d131bf887f54e35a25353741722bfad': { role: 'owner', accountStatus: 'Premium' }, // Plan 5 Estrellas
};

// Configuración de los planes disponibles para suscripción
const PLAN_CONFIGS = {
  picadito: {
    planId: 'd9d53576e2ce4827841c81b3dce57f7e',
    planName: 'Plan Picadito Test',
  },
  pro: {
    planId: '1cf532e13e6d4430abebf9bdf58f855a',
    planName: 'Plan PRO',
  },
  premium: {
    planId: '4d131bf887f54e35a25353741722bfad',
    planName: 'Plan Premium',
  },
};

module.exports = { PLAN_TO_ROLE_MAPPING, PLAN_CONFIGS };
