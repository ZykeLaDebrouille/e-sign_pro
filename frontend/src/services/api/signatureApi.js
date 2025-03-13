// frontend/src/services/api/signatureApi.js
import API from '../api';

const signatureApi = {
  getSignatureProgress: (documentId) => {
    return API.get(`/signatures?documentId=${documentId}`);
  },

  signDocument: (signatureData) => {
    return API.post('/signatures', signatureData);
  },

  validateSignature: (validationToken) => {
    return API.post(`/signatures/validate/${validationToken}`);
  },

  getSignatureRequestStatus: (requestId) => {
    return API.get(`/signatures/request/${requestId}`);
  },

  sendSignatureRequest: (documentId, recipients) => {
    return API.post('/signatures/request', { documentId, recipients });
  }
};

export default signatureApi;
