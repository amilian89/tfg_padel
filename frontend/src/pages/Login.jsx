import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import Header from "../components/Header";
import Toast from "../components/Toast";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/useToast";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { applyTheme } = useTheme();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError("Por favor, completa ambos campos.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await login({ email, password });
      const { token, usuario } = res.data;
      localStorage.setItem("token", token);
      if (usuario) {
        localStorage.setItem("id", usuario.id);
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("rol", usuario.rol);
      }
      
      // Forzar la actualización del tema inmediatamente
      applyTheme();
      
      // Mostrar toast de éxito y redirigir
      showSuccess("Sesión iniciada correctamente");
      setTimeout(() => {
        navigate("/panel");
      }, 1500);
    } catch (err) {
      showError(
        err.response?.data?.error || "Error al iniciar sesión. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <div className="login-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h1 className="form-title">Iniciar sesión</h1>
            <p className="form-subtitle">
              Accede a tu cuenta de ProPista
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Tu contraseña"
                required
                disabled={loading}
              />
            </div>

            {/* Botón de envío */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>

            {/* Enlaces adicionales */}
            <div className="form-footer">
              <p className="form-footer-text">
                ¿No tienes cuenta?{" "}
                <button 
                  type="button" 
                  className="link-button"
                  onClick={() => navigate("/register")}
                  disabled={loading}
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 