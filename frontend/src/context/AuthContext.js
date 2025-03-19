import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth, login, logout } from '../services/api/userApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ROLES = {
    ADMIN: 'ADMIN',
    ELEVE: 'ELEVE',
    PARENT: 'PARENT',
    PROFESSEUR: 'PROFESSEUR',
    ENTREPRISE: 'ENTREPRISE'
  };

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await checkAuth();
      
      if (response && response.data) {
        setCurrentUser(response.data);
        console.log("Utilisateur authentifié:", response.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification d'authentification:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials);
      setCurrentUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setCurrentUser(null);
      window.location.href = '/'; // Redirection vers la page d'accueil
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const hasRole = (roles) => {
    if (!currentUser) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.userRole);
    }
    
    return currentUser.userRole === roles;
  };

  const value = {
    currentUser,
    loading,
    loginUser,
    logoutUser,
    hasRole,
    ROLES,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
