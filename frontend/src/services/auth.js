import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export function register(data) {
  return axios.post(`${API_URL}/auth/register`, data);
}

export function login(data) {
  return axios.post(`${API_URL}/auth/login`, data);
} 