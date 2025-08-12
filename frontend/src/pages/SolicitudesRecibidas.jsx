import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { useNotificaciones } from "../hooks/useNotificaciones";
import "./SolicitudesRecibidas.css";

const SolicitudesRecibidas = () => {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  // const [userData, setUserData] = useState(null); // Comentado porque no se usa
  const [procesandoSolicitudes, setProcesandoSolicitudes] = useState(new Set());
  
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

    if (userRole !== "club") {
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
          rol: 'club',
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

  const agruparSolicitudesPorOferta = (solicitudes) => {
    const grupos = new Map();

    solicitudes.forEach(solicitud => {
      const ofertaId = solicitud.oferta.id;
      // const ofertaTitulo = solicitud.oferta.titulo; // Comentado porque no se usa

      if (!grupos.has(ofertaId)) {
        grupos.set(ofertaId, {
          oferta: solicitud.oferta,
          solicitudes: []
        });
      }

      grupos.get(ofertaId).solicitudes.push(solicitud);
    });

    return Array.from(grupos.values());
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'pendiente': { texto: 'Pendiente ⏳', clase: 'estado-pendiente' },
      'aceptada': { texto: 'Aceptada ✅', clase: 'estado-aceptada' },
      'rechazada': { texto: 'Rechazada ❌', clase: 'estado-rechazada' }
    };

    const estadoInfo = estados[estado] || { texto: estado, clase: 'estado-desconocido' };

    return (
      <span className={`estado-badge ${estadoInfo.clase}`}>
        {estadoInfo.texto}
      </span>
    );
  };

  const handleResponderSolicitud = async (solicitudId, estado) => {
    try {
      // Agregar la solicitud al conjunto de solicitudes en proceso
      setProcesandoSolicitudes(prev => new Set(prev).add(solicitudId));

      const token = localStorage.getItem("token");
      
      // Hacer la petición PUT al backend
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/solicitudes/${solicitudId}/responder`,
        {
          estado: estado
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Actualizar el estado local con la solicitud actualizada
      setSolicitudes(prevSolicitudes => 
        prevSolicitudes.map(solicitud => 
          solicitud.id === solicitudId 
            ? { ...solicitud, ...response.data }
            : solicitud
        )
      );

      // Mostrar mensaje de éxito
      const mensaje = estado === 'aceptada' 
        ? 'Solicitud aceptada exitosamente' 
        : 'Solicitud rechazada exitosamente';
      
      showSuccess(mensaje);

    } catch (err) {
      console.error(`Error al ${estado === 'aceptada' ? 'aceptar' : 'rechazar'} solicitud:`, err);
      
      let mensajeError = "Error al procesar la solicitud. Por favor, intenta de nuevo.";
      
      if (err.response?.status === 404) {
        mensajeError = "Solicitud no encontrada";
      } else if (err.response?.status === 400) {
        mensajeError = err.response.data.error || "Datos inválidos";
      } else if (err.response?.status === 403) {
        mensajeError = "No tienes permisos para realizar esta acción";
      }
      
      showError(mensajeError);
    } finally {
      // Remover la solicitud del conjunto de solicitudes en proceso
      setProcesandoSolicitudes(prev => {
        const newSet = new Set(prev);
        newSet.delete(solicitudId);
        return newSet;
      });
    }
  };

  const isProcesando = (solicitudId) => {
    return procesandoSolicitudes.has(solicitudId);
  };

  if (loading) {
    return (
      <div className="solicitudes-recibidas">
        <Header />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando solicitudes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="solicitudes-recibidas">
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

  const solicitudesAgrupadas = agruparSolicitudesPorOferta(solicitudes);

  return (
    <div className="solicitudes-recibidas">
      <Header />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <div className="container">
        <div className="solicitudes-header">
          <button 
            className="btn btn-outline btn-volver"
            onClick={() => navigate("/panel")}
          >
            ← Volver al Panel
          </button>
          <h1 className="solicitudes-titulo">Solicitudes Recibidas</h1>
        </div>

        {solicitudes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Aún no has recibido ninguna solicitud</h3>
            <p>Cuando los demandantes apliquen a tus ofertas, aparecerán aquí.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/publicar")}
            >
              Publicar nueva oferta
            </button>
          </div>
        ) : (
          <div className="solicitudes-content">
            {solicitudesAgrupadas.map((grupo, index) => (
              <div key={index} className="oferta-solicitudes">
                <div className="oferta-header">
                  <h2 className="oferta-titulo">{grupo.oferta.titulo}</h2>
                  <div className="oferta-info-horizontal">
                    <span className="oferta-deporte">{grupo.oferta.tipoDeporte}</span>
                    <span className="oferta-ubicacion">📍 {grupo.oferta.ubicacion}</span>
                    <span className="oferta-salario">💰 {grupo.oferta.salario}€</span>
                  </div>
                  <p className="solicitudes-count">
                    {grupo.solicitudes.length} solicitud{grupo.solicitudes.length !== 1 ? 'es' : ''}
                  </p>
                </div>

                <div className="solicitudes-list">
                  {grupo.solicitudes.map((solicitud) => (
                    <div key={solicitud.id} className="solicitud-card">
                      <div className="solicitud-header">
                        <div className="demandante-info">
                          <h4 className="demandante-nombre">
                            {solicitud.demandante.usuario.nombre} {solicitud.demandante.usuario.apellidos}
                          </h4>
                          <p className="demandante-email">
                            📧 {solicitud.demandante.usuario.email}
                          </p>
                          {solicitud.demandante.usuario.telefono && (
                            <p className="demandante-telefono">
                              📞 {solicitud.demandante.usuario.telefono}
                            </p>
                          )}
                        </div>
                        <div className="solicitud-estado">
                          {getEstadoBadge(solicitud.estado)}
                        </div>
                      </div>

                      {solicitud.mensajeSolicitud && (
                        <div className="solicitud-mensaje">
                          <h5>Mensaje del candidato:</h5>
                          <p>{solicitud.mensajeSolicitud}</p>
                        </div>
                      )}

                      {solicitud.demandante.experiencia && (
                        <div className="demandante-experiencia">
                          <h5>Experiencia:</h5>
                          <p>{solicitud.demandante.experiencia}</p>
                        </div>
                      )}

                      {solicitud.demandante.formacion && (
                        <div className="demandante-formacion">
                          <h5>Formación:</h5>
                          <p>{solicitud.demandante.formacion}</p>
                        </div>
                      )}

                      <div className="solicitud-fecha">
                        <small>
                          📅 Solicitud enviada el {formatearFecha(solicitud.fechaSolicitud)}
                        </small>
                      </div>

                      {solicitud.estado === 'pendiente' && (
                        <div className="solicitud-acciones">
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleResponderSolicitud(solicitud.id, 'aceptada')}
                            disabled={isProcesando(solicitud.id)}
                          >
                            {isProcesando(solicitud.id) ? '⏳ Procesando...' : '✅ Aceptar'}
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleResponderSolicitud(solicitud.id, 'rechazada')}
                            disabled={isProcesando(solicitud.id)}
                          >
                            {isProcesando(solicitud.id) ? '⏳ Procesando...' : '❌ Rechazar'}
                          </button>
                        </div>
                      )}

                      {solicitud.estado !== 'pendiente' && (
                        <div className="solicitud-resultado">
                          <div className="resultado-info">
                            <strong>Estado final:</strong> {getEstadoBadge(solicitud.estado)}
                            {solicitud.fechaRespuesta && (
                              <small className="fecha-respuesta">
                                📅 Respondida el {formatearFecha(solicitud.fechaRespuesta)}
                              </small>
                            )}
                          </div>
                        </div>
                      )}

                      {solicitud.estado !== 'pendiente' && solicitud.mensajeRespuesta && (
                        <div className="respuesta-club">
                          <h5>Tu respuesta:</h5>
                          <p>{solicitud.mensajeRespuesta}</p>
                          <small>
                            📅 Respondida el {formatearFecha(solicitud.fechaRespuesta)}
                          </small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

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

export default SolicitudesRecibidas; 