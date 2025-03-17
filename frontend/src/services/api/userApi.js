import axios from 'axios';

// Configuration de base pour Axios
const api = axios.create({
  baseURL: '/api/users',
  withCredentials: true, // Nécessaire pour les cookies
  timeout: 10000 // Timeout de 10 secondes
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    // Gérer l'erreur 401 (non authentifié)
    if (error.response?.status === 401) {
      // Rediriger vers la page de login si nécessaire
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Fonction pour s'inscrire
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
  }
};

// Fonction pour se connecter
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error.response?.data || { message: 'Erreur lors de la connexion' };
  }
};

// Fonction pour vérifier l'authentification
export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth');
    return response.data;
  } catch (error) {
    console.error('Erreur de vérification d\'authentification:', error);
    throw error.response?.data || { message: 'Non authentifié' };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération du profil:', error);
    throw error.response?.data || { message: 'Erreur lors de la récupération du profil' };
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    throw error.response?.data || { message: 'Erreur lors de la déconnexion' };
  }
};
