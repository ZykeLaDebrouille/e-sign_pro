import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import '../styles/ESignProPage.css';
import { conventionApi } from '../services/api/conventionApi';
import * as userApi from '../services/api/userApi';

// Composant pour le suivi visuel des signatures
const SignatureTracker = memo(({ signatures }) => {
  const statuses = [
    { key: 'eleve', label: 'Élève' },
    { key: 'parent', label: 'Parent' },
    { key: 'entreprise', label: 'Entreprise' },
    { key: 'professeur', label: 'Professeur' }
  ];
  
  return (
    <div className="signature-tracker">
      {statuses.map(status => (
        <div key={status.key} className={`signature-status ${signatures[status.key] ? 'signed' : 'pending'}`}>
          <span className="status-label">{status.label}</span>
          <span className="status-icon">
            {signatures[status.key] ? '✓' : '○'}
          </span>
        </div>
      ))}
    </div>
  );
});

// Formulaire modal pour nouvelle convention
const ConventionForm = memo(({ isOpen, onClose, onSubmit, filiere }) => {
  const [formData, setFormData] = useState({
    sujet_stage: filiere,
    date_debut: '',
    date_fin: '',
    entreprise: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="convention-form">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Nouvelle convention de stage</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sujet du stage</label>
            <input 
              type="text" 
              name="sujet_stage" 
              value={formData.sujet_stage} 
              onChange={handleChange} 
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label>Date de début</label>
            <input 
              type="date" 
              name="date_debut" 
              value={formData.date_debut} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Date de fin</label>
            <input 
              type="date" 
              name="date_fin" 
              value={formData.date_fin} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Entreprise</label>
            <input 
              type="text" 
              name="entreprise" 
              value={formData.entreprise} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Annuler</button>
            <button type="submit" className="submit-btn">Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Composant principal
const ESignProPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [conventions, setConventions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Filière par défaut pour les stages
  const filiere = "Charpente";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setUser(response.data.user);
        
        const mockConventions = [
          {
            id: 1,
            sujet_stage: filiere,
            date_debut: "2025-05-01",
            date_fin: "2025-06-30",
            status: "en_attente_signature",
            entreprise: "Charpentes Martin",
            signatures: {
              eleve: true,
              parent: false,
              entreprise: false,
              professeur: false
            }
          }
        ];
        
        setConventions(mockConventions);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement du profil: " + err.message);
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Fonction de génération de PDF avec l'API existante
  const handleGeneratePDF = async (conventionId) => {
    setLoading(true);
    try {
      const convention = conventions.find(conv => conv.id === conventionId);
      if (!convention) throw new Error("Convention non trouvée");
      
      // Appel à l'API generateConvention
      await conventionApi.generateConvention(convention);
      
      setLoading(false);
      // Affichage d'une confirmation
      alert(`Le PDF de la convention "${convention.sujet_stage}" a été généré avec succès.`);
    } catch (err) {
      setError("Erreur lors de la génération du PDF: " + err.message);
      setLoading(false);
    }
  };
  
  // Fonction de création de convention
  const handleCreateConvention = (data) => {
    setLoading(true);
    
    // Simulation d'appel API
    setTimeout(() => {
      const newConvention = {
        id: conventions.length + 1,
        ...data,
        status: 'brouillon',
        signatures: {
          eleve: false,
          parent: false,
          entreprise: false,
          professeur: false
        }
      };
      
      setConventions([...conventions, newConvention]);
      setLoading(false);
    }, 1000);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">Utilisateur non trouvé</div>;

  return (
    <div className="esign-pro-container">
      <div className="dashboard-header">
        <h2>Tableau de bord</h2>
        <div className="user-info">
          <p>
            <span className="user-name">{user.firstname} {user.lastname}</span>
            <span className="user-role">{user.userRole}</span>
          </p>
          <p>Lycée Jean Monnet - Annemasse</p>
        </div>
      </div>
      
      <div className="main-actions">
        <button className="new-convention-btn" onClick={() => setIsFormOpen(true)}>
          + Nouvelle convention
        </button>
      </div>
      
      {/* Formulaire modal */}
      <ConventionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateConvention}
        filiere={filiere}
      />
      
      <div className="conventions-section">
        <h3>Mes conventions de stage</h3>
        <div className="conventions-grid">
          {conventions.length === 0 ? (
            <p className="no-conventions">Aucune convention trouvée. Créez-en une nouvelle.</p>
          ) : (
            conventions.map(conv => (
              <div key={conv.id} className={`convention-card status-${conv.status}`}>
                <div className="convention-header">
                  <h4>{conv.sujet_stage}</h4>
                  <span className={`status-badge ${conv.status}`}>
                    {conv.status === 'en_attente_signature' ? 'En attente' : 
                     conv.status === 'brouillon' ? 'Brouillon' : 
                     conv.status === 'planifié' ? 'Planifié' : 
                     conv.status === 'en_cours' ? 'En cours' : conv.status}
                  </span>
                </div>
                
                <div className="convention-info">
                  <p><strong>Entreprise:</strong> {conv.entreprise}</p>
                  <p><strong>Période:</strong> {new Date(conv.date_debut).toLocaleDateString('fr-FR')} au {new Date(conv.date_fin).toLocaleDateString('fr-FR')}</p>
                </div>
                
                <div className="signatures-section">
                  <h5>Suivi des signatures</h5>
                  <SignatureTracker signatures={conv.signatures} />
                </div>
                
                <div className="convention-actions">
                  <button onClick={() => handleGeneratePDF(conv.id)} className="pdf-btn">
                    Télécharger PDF
                  </button>
                  <Link to={`/conventions/${conv.id}`} className="details-link">
                    Détails
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ESignProPage;
