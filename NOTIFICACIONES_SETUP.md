# Sistema de Notificaciones en Tiempo Real con Pusher

Este documento describe la implementación del sistema de notificaciones en tiempo real para el proyecto ProPista.

## 🚀 Características Implementadas

- ✅ Notificaciones en tiempo real con Pusher
- ✅ Canales por usuario (`user-<usuarioId>`)
- ✅ Campana con badge en el header
- ✅ Fallback de polling (30s) si Pusher no está disponible
- ✅ Página dedicada de notificaciones con paginación
- ✅ Integración en MisSolicitudes y SolicitudesRecibidas
- ✅ Singleton pattern para evitar reconexiones múltiples

## 📋 Configuración Requerida

### 1. Variables de Entorno - Backend

Crear archivo `backend/.env`:

```env
DATABASE_URL="file:./dev.db"

# Pusher Configuration
PUSHER_APP_ID=tu_app_id_aqui
PUSHER_KEY=tu_key_aqui
PUSHER_SECRET=tu_secret_aqui
PUSHER_CLUSTER=eu
```

### 2. Variables de Entorno - Frontend

Crear archivo `frontend/.env`:

```env
# Pusher Configuration
REACT_APP_PUSHER_KEY=tu_key_aqui
REACT_APP_PUSHER_CLUSTER=eu
```

## 🔧 Configuración de Pusher

1. Crear cuenta en [Pusher](https://pusher.com/)
2. Crear una nueva app
3. Copiar las credenciales a los archivos `.env`
4. Configurar el cluster según tu ubicación (eu, us1, ap1, etc.)

## 📁 Archivos Creados/Modificados

### Backend

**Nuevos archivos:**
- `src/realtime/pusher.js` - Configuración de Pusher Server
- `src/controllers/notificaciones.controller.js` - Controlador de notificaciones
- `src/routes/notificaciones.routes.js` - Rutas de notificaciones

**Archivos modificados:**
- `src/app.js` - Agregada ruta de notificaciones
- `src/controllers/solicitudes.controller.js` - Integración de notificaciones

### Frontend

**Nuevos archivos:**
- `src/realtime/pusherClient.js` - Cliente de Pusher con singleton
- `src/services/notificaciones.js` - Servicios de notificaciones
- `src/hooks/useNotificaciones.js` - Hook personalizado para notificaciones
- `src/pages/Notificaciones.jsx` - Página de notificaciones
- `src/pages/Notificaciones.css` - Estilos de notificaciones

**Archivos modificados:**
- `src/components/Header.jsx` - Agregada campana de notificaciones
- `src/components/Header.css` - Estilos de la campana
- `src/App.js` - Agregada ruta de notificaciones
- `src/pages/MisSolicitudes.jsx` - Integración de notificaciones
- `src/pages/SolicitudesRecibidas.jsx` - Integración de notificaciones

## 🔄 Flujo de Notificaciones

### 1. Demandante aplica a oferta
- Se crea solicitud en BD
- Se crea notificación para el club
- Se emite evento `notificacion:nueva` al canal `user-<clubUsuarioId>`
- Club recibe notificación en tiempo real

### 2. Club acepta/deniega solicitud
- Se actualiza estado de solicitud
- Se crea notificación para el demandante
- Se emite evento `notificacion:nueva` al canal `user-<demandanteUsuarioId>`
- Demandante recibe notificación en tiempo real

## 🎯 Endpoints API

### Notificaciones
- `GET /notificaciones?usuarioId=&page=&pageSize=` - Listar notificaciones
- `PUT /notificaciones/:id/leida` - Marcar como leída
- `GET /notificaciones/unread-count?usuarioId=` - Contador de no leídas

## 🧪 Pruebas Manuales

1. **Demandante aplica → Club recibe notificación**
   - Demandante aplica a una oferta
   - Club debe ver badge incrementarse en tiempo real
   - Club debe ver notificación en la página de notificaciones

2. **Club acepta/deniega → Demandante recibe notificación**
   - Club acepta o deniega una solicitud
   - Demandante debe ver badge incrementarse en tiempo real
   - Demandante debe ver notificación en la página de notificaciones

3. **Fallback de polling**
   - Desactivar Pusher (cambiar credenciales incorrectas)
   - El sistema debe seguir funcionando con polling cada 30s

4. **Navegación sin reconexiones**
   - Cambiar entre rutas
   - No debe haber reconexiones múltiples a Pusher

## 🔍 Debugging

### Logs del Backend
```javascript
// En solicitudes.controller.js
console.log('Nueva solicitud creada:', nuevaSolicitud.id);
console.log('Notificación enviada a club:', clubUsuarioId);

// En notificaciones.controller.js
console.log('Notificación creada:', notificacion.id);
```

### Logs del Frontend
```javascript
// En pusherClient.js
console.log('Conectado a Pusher en canal:', channelName);
console.log('Ya conectado al mismo usuario, reutilizando conexión');

// En useNotificaciones.js
console.log('Nueva notificación recibida:', data);
console.log('Conectado a Pusher exitosamente');
```

## 🚨 Solución de Problemas

### Pusher no conecta
1. Verificar credenciales en `.env`
2. Verificar cluster configurado
3. Verificar que la app esté activa en el panel de Pusher

### Notificaciones no llegan
1. Verificar que el usuarioId esté correcto
2. Verificar logs del backend para errores
3. Verificar que el canal sea `user-<usuarioId>`

### Badge no se actualiza
1. Verificar conexión a Pusher en consola
2. Verificar que el hook useNotificaciones esté funcionando
3. Verificar fallback de polling

## 📝 Notas Importantes

- Las notificaciones se crean en la BD para persistencia
- El sistema funciona sin Pusher usando polling como fallback
- Se usa singleton pattern para evitar múltiples conexiones
- Las notificaciones se marcan como leídas al hacer clic
- El contador se actualiza en tiempo real en todas las páginas 