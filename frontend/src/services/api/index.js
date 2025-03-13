// frontend/src/services/api/index.js
import userApi from './userApi';
import conventionApi from './conventionApi';
import documentApi from './documentApi';
import signatureApi from './signatureApi';

// Fonction utilitaire pour gérer les erreurs API
export const handleApiError = (error, defaultMessage = "Une erreur s'est produite") => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  console.error('API Error:', error);
  return { error: true, message: errorMessage };
};

export {
  userApi,
  conventionApi,
  documentApi,
  signatureApi
};
