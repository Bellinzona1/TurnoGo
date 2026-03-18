# Sistema de Webhooks para MercadoPago

## Configuración completada:

### 1. Modelo de Usuario actualizado
- ✅ Campo `role` con valores: admin, owner, employee, user
- ✅ Campo `accountStatus` con valores: Picado, Pro, Premium
- ✅ Campos adicionales para suscripciones: `subscriptionId` y `subscriptionStatus`

### 2. Controlador de Webhook
- ✅ Archivo: `src/controllers/webhook.controller.js`
- ✅ Función `handleWebhook` para procesar notificaciones de MercadoPago
- ✅ Mapeo automático de planes a roles:
  - Plan Picadito (ID: d562d5a9902f4863b08e78933c22682e) → role: "owner", accountStatus: "Picado"

### 3. Rutas del Webhook
- ✅ Archivo: `src/routes/webhook.routes.js`
- ✅ Endpoint principal: `POST /api/webhook/mercadopago`
- ✅ Endpoint manual: `PUT /api/webhook/update-user-role`

### 4. Integración en el servidor
- ✅ Rutas agregadas al archivo principal `index.js`
- ✅ Servidor funcionando correctamente en puerto 8080

## Endpoints disponibles:

### 1. Webhook de MercadoPago
```
POST http://localhost:8080/api/webhook/mercadopago
```
- Recibe notificaciones automáticas de MercadoPago
- Procesa suscripciones aprobadas
- Actualiza automáticamente el rol del usuario

### 2. Actualización manual de roles
```
PUT http://localhost:8080/api/webhook/update-user-role
```
Body:
```json
{
  "email": "usuario@ejemplo.com",
  "role": "owner",
  "accountStatus": "Picado"
}
```

## Próximos pasos:

### 1. Configurar MercadoPago
- Ir al panel de MercadoPago
- Configurar la URL del webhook: `https://tudominio.com/api/webhook/mercadopago`
- Activar notificaciones para eventos de suscripción

### 2. Agregar IDs de otros planes
En `webhook.controller.js`, actualizar el mapeo:
```javascript
const PLAN_TO_ROLE_MAPPING = {
  'd562d5a9902f4863b08e78933c22682e': { role: 'owner', accountStatus: 'Picado' }, // Plan Picadito
  'ID_PLAN_PRO': { role: 'owner', accountStatus: 'Pro' }, // Plan PRO
  'ID_PLAN_PREMIUM': { role: 'owner', accountStatus: 'Premium' } // Plan Premium
};
```

### 3. Configurar redirecciones en el frontend
Agregar las redirecciones de MercadoPago para los planes PRO y Premium en `SuscripcionesComponent.jsx`

### 4. Testing
- Probar con MercadoPago Sandbox
- Verificar que los webhooks se reciban correctamente
- Comprobar que los roles se actualicen automáticamente

## Estado actual:
✅ **Sistema de webhooks funcionando**
✅ **Endpoints probados y funcionando**
✅ **Base de datos configurada**
⏳ **Pendiente: Configuración en MercadoPago**
⏳ **Pendiente: IDs de planes PRO y Premium**
