import { authHeader } from './auth';

const API_URL = 'http://localhost:3000';

// Obtener notificaciones con paginación
export const getNotificaciones = async (usuarioId, page = 1, pageSize = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/notificaciones?usuarioId=${usuarioId}&page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getNotificaciones:', error);
    throw error;
  }
};

// Marcar notificación como leída
export const marcarComoLeida = async (notificacionId) => {
  try {
    const response = await fetch(
      `${API_URL}/notificaciones/${notificacionId}/leida`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al marcar notificación como leída');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en marcarComoLeida:', error);
    throw error;
  }
};

// Obtener contador de notificaciones no leídas
export const getContadorNoLeidas = async (usuarioId) => {
  try {
    const response = await fetch(
      `${API_URL}/notificaciones/unread-count?usuarioId=${usuarioId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener contador de notificaciones');
    }

    const data = await response.json();
    return data.contador;
  } catch (error) {
    console.error('Error en getContadorNoLeidas:', error);
    return 0; // Retornar 0 en caso de error para no romper la UI
  }
}; 