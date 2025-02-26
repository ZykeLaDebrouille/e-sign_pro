import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Si vous n'êtes pas dans Docker, utilisez localhost.
// Si votre application s'exécute dans un conteneur, utilisez http://host.docker.internal:5000
const API_BASE_URL = 'http://localhost:5000';

export const uploadDocument = async (file) => {
  if (!file) {
    throw new Error("Aucun fichier fourni");
  }
  
  const documentData = {
    id: uuidv4(), // Génère un ID unique
    fileName: file.name,
    status: "Uploaded"
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/documents`, documentData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error("Erreur lors de l'upload du document :", errorMsg);
    throw new Error(errorMsg);
  }
};

export const getSignatureProgress = async (documentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/signatures?documentId=${documentId}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error("Erreur lors de la récupération des signatures :", errorMsg);
    throw new Error(errorMsg);
  }
};

export const updateSignature = async (signatureData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signatures`, signatureData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response
      ? JSON.stringify(error.response.data)
      : error.message;
    console.error("Erreur lors de la mise à jour de la signature :", errorMsg);
    throw new Error(errorMsg);
  }
};
