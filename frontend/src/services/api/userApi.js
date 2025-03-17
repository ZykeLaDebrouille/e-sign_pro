import axios from 'axios';

const api = axios.create({
  baseURL: '/api/users',
  withCredentials: true // Permet d'envoyer les cookies (accessToken et refreshToken)
});


export const register = async (data) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get('/check-auth');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};
