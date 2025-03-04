import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Pour accéder à ESignPro, vous devez être connecté ou créer un compte.</p>
        <button onClick={() => navigate('/login')}>
          Se connecter / S'inscrire
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
