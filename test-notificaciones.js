// Script de prueba para el sistema de notificaciones
// Ejecutar con: node test-notificaciones.js

const Pusher = require('pusher');

// Configuración de prueba (reemplazar con tus credenciales)
const pusher = new Pusher({
  appId: 'TU_APP_ID',
  key: 'TU_KEY',
  secret: 'TU_SECRET',
  cluster: 'eu',
  useTLS: true
});

// Función para emitir evento de prueba
const emitirNotificacionPrueba = (usuarioId) => {
  const channel = `user-${usuarioId}`;
  const evento = 'notificacion:nueva';
  const payload = {
    solicitudId: 1,
    ofertaId: 1,
    tipo: 'prueba',
    contenido: 'Esta es una notificación de prueba'
  };

  console.log(`Emitiendo evento a canal: ${channel}`);
  console.log(`Evento: ${evento}`);
  console.log(`Payload:`, payload);

  pusher.trigger(channel, evento, payload)
    .then(() => {
      console.log('✅ Evento emitido exitosamente');
    })
    .catch((error) => {
      console.error('❌ Error al emitir evento:', error);
    });
};

// Función para suscribirse a un canal de prueba
const suscribirseACanal = (usuarioId) => {
  const channel = `user-${usuarioId}`;
  console.log(`Suscribiéndose al canal: ${channel}`);
  
  // En el frontend, esto se haría con pusher-js
  console.log('En el frontend, usar:');
  console.log(`const channel = pusher.subscribe('${channel}');`);
  console.log(`channel.bind('notificacion:nueva', (data) => {`);
  console.log(`  console.log('Notificación recibida:', data);`);
  console.log(`});`);
};

// Función principal
const main = () => {
  console.log('🔔 Sistema de Notificaciones - Script de Prueba');
  console.log('===============================================\n');

  const usuarioId = process.argv[2] || '1';
  
  console.log(`Usuario ID: ${usuarioId}`);
  console.log(`Canal: user-${usuarioId}\n`);

  // Emitir notificación de prueba
  emitirNotificacionPrueba(usuarioId);
  
  console.log('\n--- Instrucciones para probar en el frontend ---');
  suscribirseACanal(usuarioId);
  
  console.log('\n--- Verificar en el navegador ---');
  console.log('1. Abrir DevTools > Console');
  console.log('2. Verificar que aparezcan los logs de conexión a Pusher');
  console.log('3. Verificar que el badge de notificaciones se actualice');
  console.log('4. Verificar que lleguen las notificaciones en tiempo real');
  
  console.log('\n--- Comandos útiles ---');
  console.log('Para probar con un usuario específico:');
  console.log(`node test-notificaciones.js ${usuarioId}`);
};

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = {
  emitirNotificacionPrueba,
  suscribirseACanal
}; 