import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Loader from './Loader';
import { uploadDocument, updateSignature } from '../services/api';

const ESignProPage = () => {
  const [step, setStep] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState('');
  const [fileName, setFileName] = useState('');
  const [signature, setSignature] = useState('');
  
  const signatureRef = useRef(null);

  const handleUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }
    setFile(uploadedFile);
    setIsLoading(true);
    try {
      const response = await uploadDocument(uploadedFile);
      setDocumentId(response.id);
      setFileName(uploadedFile.name);
      setStep('sign');
    } catch (error) {
      alert("Erreur lors de l'upload du document. Détails : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const sig = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      setIsLoading(true);
      try {
        await updateSignature({
          documentId,
          role: 'Étudiant',
          status: 'Terminé',
          signature: sig,
        });
        setSignature(sig);
        setStep('confirm');
      } catch (error) {
        alert("Erreur lors de la sauvegarde de la signature. Détails : " + error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Veuillez signer avant de confirmer.");
    }
  };

  return (
    <div className="container">
      <h1>E-Sign Pro</h1>
      
      {step === 'upload' && (
        <div className="page-section">
          <h2>Upload du document</h2>
          <input type="file" accept=".pdf" onChange={handleUpload} />
        </div>
      )}
      
      {step === 'sign' && (
        <div className="page-section">
          <h2>Signature</h2>
          <div style={{ border: '1px solid #ccc', marginBottom: '20px', padding: '10px', backgroundColor: '#fafafa' }}>
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
              backgroundColor="#fff"
              penColor="black"
            />
          </div>
          <button className="button button-danger" onClick={() => signatureRef.current.clear()}>
            Effacer
          </button>
          <button className="button button-primary" onClick={handleSign}>
            Confirmer la signature
          </button>
        </div>
      )}
      
      {step === 'confirm' && (
        <div className="page-section">
          <h2>Confirmation</h2>
          <p><strong>Document :</strong> {fileName}</p>
          {signature && <img src={signature} alt="Signature" style={{ width: '300px', border: '1px solid #000' }} />}
          <p>
            <a className="button button-primary" href={`http://localhost:5000/documents/${fileName}`} target="_blank" rel="noopener noreferrer">
              Télécharger le document finalisé
            </a>
          </p>
        </div>
      )}

      {isLoading && <Loader />}
    </div>
  );
};

export default ESignProPage;
