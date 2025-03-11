import api, { handleApiError } from './index';

export const getSignatureProgress = async (documentId) => {
  try {
    const response = await api.get(`/signatures?documentId=${documentId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la récupération des signatures");
  }
};

export const signDocument = async (signatureData) => {
  try {
    const response = await api.post('/signatures', signatureData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la signature du document");
  }
};

export const validateSignature = async (validationToken) => {
  try {
    const response = await api.post(`/signatures/validate/${validationToken}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la validation de la signature");
  }
};

export const getSignatureRequestStatus = async (requestId) => {
  try {
    const response = await api.get(`/signatures/request/${requestId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de la récupération du statut de la demande");
  }
};

export const sendSignatureRequest = async (documentId, recipients) => {
  try {
    const response = await api.post('/signatures/request', { documentId, recipients });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Erreur lors de l'envoi de la demande de signature");
  }
};
