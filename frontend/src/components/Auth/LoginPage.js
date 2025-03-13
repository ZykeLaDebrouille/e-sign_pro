import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../services/api/userApi';
import './AuthStyles.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userApi.login({ email, password });
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
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
        {error && <div className="error">{error}</div>}

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

          <div className="form-group password-wrapper">
            <label>Mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="switch-link">
          Vous n'avez pas de compte ?{' '}
          <a href="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
