import api, { handleApiError } from './index';

// Créer une nouvelle convention
export const createConvention = async (conventionData) => {
  try {
    const response = await api.post('/conventions/create', conventionData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la création de la convention");
  }
};

// Enregistrer un brouillon de convention (étape par étape)
export const saveConventionDraft = async (conventionData, step) => {
  try {
    const response = await api.post('/conventions/draft', { conventionData, step });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de l'enregistrement du brouillon");
  }
};

// Récupérer une convention par son ID
export const getConvention = async (conventionId) => {
  try {
    const response = await api.get(`/conventions/${conventionId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la récupération de la convention");
  }
};

// Soumettre une convention pour signature
export const submitConventionForSignature = async (conventionId) => {
  try {
    const response = await api.post(`/conventions/${conventionId}/submit`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la soumission de la convention");
  }
};

// Générer le PDF de la convention
export const generateConventionPDF = async (conventionId) => {
  try {
    const response = await api.get(`/conventions/${conventionId}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la génération du PDF");
  }
};

// Récupérer les conventions de l'utilisateur connecté
export const getUserConventions = async () => {
  try {
    const response = await api.get('/conventions/user');
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la récupération des conventions");
  }
};
