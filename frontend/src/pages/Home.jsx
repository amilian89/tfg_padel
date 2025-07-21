import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Header />
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Conecta clubes de pádel y tenis con entrenadores profesionales
            </h1>
            <p className="hero-subtitle">
              Publica ofertas o postúlate en segundos
            </p>
            <button 
              className="btn btn-primary hero-cta"
              onClick={() => navigate("/register")}
            >
              Empieza ahora
            </button>
          </div>
        </div>
      </section>

      {/* Qué es ProPista */}
      <section className="section bg-secondary">
        <div className="container">
          <h2 className="section-title">¿Qué es ProPista?</h2>
          <div className="what-is-content">
            <p className="section-subtitle">
              ProPista es la plataforma líder que conecta clubes deportivos con entrenadores 
              profesionales de pádel y tenis. Facilitamos el proceso de contratación y 
              búsqueda de empleo en el sector deportivo.
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎾</div>
                <h3>Especializado en Pádel y Tenis</h3>
                <p>Plataforma dedicada exclusivamente a estos deportes</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Proceso Rápido</h3>
                <p>Conecta en cuestión de minutos, no días</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Seguro y Confiable</h3>
                <p>Perfiles verificados y transacciones seguras</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">¿Cómo funciona?</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta como club o entrenador en menos de 2 minutos</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Publica / Aplica</h3>
              <p>Los clubes publican ofertas, los entrenadores se postulan</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Conecta</h3>
              <p>Encuentra tu match perfecto y comienza a trabajar juntos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Para clubes / Para entrenadores */}
      <section className="section bg-secondary">
        <div className="container">
          <h2 className="section-title">¿Eres club o entrenador?</h2>
          <div className="roles-grid">
            <div className="role-card">
              <h3>Para Clubes</h3>
              <ul className="benefits-list">
                <li>Publica ofertas de trabajo fácilmente</li>
                <li>Recibe candidatos cualificados</li>
                <li>Filtra por experiencia y ubicación</li>
                <li>Gestiona entrevistas y contrataciones</li>
                <li>Acceso a base de datos de entrenadores</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Registrarse como Club
              </button>
            </div>
            <div className="role-card">
              <h3>Para Entrenadores</h3>
              <ul className="benefits-list">
                <li>Encuentra ofertas de trabajo</li>
                <li>Crea tu perfil profesional</li>
                <li>Recibe notificaciones de nuevas ofertas</li>
                <li>Conecta directamente con clubes</li>
                <li>Gestiona tu carrera deportiva</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Registrarse como Entrenador
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section bg-primary">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">¿Listo para empezar?</h2>
            <p className="cta-subtitle">
              Únete a cientos de clubes y entrenadores que ya confían en ProPista
            </p>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate("/register")}
            >
              Regístrate gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-logo">ProPista</h3>
              <p>Conectando el mundo del pádel y tenis</p>
            </div>
            <div className="footer-section">
              <h4>Enlaces</h4>
              <ul className="footer-links">
                <li><a href="/">Inicio</a></li>
                <li><a href="/register">Registro</a></li>
                <li><a href="/login">Iniciar sesión</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Términos y condiciones</a></li>
                <li><a href="#">Política de privacidad</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contacto</h4>
              <ul className="footer-links">
                <li><a href="mailto:info@propista.com">info@propista.com</a></li>
                <li><a href="#">Soporte</a></li>
                <li><a href="#">Sobre nosotros</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ProPista. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 