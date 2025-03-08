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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      alert("Veuillez accepter les conditions.");
      return;
    }

    // Simulation : on crée le compte
    console.log("Création compte avec : ", { nom, prenom, email, password, role });
    // Une fois créé, on se connecte directement
    login(role);
    navigate('/esignpro');
  };

  return (
    <div className="auth-container">
      <h2>Créer un compte</h2>
      <p>ou bien, <Link to="/login">se connecter</Link></p>

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
          <input 
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
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

        <button type="submit" className="btn-primary">Créer un compte</button>
      </form>
    </div>
  );
};

export default RegisterPage;
