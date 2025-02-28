import api, { handleApiError } from './index';

export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de l'inscription");
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la connexion");
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la récupération du profil");
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la mise à jour du profil");
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors du changement de mot de passe");
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/users/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return handleApiError(error, "Erreur lors de la déconnexion");
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/users/refresh-token');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors du rafraîchissement du token");
  }
};
