// frontend/src/components/SignaturePage.js
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { documentApi } from '../services/api/documentApi';
import { signatureApi } from '../services/api/signatureApi';
import Loader from './Loader';

const SignaturePage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const signatureRef = useRef();

  // Récupérer le document à signer
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await documentApi.getDocument(documentId);
        setDocument(response.data.data);
      } catch (err) {
        console.error('Erreur de récupération du document:', err);
        setError('Impossible de charger le document');
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  // Effacer la signature
  const clearSignature = () => {
    signatureRef.current.clear();
  };

  // Sauvegarder la signature
  const saveSignature = async () => {
    if (signatureRef.current.isEmpty()) {
      setError('Veuillez signer le document');
      return;
    }

    try {
      setLoading(true);
      // Convertir la signature en données URL
      const signatureData = signatureRef.current.toDataURL('image/png');
      
      // Envoyer la signature au serveur
      await signatureApi.signDocument(documentId, signatureData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/confirmation');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la signature:', err);
      setError('Impossible d\'enregistrer la signature');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (success) return <div className="success-message">Document signé avec succès !</div>;

  return (
    <div className="signature-page">
      <h2>Signer le document</h2>
      
      {document && (
        <div className="document-preview">
          <h3>{document.title}</h3>
          <p>Veuillez apposer votre signature ci-dessous :</p>
        </div>
      )}
      
      <div className="signature-container">
        <SignatureCanvas
          ref={signatureRef}
          penColor='black'
          canvasProps={{
            width: 500,
            height: 200,
            className: 'signature-canvas'
          }}
        />
      </div>
      
      <div className="signature-actions">
        <button onClick={clearSignature} className="clear-button">
          Effacer
        </button>
        <button onClick={saveSignature} className="save-button">
          Signer le document
        </button>
      </div>
    </div>
  );
};

export default SignaturePage;
