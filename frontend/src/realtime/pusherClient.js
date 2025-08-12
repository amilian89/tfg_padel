import Pusher from 'pusher-js';

let pusherInstance = null;
let currentChannel = null;

// Función para conectar a Pusher
export const connectPusher = (usuarioId) => {
  // Si no hay token o usuarioId, no conectar
  const token = localStorage.getItem('token');
  if (!token || !usuarioId) {
    console.log('No hay token o usuarioId, no conectando a Pusher');
    return null;
  }

  // Si ya hay una instancia conectada al mismo usuario, reutilizar
  if (pusherInstance && currentChannel) {
    const currentChannelName = currentChannel.name;
    if (currentChannelName === `user-${usuarioId}`) {
      console.log('Ya conectado al mismo usuario, reutilizando conexión');
      return {
        channel: currentChannel,
        disconnect: () => {
          if (currentChannel) {
            currentChannel.unsubscribe();
            currentChannel = null;
          }
          if (pusherInstance) {
            pusherInstance.disconnect();
            pusherInstance = null;
          }
        }
      };
    }
  }

  // Desconectar instancia anterior si existe
  if (pusherInstance) {
    pusherInstance.disconnect();
  }

  // Crear nueva instancia de Pusher
  pusherInstance = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER || 'eu',
    forceTLS: true
  });

  // Suscribirse al canal del usuario
  const channelName = `user-${usuarioId}`;
  currentChannel = pusherInstance.subscribe(channelName);

  console.log(`Conectado a Pusher en canal: ${channelName}`);

  return {
    channel: currentChannel,
    disconnect: () => {
      if (currentChannel) {
        currentChannel.unsubscribe();
        currentChannel = null;
      }
      if (pusherInstance) {
        pusherInstance.disconnect();
        pusherInstance = null;
      }
    }
  };
};

// Función para desconectar
export const disconnectPusher = () => {
  if (currentChannel) {
    currentChannel.unsubscribe();
    currentChannel = null;
  }
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};

// Función para verificar si Pusher está disponible
export const isPusherAvailable = () => {
  return !!(process.env.REACT_APP_PUSHER_KEY && process.env.REACT_APP_PUSHER_CLUSTER);
}; 