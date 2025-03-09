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
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ELEVE');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation dynamique des critères du mot de passe
  const conditionLength = password.length >= 8;
  const conditionUpper = /[A-Z]/.test(password);
  const conditionLower = /[a-z]/.test(password);
  const conditionDigit = /\d/.test(password);
  const conditionSpecial = /[@$!%*?&]/.test(password);

  // Validation d'un email simple
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(validateEmail(value));
  };

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (!conditionLength || !conditionUpper || !conditionLower || !conditionDigit || !conditionSpecial) {
      setErrorMessage("Le mot de passe ne respecte pas tous les critères.");
      return;
    }

    if (!acceptTerms) {
      setErrorMessage("Veuillez accepter les conditions.");
      return;
    }

    try {
      // Appel API simulé pour créer l'utilisateur (à remplacer par votre appel réel)
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, password, role }),
      });
      // Connexion automatique après inscription
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
            onChange={handleEmailChange}
            required
          />
          {email && (
            <small style={{ color: emailValid ? 'green' : 'red' }}>
              {emailValid ? 'Adresse e-mail valide' : 'Adresse e-mail invalide'}
            </small>
          )}
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
          <small>Votre mot de passe doit respecter les conditions suivantes :</small>
          <ul className="password-criteria">
            <li className={conditionLength ? "valid" : ""}>
              {conditionLength ? "✓" : "✗"} Au moins 8 caractères
            </li>
            <li className={conditionUpper ? "valid" : ""}>
              {conditionUpper ? "✓" : "✗"} Au moins une majuscule
            </li>
            <li className={conditionLower ? "valid" : ""}>
              {conditionLower ? "✓" : "✗"} Au moins une minuscule
            </li>
            <li className={conditionDigit ? "valid" : ""}>
              {conditionDigit ? "✓" : "✗"} Au moins un chiffre
            </li>
            <li className={conditionSpecial ? "valid" : ""}>
              {conditionSpecial ? "✓" : "✗"} Au moins un caractère spécial (@$!%*?&)
            </li>
          </ul>
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
