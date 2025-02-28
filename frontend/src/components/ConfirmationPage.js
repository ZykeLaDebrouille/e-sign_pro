import React from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const { fileName, signature } = location.state || {};

  return (
    <div className="confirmation-page" style={{ padding: '20px' }}>
      <h1>Signature confirmée !</h1>
      <p><strong>Document :</strong> {fileName}</p>
      {signature ? (
        <img src={signature} alt="Signature" style={{ width: '300px', border: '1px solid #000' }} />
      ) : (
        <p>Aucune signature disponible.</p>
      )}
      <p>
        <a href={`http://localhost:5000/documents/${fileName}`} target="_blank" rel="noopener noreferrer">
          Télécharger le document finalisé
        </a>
      </p>
    </div>
  );
};

export default ConfirmationPage;
