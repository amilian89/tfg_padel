import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotificaciones, marcarComoLeida } from '../services/notificaciones';
import { useNotificaciones } from '../hooks/useNotificaciones';
import './Notificaciones.css';

const Notificaciones = () => {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  
  const usuarioId = localStorage.getItem('id');
  const { contadorNoLeidas, decrementarContador, refetch } = useNotificaciones(usuarioId);

  const pageSize = 10;

  // Cargar notificaciones
  const cargarNotificaciones = async (pageNum = 1) => {
    if (!usuarioId) return;

    try {
      setLoading(true);
      const response = await getNotificaciones(usuarioId, pageNum, pageSize);
      
      if (pageNum === 1) {
        setNotificaciones(response.items);
      } else {
        setNotificaciones(prev => [...prev, ...response.items]);
      }
      
      setHasMore(response.hasMore);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  // Cargar más notificaciones
  const cargarMas = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      cargarNotificaciones(nextPage);
    }
  };

  // Marcar notificación como leída
  const handleMarcarComoLeida = async (notificacionId) => {
    try {
      await marcarComoLeida(notificacionId);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === notificacionId 
            ? { ...notif, leida: true }
            : notif
        )
      );
      
      // Decrementar contador
      decrementarContador();
      
    } catch (err) {
      console.error('Error al marcar como leída:', err);
      setError('Error al marcar la notificación como leída');
    }
  };

  // Navegar a la URL de redirección
  const handleNotificacionClick = (notificacion) => {
    if (!notificacion.leida) {
      handleMarcarComoLeida(notificacion.id);
    }
    
    if (notificacion.urlRedireccion) {
      navigate(notificacion.urlRedireccion);
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cargar notificaciones al montar
  useEffect(() => {
    cargarNotificaciones();
  }, [usuarioId]);

  // Refetch cuando cambie el contador (nueva notificación)
  useEffect(() => {
    if (contadorNoLeidas > 0) {
      cargarNotificaciones();
    }
  }, [contadorNoLeidas]);

  if (!usuarioId) {
    return (
      <div className="container">
        <div className="notificaciones-container">
          <h1>Notificaciones</h1>
          <p>Debes iniciar sesión para ver tus notificaciones.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="notificaciones-container">
        <div className="notificaciones-header">
          <div className="notificaciones-header-left">
            <button 
              className="btn btn-outline back-btn"
              onClick={() => navigate('/panel')}
            >
              ← Volver al panel
            </button>
            <h1>Notificaciones</h1>
          </div>
          {total > 0 && (
            <span className="notificaciones-count">
              {total} notificación{total !== 1 ? 'es' : ''}
            </span>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && notificaciones.length === 0 ? (
          <div className="loading">
            <p>Cargando notificaciones...</p>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="empty-state">
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <div className="notificaciones-list">
            {notificaciones.map((notificacion) => (
              <div 
                key={notificacion.id} 
                className={`notificacion-item ${!notificacion.leida ? 'unread' : ''}`}
                onClick={() => handleNotificacionClick(notificacion)}
              >
                <div className="notificacion-content">
                  <p className="notificacion-text">{notificacion.contenido}</p>
                  <span className="notificacion-fecha">
                    {formatearFecha(notificacion.fechaCreacion)}
                  </span>
                </div>
                {!notificacion.leida && (
                  <button
                    className="btn-marcar-leida"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarcarComoLeida(notificacion.id);
                    }}
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="load-more">
            <button 
              className="btn btn-outline"
              onClick={cargarMas}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Cargar más'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificaciones; 