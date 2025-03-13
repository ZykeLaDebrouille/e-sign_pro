import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding } from 'react-icons/fa';
import userApi from '../../services/api/userApi'; // Chemin corrigé

import './AuthStyles.css';

// Définition des rôles disponibles
const ROLES = {
  ADMIN: 'ADMIN',
  ELEVE: 'ELEVE',
  PARENT: 'PARENT',
  PROFESSEUR: 'PROFESSEUR',
  ENTREPRISE: 'ENTREPRISE'
};

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'ELEVE',
    companyName: '',
    acceptTerms: false
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const userData = {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        role: formData.role
      };

      if (formData.role === 'ENTREPRISE' && formData.companyName) {
        userData.companyName = formData.companyName;
      }

      // Utilisation directe de userApi
      await userApi.register(userData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      console.error('Erreur d\'inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="register-background"></div>
      <div className="auth-form-container">
        <h2>Créer un compte</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom</label>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="lastname"
                placeholder="Votre nom"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="firstname"
                placeholder="Votre prénom"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Adresse e-mail</label>
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Votre e-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-icon-wrapper password-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value={ROLES.ELEVE}>Élève</option>
              <option value={ROLES.PARENT}>Parent</option>
              <option value={ROLES.PROFESSEUR}>Professeur</option>
              <option value={ROLES.ENTREPRISE}>Entreprise</option>
            </select>
          </div>

          {formData.role === ROLES.ENTREPRISE && (
            <div className="form-group">
              <label>Nom de l'entreprise</label>
              <div className="input-icon-wrapper">
                <FaBuilding className="input-icon" />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Nom de l'entreprise"
                  value={formData.companyName}
                  onChange={handleChange}
                  required={formData.role === ROLES.ENTREPRISE}
                />
              </div>
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
        </form>

        <p className="switch-link">
          Déjà inscrit ? <a href="/login">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
