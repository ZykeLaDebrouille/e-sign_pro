// frontend/src/components/ESignProPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { conventionApi } from '../services/api/conventionApi';
import { documentApi } from '../services/api/documentApi';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ESignProPage = () => {
  const [conventions, setConventions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, hasRole, ROLES } = useAuth();

  // Récupérer les conventions et documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les conventions
        const convResponse = await conventionApi.getAllConventions();
        setConventions(convResponse.data.data);
        
        // Récupérer les documents
        const docResponse = await documentApi.getAllDocuments();
        setDocuments(docResponse.data.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Fonction pour afficher une section spécifique selon le rôle
  const renderRoleSpecificSection = () => {
    if (hasRole(ROLES.PROFESSEUR)) {
      return (
        <div className="dashboard-section">
          <h3>Gestion des conventions</h3>
          <div className="action-buttons">
            <Link to="/conventions/create" className="create-button">
              Créer une nouvelle convention
            </Link>
            <Link to="/students" className="view-button">
              Voir la liste des élèves
            </Link>
          </div>
        </div>
      );
    }
    
    if (hasRole(ROLES.ELEVE)) {
      return (
        <div className="dashboard-section">
          <h3>Mes stages</h3>
          <div className="action-buttons">
            <Link to="/conventions/create" className="create-button">
              Demander une convention de stage
            </Link>
            {/* Afficher les conventions de l'élève avec option de génération de PDF */}
            {conventions.length > 0 && (
              <div className="student-conventions">
                <h4>Mes conventions</h4>
                <ul className="conventions-list">
                  {conventions.map(conv => (
                    <li key={conv.id}>
                      <span>{conv.sujet_stage} - {conv.status}</span>
                      <button 
                        onClick={() => generateConventionPDF(conv.id)}
                        className="action-button"
                      >
                        Télécharger PDF
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (hasRole(ROLES.PARENT)) {
      return (
        <div className="dashboard-section">
          <h3>Documents de mon enfant</h3>
          <div className="action-buttons">
            <Link to="/student-documents" className="view-button">
              Voir les conventions à signer
            </Link>
          </div>
        </div>
      );
    }
    
    if (hasRole(ROLES.ENTREPRISE)) {
      return (
        <div className="dashboard-section">
          <h3>Gestion des stagiaires</h3>
          <div className="action-buttons">
            <Link to="/conventions/create" className="create-button">
              Proposer un stage
            </Link>
            <Link to="/internships" className="view-button">
              Gérer les stages en cours
            </Link>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Générer un PDF de convention
  const generateConventionPDF = async (conventionId) => {
    try {
      setLoading(true);
      
      // Récupérer les données de la convention
      const response = await conventionApi.getConvention(conventionId);
      const conventionData = response.data.data;
      
      // Générer le PDF
      const pdfResponse = await conventionApi.generatePDF(conventionData);
      
      // Créer un blob et télécharger le fichier
      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.setAttribute('download', `convention_${conventionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      setError('Impossible de générer le PDF');
    } finally {
      setLoading(false);
    }
  };

  // Déterminer si nous devons afficher la section générale des conventions
  // Pour éviter la duplication pour les élèves
  const shouldShowGeneralConventionsSection = !hasRole(ROLES.ELEVE);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="esign-pro-page">
      <h2>Tableau de bord E-Sign Pro</h2>
      
      {/* Afficher le nom et le rôle de l'utilisateur */}
      <div className="user-info">
        <p>Connecté en tant que : {currentUser?.firstname} {currentUser?.lastname}</p>
        <p>Rôle : {currentUser?.role}</p>
      </div>

      {/* Section spécifique au rôle */}
      {renderRoleSpecificSection()}

      {/* Section des conventions - affichée pour tous sauf les élèves (qui ont déjà leur propre section) */}
      {shouldShowGeneralConventionsSection && (
        <div className="dashboard-section">
          <h3>Mes conventions</h3>
          {conventions.length === 0 ? (
            <p>Aucune convention trouvée</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sujet</th>
                  <th>Période</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conventions.map(conv => (
                  <tr key={conv.id}>
                    <td>{conv.id}</td>
                    <td>{conv.sujet_stage}</td>
                    <td>{conv.date_debut} au {conv.date_fin}</td>
                    <td>{conv.status}</td>
                    <td>
                      <button 
                        onClick={() => generateConventionPDF(conv.id)}
                        className="action-button"
                      >
                        Télécharger PDF
                      </button>
                      <Link to={`/conventions/${conv.id}`} className="action-link">
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      <div className="dashboard-section">
        <h3>Documents à signer</h3>
        {documents.length === 0 ? (
          <p>Aucun document à signer</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Date de création</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.title}</td>
                  <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td>{doc.status}</td>
                  <td>
                    <Link to={`/documents/${doc.id}/sign`} className="action-link">
                      Signer
                    </Link>
                    <Link to={`/documents/${doc.id}/signatories`} className="action-link">
                      Signataires
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ESignProPage;
