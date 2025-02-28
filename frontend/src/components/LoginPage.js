import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!username || !password) {
      setError("Tous les champs sont requis.");
      return;
    }
    setError('');
    setLoading(true);
    // Simulation d'authentification
    const success = login(username, password);
    setLoading(false);
    if (success) {
      navigate('/');
    } else {
      setError("Nom d’utilisateur ou mot de passe invalide.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Connexion</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Nom d’utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
