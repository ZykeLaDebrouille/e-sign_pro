// src/components/EnhancedESignProPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

const EnhancedESignProPage = () => {
  // État de la progression du workflow (0: Upload, 1: Authentification, 2: Signature, 3: Finalisation, 4: Terminé)
  const [currentStep, setCurrentStep] = useState(0);

  // Upload du PDF
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // Authentification OTP
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Capture de signature
  const [signatureMethod, setSignatureMethod] = useState('draw'); // 'draw', 'type', 'upload'
  const sigCanvas = useRef(null);
  const [typedSignature, setTypedSignature] = useState('');
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [signatureData, setSignatureData] = useState('');
  const [signatureMessage, setSignatureMessage] = useState('');
  const [hashValue, setHashValue] = useState('');

  // Finalisation (PDF)
  const [pdfMessage, setPdfMessage] = useState('');

  // Simuler la génération d'un OTP lors du passage à l'étape d'authentification
  useEffect(() => {
    if (currentStep === 1) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);
      // Simuler l'envoi de l'OTP (par ex. via email)
      console.log("OTP généré:", otpCode);
      setAuthMessage("Un code OTP a été envoyé à votre e-mail.");
    }
  }, [currentStep]);

  // Fonction pour générer un hash SHA-256 de la signature (via SubtleCrypto)
  const hashSignature = async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Gestion de l'upload du PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setUploadMessage(`Fichier sélectionné : ${file.name}`);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', 1); // Exemple
        // Appel API simulé pour l'upload
        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUploadMessage("Fichier uploadé avec succès.");
        setCurrentStep(1); // Passe à l'étape d'authentification
      } catch (err) {
        setUploadMessage("Erreur lors de l'upload du fichier.");
      }
    } else {
      alert("Veuillez sélectionner un fichier PDF.");
    }
  };

  // Vérification OTP
  const handleOtpVerification = () => {
    if (otpInput === generatedOtp) {
      setIsAuthenticated(true);
      setAuthMessage("OTP vérifié avec succès.");
      setCurrentStep(2); // Passe à la capture de signature
    } else {
      setAuthMessage("OTP invalide. Veuillez réessayer.");
    }
  };

  // Gestion de la signature
  const handleClearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignatureData('');
      setSignatureMessage('');
    }
  };

  const handleSaveSignature = async () => {
    let dataUrl = '';
    if (signatureMethod === 'draw') {
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      } else {
        alert("Veuillez dessiner votre signature.");
        return;
      }
    } else if (signatureMethod === 'type') {
      if (typedSignature.trim() !== '') {
        // Pour une signature typée, on encode simplement le texte
        dataUrl = `data:text/plain;base64,${btoa(typedSignature)}`;
      } else {
        alert("Veuillez saisir votre signature.");
        return;
      }
    } else if (signatureMethod === 'upload') {
      if (uploadedSignature) {
        dataUrl = uploadedSignature;
      } else {
        alert("Veuillez uploader une image de votre signature.");
        return;
      }
    }
    setSignatureData(dataUrl);
    // Générer un hash pour garantir l'intégrité de la signature
    const hash = await hashSignature(dataUrl);
    setHashValue(hash);
    try {
      // Appel API simulé pour sauvegarder la signature
      await axios.post('/api/sign', { conventionId: 1, signature: dataUrl, hash: hash, role: 'signataire' });
      setSignatureMessage("Signature sauvegardée et validée.");
      setCurrentStep(3); // Passe à la finalisation (génération du PDF)
    } catch (error) {
      setSignatureMessage("Erreur lors de la sauvegarde de la signature.");
    }
  };

  // Générer le PDF final
  const handleGeneratePdf = async () => {
    try {
      await axios.post('/api/generate-pdf', { conventionId: 1 });
      setPdfMessage("PDF final généré et archivé.");
      setCurrentStep(4);
    } catch (error) {
      setPdfMessage("Erreur lors de la génération du PDF.");
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px', margin: '2rem auto', maxWidth: '900px' }}>
      <h1>Processus de Signature Électronique</h1>

      {currentStep === 0 && (
        <section>
          <h2>1. Upload de la Convention (PDF)</h2>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} />
          <p>{uploadMessage}</p>
        </section>
      )}

      {currentStep === 1 && (
        <section>
          <h2>2. Authentification (OTP)</h2>
          <p>{authMessage}</p>
          <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="Entrez le code OTP" />
          <button onClick={handleOtpVerification} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>Vérifier</button>
        </section>
      )}

      {currentStep === 2 && (
        <section>
          <h2>3. Ajout de la Signature</h2>
          <p>Choisissez votre méthode de signature :</p>
          <div>
            <label>
              <input type="radio" name="signatureMethod" value="draw" checked={signatureMethod === 'draw'} onChange={() => setSignatureMethod('draw')} />
              Dessiner
            </label>
            <label style={{ marginLeft: '1rem' }}>
              <input type="radio" name="signatureMethod" value="type" checked={signatureMethod === 'type'} onChange={() => setSignatureMethod('type')} />
              Taper
            </label>
            <label style={{ marginLeft: '1rem' }}>
              <input type="radio" name="signatureMethod" value="upload" checked={signatureMethod === 'upload'} onChange={() => setSignatureMethod('upload')} />
              Uploader une image
            </label>
          </div>

          {signatureMethod === 'draw' && (
            <div style={{ border: '2px solid #000', margin: '1rem 0' }}>
              <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
            </div>
          )}

          {signatureMethod === 'type' && (
            <div>
              <input type="text" value={typedSignature} onChange={(e) => setTypedSignature(e.target.value)} placeholder="Tapez votre signature" style={{ width: '500px', padding: '0.5rem' }} />
            </div>
          )}

          {signatureMethod === 'upload' && (
            <div>
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setUploadedSignature(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </div>
          )}

          <button onClick={handleSaveSignature} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Sauvegarder la signature</button>
          <p>{signatureMessage}</p>
        </section>
      )}

      {currentStep === 3 && (
        <section>
          <h2>4. Finalisation</h2>
          <p>Toutes les étapes sont complétées. Cliquez ci-dessous pour générer le PDF final.</p>
          <button onClick={handleGeneratePdf} style={{ padding: '0.5rem 1rem' }}>Générer le PDF</button>
          <p>{pdfMessage}</p>
        </section>
      )}

      {currentStep === 4 && (
        <section>
          <h2>Processus terminé</h2>
          <p>Le document final a été généré et archivé. Vous recevrez une notification.</p>
        </section>
      )}
    </div>
  );
};

export default EnhancedESignProPage;
