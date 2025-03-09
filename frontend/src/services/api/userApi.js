// frontend/src/services/api/userApi.js
import API from '../api';

export const userApi = {
  // Inscription d'un nouvel utilisateur
  register: (userData) => {
    return API.post('/users/register', userData);
  },
  
  // Connexion utilisateur
  login: (credentials) => {
    return API.post('/users/login', credentials);
  },
  
  // Déconnexion
  logout: () => {
    return API.post('/users/logout');
  },
  
  // Récupérer le profil utilisateur
  getProfile: () => {
    return API.get('/users/profile');
  },
  
  // Mettre à jour le profil
  updateProfile: (profileData) => {
    return API.put('/users/profile', profileData);
  },
  
  // Changer de mot de passe
  changePassword: (passwordData) => {
    return API.post('/users/change-password', passwordData);
  }
};

export default userApi;
