import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { updateSignature } from '../services/api';
import Loader from './Loader';

const SignatoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupération des données transmises
  // On attend que location.state contienne: documentId, fileName, currentIndex
  const { documentId, fileName, currentIndex } = location.state || {};
  const signatureOrder = ['Étudiant', 'Parent', 'Entreprise', 'Équipe pédagogique'];
  
  // Si ces données ne sont pas présentes, rediriger vers l'accueil
  if (!documentId || currentIndex === undefined) {
    navigate('/');
    return null;
  }
  
  const role = signatureOrder[currentIndex];
  const [isLoading, setIsLoading] = useState(false);
  const signatureRef = useRef(null);

  const handleSaveSignature = async () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signature = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      setIsLoading(true);
      try {
        // On simule la mise à jour de la signature pour le rôle actuel
        await updateSignature({
          documentId,
          role,
          status: 'Terminé',
          signature,
        });
        console.log(`Signature enregistrée pour le rôle ${role}`);

        // Calcul du rôle suivant
        const nextIndex = currentIndex + 1;
        if (nextIndex < signatureOrder.length) {
          // Redirige vers la même page avec l'indice suivant
          navigate('/signatory', {
            state: { documentId, fileName, currentIndex: nextIndex }
          });
        } else {
          // Si tous les rôles ont signé, redirige vers la page de confirmation finale
          navigate('/confirmation', { state: { fileName, documentId } });
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la signature:', error);
        alert('Erreur lors de la sauvegarde de la signature. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Veuillez signer avant de confirmer.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Signature pour : {role}</h1>
      {/* Simulation de l'étape d'authentification */}
      <p>Un code OTP a été envoyé à votre email pour vérifier votre identité. (Simulation)</p>
      <div style={{ border: '1px solid #000', marginBottom: '20px' }}>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
          backgroundColor="#fff"
          penColor="black"
        />
      </div>
      <div>
        <button
          onClick={handleSaveSignature}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: '#4CAF50', color: '#fff' }}
        >
          Confirmer la signature pour {role}
        </button>
        <button
          onClick={() => signatureRef.current && signatureRef.current.clear()}
          style={{ padding: '10px', backgroundColor: '#f44336', color: '#fff' }}
        >
          Effacer
        </button>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default SignatoryPage;
