import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../services/api/userApi';
import './AuthStyles.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'ELEVE',
    companyName: '',
    acceptTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

      await userApi.register(userData);
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
      <div className="register-background"></div>
      <div className="auth-form-container">
        <h2>Créer un compte</h2>
        {error && <div className="error">{error}</div>}

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

          <div className="form-group password-wrapper">
            <label>Mot de passe</label>
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
              {showPassword ? 'Masquer' : 'Afficher'}
            </button>
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

          <p className="switch-link">
            Déjà inscrit ? <a href="/login">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
