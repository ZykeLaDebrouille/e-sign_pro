import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
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

// Intercepteur pour gérer les erreurs d'autorisation
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Session expirée - nettoyer le stockage local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Rediriger vers la page de connexion si on n'y est pas déjà
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
