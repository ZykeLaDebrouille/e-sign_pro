// src/components/Auth/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AuthStyles.css';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Exemple simplifié
    if (email === 'test@exemple.com' && password === '1234') {
      // Suppose qu’on récupère le rôle (ex. 'ELEVE') d’une API
      login('ELEVE');
      navigate('/esignpro'); // Redirection vers la page ESignPro
    } else {
      alert('Identifiants incorrects ou simulation d’erreur');
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} className="auth-form">
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
          <input 
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="btn-primary">Se connecter</button>
      </form>

      <p className="switch-link">
        ou bien, <Link to="/register">créer un compte</Link>
      </p>
    </div>
  );
};

export default LoginPage;
