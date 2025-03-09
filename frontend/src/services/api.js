// frontend/src/services/api.js
import axios from 'axios';

// Instance Axios configurée pour ton projet
const API = axios.create({
  baseURL: '/api', // Chemin relatif qui sera géré par le proxy Nginx
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion globale des erreurs
API.interceptors.response.use(
  response => response,
  error => {
    // Gérer les erreurs 401 (non authentifié)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
