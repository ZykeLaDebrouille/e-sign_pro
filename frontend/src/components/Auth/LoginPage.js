// frontend/src/components/Auth/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import './AuthStyles.css';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      
      // Si "Se souvenir de moi" est coché, stocker l'email pour la prochaine fois
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
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

  // Récupérer l'email mémorisé au chargement du composant
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Connexion</h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre espace E-Sign PRO
          </p>
        </div>
        
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md -space-y-px">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5 text-gray-400" />
                ) : (
                  <FaEye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
