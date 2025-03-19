import API from '../api';

export const conventionApi = {
  getConvention: (id) => {
    return API.get(`/conventions/${id}`);
  },
  
  createConvention: (conventionData) => {
    return API.post('/conventions', conventionData);
  },
  
  updateConvention: (id, conventionData) => {
    return API.put(`/conventions/${id}`, conventionData);
  },
  
  deleteConvention: (id) => {
    return API.delete(`/conventions/${id}`);
  },
  
  generatePDF: (conventionData) => {
    return API.post('/conventions/generate-pdf', conventionData, {
      responseType: 'blob'
    });
  },
  
  getAllConventions: () => {
    return API.get('/conventions');
  }
};

export default conventionApi;
