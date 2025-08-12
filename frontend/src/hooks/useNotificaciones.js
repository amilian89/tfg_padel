import { useState, useEffect, useRef } from 'react';
import { connectPusher, disconnectPusher, isPusherAvailable } from '../realtime/pusherClient';
import { getContadorNoLeidas } from '../services/notificaciones';

export const useNotificaciones = (usuarioId) => {
  const [contadorNoLeidas, setContadorNoLeidas] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const pusherRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Función para obtener contador inicial
  const fetchContador = async () => {
    if (!usuarioId) return;
    
    try {
      const contador = await getContadorNoLeidas(usuarioId);
      setContadorNoLeidas(contador);
      setError(null);
    } catch (err) {
      console.error('Error al obtener contador:', err);
      setError('Error al cargar notificaciones');
    }
  };

  // Función para incrementar contador
  const incrementarContador = () => {
    setContadorNoLeidas(prev => prev + 1);
  };

  // Función para decrementar contador
  const decrementarContador = () => {
    setContadorNoLeidas(prev => Math.max(0, prev - 1));
  };

  // Función para resetear contador
  const resetearContador = () => {
    setContadorNoLeidas(0);
  };

  // Configurar Pusher
  useEffect(() => {
    if (!usuarioId) return;

    // Obtener contador inicial
    fetchContador();

    // Intentar conectar a Pusher
    if (isPusherAvailable()) {
      try {
        const pusher = connectPusher(usuarioId);
        
        if (pusher) {
          pusherRef.current = pusher;
          
          // Suscribirse a eventos de notificación
          pusher.channel.bind('notificacion:nueva', (data) => {
            console.log('Nueva notificación recibida:', data);
            incrementarContador();
          });

          setIsConnected(true);
          setError(null);
          
          console.log('Conectado a Pusher exitosamente');
        } else {
          throw new Error('No se pudo conectar a Pusher');
        }
      } catch (err) {
        console.error('Error al conectar a Pusher:', err);
        setIsConnected(false);
        setError('Error al conectar notificaciones en tiempo real');
      }
    } else {
      console.log('Pusher no disponible, usando polling');
      setIsConnected(false);
    }

    // Fallback: polling cada 30 segundos si Pusher no está disponible
    if (!isPusherAvailable() || !isConnected) {
      pollingIntervalRef.current = setInterval(fetchContador, 30000);
    }

    // Cleanup
    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      disconnectPusher();
    };
  }, [usuarioId]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      disconnectPusher();
    };
  }, []);

  return {
    contadorNoLeidas,
    isConnected,
    error,
    incrementarContador,
    decrementarContador,
    resetearContador,
    refetch: fetchContador
  };
}; 