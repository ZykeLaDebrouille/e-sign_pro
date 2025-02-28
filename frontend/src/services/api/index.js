import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Pour gérer les cookies d'authentification
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401 (non autorisé)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/users/refresh-token`, {}, 
          { withCredentials: true });
        localStorage.setItem('token', refreshResponse.data.token);
        error.config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
        error.config._retry = true;
        return api(error.config);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error, defaultMessage) => {
  const errorMsg = error.response?.data?.message || error.message;
  console.error(`${defaultMessage}: ${errorMsg}`);
  return { error: errorMsg };
};

// Ajouter cette fonction à la fin du fichier

export const debugRequest = async (url, method = 'GET', data = null) => {
  console.log(`Envoi de requête ${method} à ${url}`);
  console.log('Données:', data);
  
  try {
    const config = {
      method,
      url,
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined
    };
    
    const response = await api.request(config);
    console.log('Réponse:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur:', error.response || error.message);
    return { error: error.response?.data || error.message };
  }
};

export default api;