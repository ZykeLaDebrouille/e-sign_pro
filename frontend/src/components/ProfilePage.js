// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant pour protéger les routes selon le rôle
 * @param {Array|String} roles - Rôle(s) autorisé(s)
 * @param {String} permission - Permission requise
 * @param {React.ReactNode} children - Les composants enfants à afficher
 */
const ProtectedRoute = ({ roles, permission, children }) => {
  const { currentUser, hasRole, checkPermission, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  // Vérification de l'authentification
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification du rôle si spécifié
  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Vérification de la permission si spécifiée
  if (permission && !checkPermission(permission)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // L'utilisateur est authentifié et a les droits nécessaires
  return children;
};

export default ProtectedRoute;
