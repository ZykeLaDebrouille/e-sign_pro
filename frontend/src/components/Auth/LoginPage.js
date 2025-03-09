// frontend/src/components/Auth/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './AuthStyles.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Appel à l'API de login
      const response = await API.post('/users/login', { email, password });
      
      // Stocke le token d'authentification
      localStorage.setItem('token', response.data.data.accessToken);
      
      // Stocke les infos utilisateur
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Redirection vers la page d'accueil après connexion
      navigate('/');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(
        error.response?.data?.message || 
        'Impossible de se connecter. Vérifiez vos identifiants.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Connexion</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p>
          Vous n'avez pas de compte ?{' '}
          <a href="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
