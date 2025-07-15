import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import Header from "../components/Header";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (!email || !password) {
      setError("Por favor, completa ambos campos.");
      return;
    }
    try {
      const res = await login({ email, password });
      const { token, usuario } = res.data;
      localStorage.setItem("token", token);
      if (usuario) {
        localStorage.setItem("id", usuario.id);
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("rol", usuario.rol);
      }
      setMensaje("Inicio de sesión exitoso.");
      // Redirigir a la página principal
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al iniciar sesión. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="login-page">
      <Header />
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
              />
            </div>

            {/* Mensajes de estado */}
            {mensaje && <div className="success-message">{mensaje}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Botón de envío */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary submit-btn">
                Iniciar sesión
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