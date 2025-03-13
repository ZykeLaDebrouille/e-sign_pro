// frontend/src/components/ESignProPage.js
import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import '../styles/ESignProPage.css';

// Données fictives
const MOCK_USER = {
  firstname: "Enes",
  lastname: "Gemici",
  role: "ELEVE"
};

const MOCK_CONVENTIONS = [
  {
    id: 1,
    sujet_stage: "Mecanique",
    date_debut: "2025-05-01",
    date_fin: "2025-06-30",
    status: "en_cours",
    eleve_id: 1
  },
  {
    id: 2,
    sujet_stage: "Charpente",
    date_debut: "2025-07-15",
    date_fin: "2025-08-30",
    status: "planifié",
    eleve_id: 1
  }
];

// Composant pour l'en-tête du tableau de bord
const DashboardHeader = memo(({ user }) => (
  <>
    <h2>Tableau de bord E-Sign Pro</h2>
    <div className="user-info">
      <p>Connecté en tant que : {user.firstname} {user.lastname}</p>
      <p>Rôle : {user.role}</p>
    </div>
  </>
));

// Composant pour la section stages
const StagesSection = memo(({ conventions, onGeneratePDF }) => (
  <div className="dashboard-section">
    <h3>Mes stages</h3>
    <div className="action-buttons">
      <Link to="/conventions/create" className="create-button">
        Demander une convention de stage
      </Link>
      {conventions.length > 0 && (
        <div className="student-conventions">
          <h4>Mes conventions</h4>
          <ul className="conventions-list">
            {conventions.map(conv => (
              <li key={conv.id}>
                <span>{conv.sujet_stage} - {conv.status}</span>
                <button 
                  onClick={() => onGeneratePDF(conv.id)}
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
));

// Tableau des conventions
const ConventionsTable = memo(({ conventions, onGeneratePDF }) => (
  <div className="dashboard-section">
    <h3>Conventions de stage</h3>
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
                  onClick={() => onGeneratePDF(conv.id)}
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
));

// Composant principal
const ESignProPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fonction fictive de génération de PDF
  const handleGeneratePDF = (conventionId) => {
    setLoading(true);
    // Simuler le chargement
    setTimeout(() => {
      setLoading(false);
      alert(`Le PDF pour la convention #${conventionId} serait téléchargé dans une application réelle.`);
    }, 1500);
  };

  // Afficher le loader si nécessaire
  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="esign-pro-page">
      <DashboardHeader user={MOCK_USER} />
      
      {/* Section des stages */}
      <StagesSection 
        conventions={MOCK_CONVENTIONS} 
        onGeneratePDF={handleGeneratePDF} 
      />

      {/* Section des conventions */}
      <ConventionsTable 
        conventions={MOCK_CONVENTIONS} 
        onGeneratePDF={handleGeneratePDF} 
      />
    </div>
  );
};

export default ESignProPage;
