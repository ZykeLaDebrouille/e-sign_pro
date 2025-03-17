import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import * as userApi from '../../services/api/userApi';
import './AuthPage.css';

const ROLES = {
  ADMIN: 'ADMIN',
  ELEVE: 'ELEVE',
  PARENT: 'PARENT',
  PROFESSEUR: 'PROFESSEUR',
  ENTREPRISE: 'ENTREPRISE'
};

const AuthPage = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // État pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // État pour le formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    userRole: 'ELEVE',
    companyName: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestionnaire pour le formulaire de connexion
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestionnaire pour le formulaire d'inscription
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Soumission du formulaire de connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(loginData);
      navigate('/esignpro');
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

  // Soumission du formulaire d'inscription
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerData.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const userData = {
        email: registerData.email,
        password: registerData.password,
        firstname: registerData.firstname,
        lastname: registerData.lastname,
        userRole: registerData.userRole
      };

      if (registerData.userRole === ROLES.ENTREPRISE && registerData.companyName) {
        userData.companyName = registerData.companyName;
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

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-modes">
          <button 
            className={`mode-button ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Connexion
          </button>
          <button 
            className={`mode-button ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Inscription
          </button>
        </div>

        <div className="auth-form-wrapper">
          {error && <div className="auth-error">{error}</div>}

          {/* Formulaire de connexion */}
          <form 
            className={`auth-form ${mode === 'login' ? 'active' : ''}`} 
            onSubmit={handleLoginSubmit}
          >
            <div className="form-group">
              <label htmlFor="login-email">
                <FaEnvelope className="input-icon" />
                <span>Email</span>
              </label>
              <input 
                id="login-email"
                type="email" 
                name="email" 
                placeholder="Votre adresse email"
                value={loginData.email}
                onChange={handleLoginChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">
                <FaLock className="input-icon" />
                <span>Mot de passe</span>
              </label>
              <div className="password-input-wrapper">
                <input 
                  id="login-password"
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  placeholder="Votre mot de passe"
                  value={loginData.password}
                  onChange={handleLoginChange}
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

            <div className="form-actions">
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            <div className="form-footer">
              <p>Pas encore de compte ? <button type="button" onClick={toggleMode} className="mode-link">Créer un compte</button></p>
            </div>
          </form>

          {/* Formulaire d'inscription */}
          <form 
            className={`auth-form ${mode === 'register' ? 'active' : ''}`} 
            onSubmit={handleRegisterSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-firstname">
                  <FaUser className="input-icon" />
                  <span>Prénom</span>
                </label>
                <input 
                  id="reg-firstname"
                  type="text" 
                  name="firstname" 
                  placeholder="Votre prénom"
                  value={registerData.firstname}
                  onChange={handleRegisterChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-lastname">
                  <FaUser className="input-icon" />
                  <span>Nom</span>
                </label>
                <input 
                  id="reg-lastname"
                  type="text" 
                  name="lastname" 
                  placeholder="Votre nom"
                  value={registerData.lastname}
                  onChange={handleRegisterChange}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">
                <FaEnvelope className="input-icon" />
                <span>Email</span>
              </label>
              <input 
                id="reg-email"
                type="email" 
                name="email" 
                placeholder="Votre adresse email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">
                <FaLock className="input-icon" />
                <span>Mot de passe</span>
              </label>
              <div className="password-input-wrapper">
                <input 
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  placeholder="Votre mot de passe"
                  value={registerData.password}
                  onChange={handleRegisterChange}
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
              <label htmlFor="reg-role">
                <FaBuilding className="input-icon" />
                <span>Rôle</span>
              </label>
              <select 
                id="reg-role"
                name="userRole" 
                value={registerData.userRole}
                onChange={handleRegisterChange}
                required
              >
                <option value={ROLES.ELEVE}>Élève</option>
                <option value={ROLES.PARENT}>Parent</option>
                <option value={ROLES.PROFESSEUR}>Professeur</option>
                <option value={ROLES.ENTREPRISE}>Entreprise</option>
              </select>
            </div>

            {registerData.userRole === ROLES.ENTREPRISE && (
              <div className="form-group">
                <label htmlFor="reg-company">
                  <FaBuilding className="input-icon" />
                  <span>Nom de l'entreprise</span>
                </label>
                <input 
                  id="reg-company"
                  type="text" 
                  name="companyName" 
                  placeholder="Nom de votre entreprise"
                  value={registerData.companyName}
                  onChange={handleRegisterChange}
                  required={registerData.userRole === ROLES.ENTREPRISE} 
                />
              </div>
            )}

            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="acceptTerms" 
                name="acceptTerms"
                checked={registerData.acceptTerms}
                onChange={handleRegisterChange}
              />
              <label htmlFor="acceptTerms">J'accepte les conditions d'utilisation</label>
            </div>

            <div className="form-actions">
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Inscription...' : 'Créer un compte'}
              </button>
            </div>

            <div className="form-footer">
              <p>Déjà inscrit ? <button type="button" onClick={toggleMode} className="mode-link">Se connecter</button></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
