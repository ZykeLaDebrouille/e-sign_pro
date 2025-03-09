// frontend/src/components/UnauthorizedPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="unauthorized-page">
      <h2>Accès non autorisé</h2>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      
      {currentUser ? (
        <div>
          <p>Vous êtes connecté en tant que : {currentUser.firstname} {currentUser.lastname}</p>
          <p>Rôle : {currentUser.role}</p>
        </div>
      ) : (
        <p>Vous n'êtes pas connecté.</p>
      )}
      
      <div className="action-links">
        <Link to="/dashboard">Retour au tableau de bord</Link>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
