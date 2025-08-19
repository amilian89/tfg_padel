import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleThemeProvider from "./context/RoleThemeProvider";
import "./styles/theme.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Panel from "./pages/Panel";
import OfertaDetalle from "./pages/OfertaDetalle";
import PublicarOferta from "./pages/PublicarOferta";
import SolicitudesRecibidas from "./pages/SolicitudesRecibidas";
import MisSolicitudes from "./pages/MisSolicitudes";
import MisOfertas from "./pages/MisOfertas";
import Notificaciones from "./pages/Notificaciones";

function App() {
  return (
    <RoleThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/oferta/:id" element={<OfertaDetalle />} />
          <Route path="/publicar" element={<PublicarOferta />} />
          <Route path="/solicitudes" element={<SolicitudesRecibidas />} />
          <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
          <Route path="/mis-ofertas" element={<MisOfertas />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
        </Routes>
      </Router>
    </RoleThemeProvider>
  );
}

export default App;
