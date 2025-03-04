// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Accès restreint</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
        <button onClick={() => navigate('/login')}>Se connecter / S'inscrire</button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
