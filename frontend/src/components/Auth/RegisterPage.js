// src/components/Auth/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AuthStyles.css';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ELEVE');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation d'un email simple
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Critères de sécurité moderne pour le mot de passe :
  // - Minimum 8 caractères, au moins une majuscule, une minuscule, un chiffre et un caractère spécial.
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }

    if (!acceptTerms) {
      setErrorMessage("Veuillez accepter les conditions.");
      return;
    }

    // Pour la sécurité, ne pas logger ces données
    // Transmission sécurisée des données via HTTPS (assurez-vous que votre backend est configuré en HTTPS)
    try {
      // Simulation d'appel API pour créer l'utilisateur.
      // Remplacez cet appel par votre requête réelle vers votre backend.
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, password, role }),
      });

      // On se connecte directement après l'inscription.
      login(role);
      navigate('/esignpro');
    } catch (error) {
      setErrorMessage("Erreur lors de la création du compte. Veuillez réessayer.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Créer un compte</h2>
      <p>
        ou bien, <Link to="/login">se connecter</Link>
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            placeholder="Votre prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Adresse e-mail</label>
          <input
            type="email"
            placeholder="Votre e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? "Cacher" : "Afficher"}
            </button>
          </div>
          <small>
            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
          </small>
        </div>

        <div className="form-group">
          <label>Rôle</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="ELEVE">Élève</option>
            <option value="PROFESSEUR">Professeur</option>
            <option value="ENTREPRISE">Entreprise</option>
          </select>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <label htmlFor="acceptTerms"> J'accepte les Conditions</label>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button type="submit" className="btn-primary">
          Créer un compte
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
