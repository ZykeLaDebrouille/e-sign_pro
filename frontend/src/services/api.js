// src/services/api.js
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

// Intercepteur pour gérer les erreurs
API.interceptors.response.use(
  response => response,
  error => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response && error.response.status === 401) {
      // Sauf si on est déjà sur login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
