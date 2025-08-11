import React, { useEffect } from 'react';

const RoleThemeProvider = ({ children }) => {
  useEffect(() => {
    const applyTheme = () => {
      const rol = localStorage.getItem('rol');
      const body = document.body;
      
      // Remover clases de tema existentes
      body.classList.remove('theme-club', 'theme-demandante', 'theme-default');
      
      // Aplicar clase según el rol
      if (rol === 'club') {
        body.classList.add('theme-club');
      } else if (rol === 'demandante') {
        body.classList.add('theme-demandante');
      } else {
        // Si no hay rol o es otro valor, aplicar tema por defecto
        body.classList.add('theme-default');
      }
    };

    // Aplicar tema inicial
    applyTheme();

    // Crear un listener personalizado para cambios en localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'rol' || e.key === null) {
        applyTheme();
      }
    };

    // Escuchar cambios en localStorage (para cambios desde otras ventanas)
    window.addEventListener('storage', handleStorageChange);
    
    // Crear un observer para detectar cambios en localStorage desde la misma ventana
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'rol') {
        // Pequeño delay para asegurar que el valor se haya guardado
        setTimeout(applyTheme, 10);
      }
    };
    
    localStorage.removeItem = function(key) {
      originalRemoveItem.apply(this, arguments);
      if (key === 'rol') {
        // Pequeño delay para asegurar que el valor se haya eliminado
        setTimeout(applyTheme, 10);
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, []);

  return <>{children}</>;
};

export default RoleThemeProvider; 