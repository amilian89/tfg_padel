const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Obtener mis ofertas (solo para clubes)
export const getMisOfertas = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(
      `${API_URL}/ofertas/mias?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener mis ofertas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getMisOfertas:', error);
    throw error;
  }
};

// Eliminar oferta (solo para el club propietario)
export const deleteOferta = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/ofertas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la oferta');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en deleteOferta:', error);
    throw error;
  }
};
