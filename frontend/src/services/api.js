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
    console.log('Ajout du token aux en-têtes');
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  console.error('Erreur intercepteur requête:', error);
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs
API.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API:', error.response || error);
    
    // Si erreur 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log('Session expirée ou non authentifiée');
      
      // Éviter une boucle de redirection si on est déjà sur login
      if (window.location.pathname !== '/login') {
        // Supprimer le token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Rediriger vers login
        window.location.href = '/login?expired=true';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
