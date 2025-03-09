// frontend/src/services/api/userApi.js
import API from '../api';

export const userApi = {
  register: (userData) => {
    console.log('Envoi des données d\'inscription:', userData);
    return API.post('/users/register', userData);
  },
  
  login: (credentials) => {
    return API.post('/users/login', credentials);
  },
  
  logout: () => {
    return API.post('/users/logout');
  },
  
  getProfile: () => {
    return API.get('/users/profile');
  },
  
  updateProfile: (profileData) => {
    return API.put('/users/profile', profileData);
  },
  
  checkAuth: () => {
    return API.get('/users/check-auth');
  }
};

export default userApi;
