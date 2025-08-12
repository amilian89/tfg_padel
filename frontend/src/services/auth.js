import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener el token del localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Configuración de headers con token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Función para obtener headers de autorización
export const authHeader = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export function register(data) {
  return axios.post(`${API_URL}/auth/register`, data);
}

export function login(data) {
  return axios.post(`${API_URL}/auth/login`, data);
}

// Obtener perfil del usuario
export function getProfile() {
  return axios.get(`${API_URL}/perfil/usuarios/perfil`, getAuthHeaders());
}

// Actualizar perfil del usuario
export function updateProfile(data) {
  return axios.put(`${API_URL}/perfil/usuarios/perfil`, data, getAuthHeaders());
} 