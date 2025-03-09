// frontend/src/components/Auth/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthStyles.css';

const RegisterPage = () => {
  const { register, ROLES } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstname: '', // Prénom
    lastname: '', // Nom
    role: 'ELEVE', // Rôle par défaut (sans utiliser ROLES qui peut être undefined)
    companyName: '', // Pour les entreprises
    acceptTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du formulaire
    if (!formData.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }
    
    if (formData.password !== formData.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Données à envoyer à l'API
      const userData = {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        role: formData.role
      };
      
      // Ajout des données spécifiques au rôle entreprise
      if (formData.role === 'ENTREPRISE' && formData.companyName) {
        userData.companyName = formData.companyName;
      }
      
      // Appel à la fonction d'inscription du contexte
      await register(userData);
      
      // Redirection après inscription réussie
      navigate('/esignpro');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      console.error('Erreur d\'inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Créer un compte</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom</label>
            <input 
              type="text"
              name="lastname"
              placeholder="Votre nom"
              value={formData.lastname}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Prénom</label>
            <input 
              type="text"
              name="firstname"
              placeholder="Votre prénom"
              value={formData.firstname}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Adresse e-mail</label>
            <input 
              type="email"
              name="email"
              placeholder="Votre e-mail"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input 
              type="password"
              name="passwordConfirm"
              placeholder="Confirmer votre mot de passe"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Rôle</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              required
            >
              <option value="ELEVE">Élève</option>
              <option value="PARENT">Parent</option>
              <option value="PROFESSEUR">Professeur</option>
              <option value="ENTREPRISE">Entreprise</option>
            </select>
          </div>
          
          {/* Champs conditionnels selon le rôle */}
          {formData.role === 'ENTREPRISE' && (
            <div className="form-group">
              <label>Nom de l'entreprise</label>
              <input
                type="text"
                name="companyName"
                placeholder="Nom de l'entreprise"
                value={formData.companyName}
                onChange={handleChange}
                required={formData.role === 'ENTREPRISE'}
              />
            </div>
          )}

          <div className="checkbox-group">
            <input 
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            <label htmlFor="acceptTerms"> J'accepte les Conditions</label>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer un compte'}
          </button>
          
          <p className="auth-link">
            Déjà inscrit ? <a href="/login">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
