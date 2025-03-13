import API from '../api';

const userApi = {
  register: (userData) => {
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
  },
  
  changePassword: (passwordData) => {
    return API.post('/users/change-password', passwordData);
  }
};

export default userApi;
