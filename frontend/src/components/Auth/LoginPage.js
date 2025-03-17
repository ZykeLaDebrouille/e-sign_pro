import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api/userApi';
import './AuthStyles.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/esignpro');
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Mot de passe</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginPage;
