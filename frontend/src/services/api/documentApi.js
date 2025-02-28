import api, { handleApiError } from './index';
import { v4 as uuidv4 } from 'uuid';

export const uploadDocument = async (file) => {
  if (!file) {
    throw new Error("Aucun fichier fourni");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', uuidv4());
  
  try {
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de l'upload du document");
  }
};

export const getDocument = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la récupération du document");
  }
};

export const generateEditableConvention = async () => {
  try {
    const response = await api.get('/documents/generate-editable-convention', {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la génération de la convention éditable");
  }
};

export const getUserDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la récupération des documents");
  }
};
