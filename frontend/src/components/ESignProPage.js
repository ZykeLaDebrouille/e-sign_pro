// src/components/ESignProPage.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ESignProPage = () => {
  const { userRole } = useContext(AuthContext);
  const [pdfStatus, setPdfStatus] = useState('');

  // Fonction pour appeler l'API de génération du PDF dans le backend
  const handleGeneratePDF = async () => {
    try {
      // Remplacez l'URL par l'endpoint réel de votre backend
      const response = await axios.post('/api/generate-pdf', {
        // Vous pouvez envoyer des informations supplémentaires (ex : conventionId, userId, etc.)
        userRole: userRole,
      });
      setPdfStatus('PDF généré avec succès !');
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      setPdfStatus("Erreur lors de la génération du PDF.");
    }
  };

  return (
    <div
      className="esignpro-page"
      style={{
        padding: '2rem',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '8px',
        margin: '2rem auto',
        maxWidth: '900px',
      }}
    >
      <h1>ESign Pro - Signature Électronique</h1>
      <p>
        Bienvenue sur la page de signature électronique. Ici, vous pouvez consulter et signer vos documents.
      </p>

      {/* Vos autres fonctionnalités de signature, upload, etc. peuvent être ici */}

      {userRole === 'ELEVE' && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Générer le PDF final</h2>
          <p>
            En tant qu'élève, vous pouvez générer le document final contenant toutes les signatures.
          </p>
          <button
            onClick={handleGeneratePDF}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007aff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Générer le PDF
          </button>
          {pdfStatus && <p>{pdfStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default ESignProPage;
