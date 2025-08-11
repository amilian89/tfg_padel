import { useCallback } from 'react';

export const useTheme = () => {
  const applyTheme = useCallback(() => {
    const rol = localStorage.getItem('rol');
    const body = document.body;
    
    // Remover clases de tema existentes
    body.classList.remove('theme-club', 'theme-demandante');
    
    // Aplicar clase según el rol
    if (rol === 'club') {
      body.classList.add('theme-club');
    } else if (rol === 'demandante') {
      body.classList.add('theme-demandante');
    }
    // Si no hay rol o es otro valor, se mantiene el tema por defecto (:root)
  }, []);

  return { applyTheme };
}; 