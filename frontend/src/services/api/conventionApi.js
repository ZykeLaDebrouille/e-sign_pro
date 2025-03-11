// frontend/src/services/api/conventionApi.js
import API from '../api';

export const conventionApi = {
  // Récupérer une convention par son ID
  getConvention: (id) => {
    return API.get(`/conventions/${id}`);
  },
  
  // Créer une nouvelle convention
  createConvention: (conventionData) => {
    return API.post('/conventions', conventionData);
  },
  
  // Mettre à jour une convention existante
  updateConvention: (id, conventionData) => {
    return API.put(`/conventions/${id}`, conventionData);
  },
  
  // Supprimer une convention
  deleteConvention: (id) => {
    return API.delete(`/conventions/${id}`);
  },
  
  // Générer le PDF d'une convention
  generatePDF: (conventionData) => {
    return API.post('/conventions/generate-pdf', conventionData, {
      responseType: 'blob' // Important pour recevoir des données binaires
    });
  },
  
  // Récupérer toutes les conventions
  getAllConventions: () => {
    return API.get('/conventions');
  }
};

export default conventionApi;
