import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import OfferListItem from "../components/OfferListItem";
import { getMisOfertas, deleteOferta } from "../services/ofertas";
import { useToast } from "../hooks/useToast";
import "./MisOfertas.css";

const MisOfertas = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [deletingOfertas, setDeletingOfertas] = useState(new Set());
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMisOfertas = useCallback(async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOfertas([]);
        setCurrentPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getMisOfertas({ page, pageSize });
      const { items, total: totalItems, hasMore: moreAvailable } = response;

      if (reset) {
        setOfertas(items);
      } else {
        setOfertas(prev => [...prev, ...items]);
      }

      setTotal(totalItems);
      setHasMore(moreAvailable);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error("Error al cargar mis ofertas:", err);
      setError("Error al cargar tus ofertas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [pageSize]);

  useEffect(() => {
    // Verificar autenticación y rol
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("rol");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (userRole !== "club") {
      navigate("/");
      return;
    }

    // Cargar primera página de ofertas
    loadMisOfertas(1, true);
  }, [navigate, loadMisOfertas]);

  const handleCargarMas = () => {
    if (!loadingMore && hasMore) {
      loadMisOfertas(currentPage + 1, false);
    }
  };

  const handleEliminarOferta = async (ofertaId) => {
    // Guardar la oferta original antes de eliminarla (para poder restaurarla si hay error)
    const ofertaOriginal = ofertas.find(o => o.id === ofertaId);

    try {
      setDeletingOfertas(prev => new Set(prev).add(ofertaId));
      
      // Optimistic update: quitar el item de la lista local
      setOfertas(prev => prev.filter(o => o.id !== ofertaId));

      await deleteOferta(ofertaId);
      
      showToast("Oferta eliminada correctamente", "success");
      
      // Actualizar el total
      setTotal(prev => prev - 1);
      
    } catch (err) {
      console.error("Error al eliminar oferta:", err);
      
      // Restaurar el item si hubo error
      if (ofertaOriginal) {
        setOfertas(prev => [...prev, ofertaOriginal].sort((a, b) => 
          new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
        ));
      }
      
      showToast(
        err.message || "Error al eliminar la oferta. Por favor, intenta de nuevo.",
        "error"
      );
    } finally {
      setDeletingOfertas(prev => {
        const newSet = new Set(prev);
        newSet.delete(ofertaId);
        return newSet;
      });
    }
  };

  const handlePublicarOferta = () => {
    navigate("/publicar");
  };

  if (loading) {
    return (
      <div className="mis-ofertas">
        <Header />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando tus ofertas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-ofertas">
      <Header />
      
      <div className="container">
        <div className="mis-ofertas-header">
          <h1 className="mis-ofertas-title">Mis Ofertas</h1>
          <button 
            className="btn btn-primary btn-publicar"
            onClick={handlePublicarOferta}
          >
            Publicar nueva oferta
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="btn btn-secondary"
              onClick={() => loadMisOfertas(1, true)}
            >
              Reintentar
            </button>
          </div>
        )}

        {!error && ofertas.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tienes ofertas publicadas</h3>
            <p>Comienza publicando tu primera oferta para encontrar el candidato perfecto.</p>
            <button 
              className="btn btn-primary"
              onClick={handlePublicarOferta}
            >
              Publicar mi primera oferta
            </button>
          </div>
        )}

        {!error && ofertas.length > 0 && (
          <>
            <div className="ofertas-list">
              {ofertas.map((oferta) => (
                <OfferListItem
                  key={oferta.id}
                  id={oferta.id}
                  titulo={oferta.titulo || 'Sin título'}
                  clubNombre={oferta.club?.nombreClub}
                  ubicacion={oferta.ubicacion}
                  deporte={oferta.tipoDeporte}
                  salario={oferta.salario}
                  fechaPublicacion={oferta.fechaPublicacion}
                  descripcion={oferta.descripcion}
                  showDeleteButton={true}
                  onDelete={handleEliminarOferta}
                  isDeleting={deletingOfertas.has(oferta.id)}
                />
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
                    'Cargar más ofertas'
                  )}
                </button>
              </div>
            )}

            {/* Mensaje de fin de lista */}
            {!hasMore && ofertas.length > 0 && (
              <div className="end-of-list">
                <p>No hay más ofertas</p>
                <span className="total-info">Mostrando {ofertas.length} de {total} ofertas</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MisOfertas;
