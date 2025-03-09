// frontend/src/components/SignatoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { documentApi } from '../services/api/documentApi';
import { signatureApi } from '../services/api/signatureApi';
import Loader from './Loader';

const SignatoryPage = () => {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSignatory, setNewSignatory] = useState({ email: '', role: 'ELEVE' });

  // Récupérer le document et les signataires
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer le document
        const docResponse = await documentApi.getDocument(documentId);
        setDocument(docResponse.data.data);
        
        // Récupérer l'historique des signatures
        const sigResponse = await signatureApi.getSignatureHistory(documentId);
        setSignatories(sigResponse.data.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les informations');
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchData();
    }
  }, [documentId]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSignatory(prev => ({ ...prev, [name]: value }));
  };

  // Ajouter un signataire
  const addSignatory = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Appel API pour ajouter un signataire (à adapter selon ton API)
      await documentApi.addSignatory(documentId, newSignatory);
      
      // Rafraîchir la liste des signataires
      const sigResponse = await signatureApi.getSignatureHistory(documentId);
      setSignatories(sigResponse.data.data);
      
      // Réinitialiser le formulaire
      setNewSignatory({ email: '', role: 'ELEVE' });
    } catch (err) {
      console.error('Erreur lors de l\'ajout du signataire:', err);
      setError('Impossible d\'ajouter le signataire');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="signatories-page">
      <h2>Signataires du document</h2>
      
      {document && (
        <div className="document-info">
          <h3>{document.title}</h3>
          <p>Statut: {document.status}</p>
        </div>
      )}
      
      <div className="signatories-list">
        <h3>Signataires actuels</h3>
        {signatories.length === 0 ? (
          <p>Aucun signataire pour le moment</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Date de signature</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {signatories.map((sig, index) => (
                <tr key={index}>
                  <td>{sig.firstname} {sig.lastname}</td>
                  <td>{sig.role}</td>
                  <td>{sig.signed_at ? new Date(sig.signed_at).toLocaleString() : 'Non signé'}</td>
                  <td>{sig.signed_at ? 'Signé' : 'En attente'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="add-signatory-form">
        <h3>Ajouter un signataire</h3>
        <form onSubmit={addSignatory}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newSignatory.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Rôle</label>
            <select name="role" value={newSignatory.role} onChange={handleChange}>
              <option value="ELEVE">Élève</option>
              <option value="TUTEUR">Tuteur</option>
              <option value="PROFESSEUR">Professeur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
          
          <button type="submit" className="add-button">
            Ajouter le signataire
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignatoryPage;
