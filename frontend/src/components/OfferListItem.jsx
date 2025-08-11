import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeDate } from '../utils/date';
import './OfferListItem.css';

const OfferListItem = ({ 
  id, 
  titulo, 
  clubNombre, 
  ubicacion, 
  deporte, 
  salario, 
  fechaPublicacion, 
  descripcion 
}) => {
  const navigate = useNavigate();

  const handleVerMas = (e) => {
    e.stopPropagation();
    navigate(`/oferta/${id}`);
  };

  const handleItemClick = () => {
    navigate(`/oferta/${id}`);
  };

  const formatSalario = (salario) => {
    if (!salario || salario === null || salario === undefined) {
      return 'A convenir';
    }
    
    // Convertir a string si es número
    const salarioStr = String(salario);
    
    if (salarioStr.trim() === '') {
      return 'A convenir';
    }
    
    return `${salarioStr}€`;
  };

  return (
    <div className="offer-item" onClick={handleItemClick}>
      <div className="offer-content">
        <div className="offer-left">
          <h3 className="offer-title">{titulo}</h3>
          
          <div className="offer-meta">
            <span className="meta-item">
              <span className="meta-label">Club:</span>
              <span className="meta-value">{clubNombre || 'No especificado'}</span>
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">
              <span className="meta-label">Ubicación:</span>
              <span className="meta-value">{ubicacion || 'No especificada'}</span>
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">
              <span className="meta-label">Deporte:</span>
              <span className="meta-value">{deporte || 'No especificado'}</span>
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">
              <span className="meta-label">Salario:</span>
              <span className="meta-value">{formatSalario(salario)}</span>
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">
              <span className="meta-label">Publicado:</span>
              <span className="meta-value">{formatRelativeDate(fechaPublicacion)}</span>
            </span>
          </div>
          
          <div className="offer-desc">
            <span className="desc-label">Descripción:</span>
            <span className="desc-text">
              {descripcion || 'Sin descripción disponible'}
            </span>
          </div>
        </div>
        
        <div className="offer-cta">
          <button 
            className="btn btn-primary"
            onClick={handleVerMas}
            aria-label={`Ver detalles de la oferta: ${titulo}`}
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferListItem; 