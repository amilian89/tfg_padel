import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useNotificaciones } from "../hooks/useNotificaciones";
import "./MisSolicitudes.css";

const MisSolicitudes = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  // const [userData, setUserData] = useState(null); // Comentado porque no se usa
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Hook de notificaciones
  const usuarioId = localStorage.getItem("id");
  const { contadorNoLeidas } = useNotificaciones(usuarioId);

  useEffect(() => {
    // Verificar autenticación y rol
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("rol");
    const userId = localStorage.getItem("id");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userRole !== "demandante") {
      navigate("/");
      return;
    }

    // setUserData({
    //   role: userRole,
    //   id: userId
    // }); // Comentado porque no se usa

    // Cargar primera página de solicitudes
    loadSolicitudes(1, true);
  }, [navigate]);

  // Refetch cuando llegue una nueva notificación
  useEffect(() => {
    if (contadorNoLeidas > 0) {
      loadSolicitudes(1, true);
    }
  }, [contadorNoLeidas]);

  const loadSolicitudes = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setSolicitudes([]);
        setCurrentPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/solicitudes`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          rol: 'demandante',
          page: page,
          pageSize: pageSize
        }
      });

      const { items, total: totalItems, hasMore: moreAvailable } = response.data;

      if (reset) {
        setSolicitudes(items);
      } else {
        setSolicitudes(prev => [...prev, ...items]);
      }

      setTotal(totalItems);
      setHasMore(moreAvailable);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      if (err.response?.status === 403) {
        setError("No tienes permisos para ver estas solicitudes");
      } else {
        setError("Error al cargar las solicitudes. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCargarMas = () => {
    if (!loadingMore && hasMore) {
      loadSolicitudes(currentPage + 1, false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'pendiente': { texto: 'Pendiente', clase: 'estado-pendiente', icono: '⏳' },
      'aceptada': { texto: 'Aceptada', clase: 'estado-aceptada', icono: '✅' },
      'rechazada': { texto: 'Rechazada', clase: 'estado-rechazada', icono: '❌' }
    };

    const estadoInfo = estados[estado] || { texto: estado, clase: 'estado-desconocido', icono: '❓' };

    return (
      <span className={`estado-badge ${estadoInfo.clase}`}>
        {estadoInfo.icono} {estadoInfo.texto}
      </span>
    );
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': '#ffc107',
      'aceptada': '#28a745',
      'rechazada': '#dc3545'
    };
    return colores[estado] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="mis-solicitudes">
        <Header />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando tus solicitudes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-solicitudes">
        <Header />
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/panel")}
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-solicitudes">
      <Header />
      
      <div className="container">
        <div className="solicitudes-header">
          <button 
            className="btn btn-outline btn-volver"
            onClick={() => navigate("/panel")}
          >
            ← Volver al Panel
          </button>
          <h1 className="solicitudes-titulo">Mis Solicitudes</h1>
        </div>

        {solicitudes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Aún no has aplicado a ninguna oferta</h3>
            <p>Cuando apliques a ofertas, aparecerán aquí con su estado actual.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/panel")}
            >
              Ver ofertas disponibles
            </button>
          </div>
        ) : (
          <div className="solicitudes-content">
            <div className="solicitudes-stats">
              <div className="stat-item">
                <span className="stat-number">{total}</span>
                <span className="stat-label">Total solicitudes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {solicitudes.filter(s => s.estado === 'pendiente').length}
                </span>
                <span className="stat-label">Pendientes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {solicitudes.filter(s => s.estado === 'aceptada').length}
                </span>
                <span className="stat-label">Aceptadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {solicitudes.filter(s => s.estado === 'rechazada').length}
                </span>
                <span className="stat-label">Rechazadas</span>
              </div>
            </div>

            <div className="solicitudes-list">
              {solicitudes.map((solicitud) => (
                <div 
                  key={solicitud.id} 
                  className="solicitud-card"
                  style={{ borderLeftColor: getEstadoColor(solicitud.estado) }}
                >
                  <div className="solicitud-header">
                    <div className="oferta-info">
                      <h3 className="oferta-titulo">{solicitud.oferta.titulo}</h3>
                      <div className="oferta-details">
                        <span className="oferta-deporte">{solicitud.oferta.tipoDeporte}</span>
                        <span className="oferta-ubicacion">📍 {solicitud.oferta.ubicacion}</span>
                        <span className="oferta-salario">💰 {solicitud.oferta.salario}€</span>
                      </div>
                      {solicitud.oferta.club?.nombreClub && (
                        <p className="club-nombre">
                          🏟️ {solicitud.oferta.club.nombreClub}
                          {solicitud.oferta.club.ciudad && ` - ${solicitud.oferta.club.ciudad}`}
                        </p>
                      )}
                    </div>
                    <div className="solicitud-estado">
                      {getEstadoBadge(solicitud.estado)}
                    </div>
                  </div>

                  <div className="solicitud-content">
                    {solicitud.mensajeSolicitud && (
                      <div className="solicitud-mensaje">
                        <h4>Tu mensaje:</h4>
                        <p>{solicitud.mensajeSolicitud}</p>
                      </div>
                    )}

                    {solicitud.mensajeRespuesta && (
                      <div className="respuesta-club">
                        <h4>Respuesta del club:</h4>
                        <p>{solicitud.mensajeRespuesta}</p>
                        <small>
                          📅 Respondida el {formatearFecha(solicitud.fechaRespuesta)}
                        </small>
                      </div>
                    )}

                    <div className="solicitud-fecha">
                      <small>
                        📅 Solicitud enviada el {formatearFecha(solicitud.fechaSolicitud)}
                      </small>
                    </div>
                  </div>

                  {solicitud.estado === 'aceptada' && (
                    <div className="solicitud-acciones">
                      <button 
                        className="btn btn-success"
                        onClick={() => navigate(`/oferta/${solicitud.ofertaId}`)}
                      >
                        Ver oferta
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Botón "Cargar más" */}
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="btn btn-secondary btn-load-more"
                  onClick={handleCargarMas}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Cargando...
                    </>
                  ) : (
                    'Cargar más solicitudes'
                  )}
                </button>
              </div>
            )}

            {/* Mensaje de fin de lista */}
            {!hasMore && solicitudes.length > 0 && (
              <div className="end-of-list">
                <p>No hay más solicitudes</p>
                <span className="total-info">Mostrando {solicitudes.length} de {total} solicitudes</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisSolicitudes; 