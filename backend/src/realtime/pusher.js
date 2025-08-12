const Pusher = require('pusher');

// Configuración de Pusher desde variables de entorno
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true
});

// Helper para emitir eventos a un usuario específico
const emitToUser = (userId, event, payload) => {
  const channel = `user-${userId}`;
  return pusher.trigger(channel, event, payload);
};

module.exports = {
  pusher,
  emitToUser
}; 