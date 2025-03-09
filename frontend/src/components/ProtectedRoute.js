// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant pour protéger les routes selon le rôle
 * @param {Array|String} roles - Rôle(s) autorisé(s)
 * @param {String} permission - Permission requise
 */
const ProtectedRoute = ({ roles, permission }) => {
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
  return <Outlet />;
};

export default ProtectedRoute;
