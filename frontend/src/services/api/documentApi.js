// frontend/src/services/api/documentApi.js
import API from '../api';

export const documentApi = {
  // Récupérer un document par son ID
  getDocument: (id) => {
    return API.get(`/documents/${id}`);
  },
  
  // Créer un nouveau document
  createDocument: (documentData) => {
    return API.post('/documents', documentData);
  },
  
  // Mettre à jour un document
  updateDocument: (id, documentData) => {
    return API.put(`/documents/${id}`, documentData);
  },
  
  // Mettre à jour les informations d'un étudiant dans un document
  updateStudentInfo: (id, studentInfo) => {
    return API.put(`/documents/${id}/student-info`, studentInfo);
  },
  
  // Récupérer tous les documents
  getAllDocuments: () => {
    return API.get('/documents');
  }
};

export default documentApi;
