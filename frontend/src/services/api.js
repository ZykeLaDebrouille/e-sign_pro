// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important pour les cookies
});

// Intercepteur pour ajouter le token JWT
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs
API.interceptors.response.use(
  response => response,
  error => {
    // Log de l'erreur
    console.error('Erreur API:', error.response || error.message);
    
    // Gestion des erreurs d'authentification
    if (error.response && error.response.status === 401) {
      console.log('Session expirée ou non authentifiée');
      // Ne pas déconnecter tout de suite pour éviter des boucles
    }
    
    return Promise.reject(error);
  }
);

export default API;
