// src/components/ESignProPage.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ESignProPage = () => {
  const { userRole } = useContext(AuthContext);
  const sigCanvas = useRef(null);

  // Workflow : 0 = Upload PDF, 1 = Signature Élève, 5 = Génération du PDF final
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [signatureMessage, setSignatureMessage] = useState('');
  const [pdfMessage, setPdfMessage] = useState('');
  const [notification, setNotification] = useState('');
  const [signatureData, setSignatureData] = useState('');

  useEffect(() => {
    // Initialisation du workflow par l'upload
    setCurrentStep(0);
  }, []);

  // Gestion de l'upload du PDF
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 1); // Remplacer par l'ID réel
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMessage("Fichier uploadé avec succès.");
      setNotification("La convention a été uploadée. Passez à la signature.");
      setCurrentStep(1); // Passer à la signature de l'élève
    } catch (error) {
      setUploadMessage("Erreur lors de l'upload du fichier.");
    }
  };

  // Gestion de la sauvegarde de la signature (pour l'étape Élève)
  const handleSaveSignature = async () => {
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      alert("Veuillez apposer votre signature avant de sauvegarder.");
      return;
    }
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setSignatureData(dataUrl);
    try {
      await axios.post('/api/sign', {
        conventionId: 1, // Exemple, à remplacer par l'ID réel
        signature: dataUrl,
        role: 'ELEVE',
      });
      setSignatureMessage("Signature enregistrée avec succès.");
      setNotification("Signature enregistrée. Vous pouvez maintenant générer le PDF final.");
      setCurrentStep(5);
    } catch (error) {
      setSignatureMessage("Erreur lors de l'enregistrement de la signature.");
    }
  };

  // Gestion de la génération du PDF final
  const handleGeneratePDF = async () => {
    try {
      await axios.post('/api/generate-pdf', { conventionId: 1 });
      setPdfMessage("PDF généré avec succès et archivé.");
      setNotification("Processus terminé. Vérifiez vos emails pour le document final.");
    } catch (error) {
      setPdfMessage("Erreur lors de la génération du PDF.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>ESign Pro - Signature Électronique</h1>
      <p>Bienvenue sur la plateforme de signature électronique.</p>

      {/* Étape 0 : Upload du PDF */}
      {currentStep === 0 && (
        <section style={styles.section}>
          <h2>Étape 1 : Upload de la Convention (PDF)</h2>
          <input type="file" accept="application/pdf" onChange={handleUpload} />
          <p>{uploadMessage}</p>
        </section>
      )}

      {/* Étape 1 : Signature de l'Élève */}
      {currentStep === 1 && (
        <section style={styles.section}>
          <h2>Étape 2 : Signature de l'Élève</h2>
          <p>Veuillez apposer votre signature dans l'espace ci-dessous :</p>
          <div style={styles.signatureContainer}>
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            />
          </div>
          <button onClick={handleSaveSignature} style={styles.btn}>
            Sauvegarder la signature
          </button>
          <p>{signatureMessage}</p>
        </section>
      )}

      {/* Étape 5 : Génération du PDF final */}
      {currentStep === 5 && (
        <section style={styles.section}>
          <h2>Étape 3 : Génération du Document Final</h2>
          <button onClick={handleGeneratePDF} style={styles.btn}>
            Générer le PDF final
          </button>
          <p>{pdfMessage}</p>
        </section>
      )}

      {/* Affichage des notifications */}
      {notification && (
        <div style={styles.notification}>
          <p>{notification}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '8px',
    margin: '2rem auto',
    maxWidth: '900px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '2rem',
  },
  signatureContainer: {
    border: '2px solid #000',
    margin: '1rem auto',
    width: 'fit-content',
  },
  btn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007aff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  notification: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    border: '1px solid #c3e6cb',
  },
};

export default ESignProPage;
