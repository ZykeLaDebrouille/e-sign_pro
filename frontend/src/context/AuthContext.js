// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import userApi from '../services/api/userApi';

// Définition des rôles
const ROLES = {
  ADMIN: 'ADMIN',
  ELEVE: 'ELEVE',
  PARENT: 'PARENT',
  PROFESSEUR: 'PROFESSEUR',
  ENTREPRISE: 'ENTREPRISE'
};

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setCurrentUser(null);
          setAuthChecked(true);
          setLoading(false);
          return;
        }
        
        // Vérifier la validité du token
        const response = await userApi.checkAuth();
        if (response.data.status === 'success') {
          // Stocker les informations utilisateur
          setCurrentUser(response.data.data);
          
          // Mettre à jour user dans localStorage si nécessaire
          localStorage.setItem('user', JSON.stringify(response.data.data));
        } else {
          // Token invalide
          logout();
        }
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        // Si erreur d'autorisation, nettoyer
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      const response = await userApi.login(credentials);
      if (response.data.status === 'success') {
        const { accessToken, user } = response.data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        return { success: true };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      const response = await userApi.register(userData);
      if (response.data.status === 'success') {
        return { success: true };
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'inscription'
      };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    
    // Optionnel: appeler l'API de déconnexion
    try {
      userApi.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion sur le serveur:', error);
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (requiredRoles) => {
    if (!currentUser) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(currentUser.role);
    }
    
    return currentUser.role === requiredRoles;
  };

  // Vérifier si l'utilisateur a une permission spécifique
  const checkPermission = (permission) => {
    // Implémenter la logique de vérification des permissions ici
    // Pour l'instant, retournons true
    return true;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    hasRole,
    checkPermission,
    ROLES,
    authChecked
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
