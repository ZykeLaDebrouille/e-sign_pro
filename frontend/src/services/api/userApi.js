import axios from 'axios';

const api = axios.create({
  baseURL: '/api/users',
  withCredentials: true,
});

export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth');
    return response.data;
  } catch (error) {
    console.error('Erreur checkAuth:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Erreur register:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error('Erreur logout:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Erreur getProfile:', error);
    throw error;
  }
};
