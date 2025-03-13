// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, loading, hasRole } = useAuth();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles si spécifiés
  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // L'utilisateur est authentifié et autorisé
  return children;
};

export default ProtectedRoute;
