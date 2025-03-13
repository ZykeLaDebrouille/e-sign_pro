// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import userApi from '../services/api/userApi';

// Constantes pour les rôles
export const ROLES = {
  ADMIN: 'ADMIN',
  ELEVE: 'ELEVE',
  PARENT: 'PARENT',
  PROFESSEUR: 'PROFESSEUR',
  ENTREPRISE: 'ENTREPRISE'
};

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Vérification de l'authentification au chargement
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        // Appel API pour vérifier si le token est valide
        const response = await userApi.checkAuth();
        console.log('Vérification auth réussie:', response.data);
        
        if (response.data && response.data.data) {
          // Mettre à jour l'utilisateur courant avec les données du serveur
          setCurrentUser(response.data.data);
          
          // S'assurer que les données utilisateur sont à jour dans localStorage
          localStorage.setItem('user', JSON.stringify(response.data.data));
        } else {
          // En cas de réponse invalide, on se déconnecte
          handleLogout();
        }
      } catch (error) {
        console.error('Erreur vérification auth:', error);
        // Si erreur 401, déconnexion
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
        setError('Erreur de vérification d\'authentification');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  async function login(credentials) {
    try {
      setLoading(true);
      const response = await userApi.login(credentials);
      
      if (response.data && response.data.data) {
        const { accessToken, user } = response.data.data;
        
        // Stocker dans localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Mettre à jour le contexte
        setCurrentUser(user);
        setError('');
        
        console.log('Connexion réussie:', user);
        return true;
      }
    } catch (error) {
      console.error('Erreur login:', error);
      setError(error.response?.data?.message || 'Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(userData) {
    try {
      setLoading(true);
      const response = await userApi.register(userData);
      setError('');
      return response.data;
    } catch (error) {
      console.error('Erreur register:', error);
      setError(error.response?.data?.message || 'Erreur d\'inscription');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    // Nettoyer localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Réinitialiser l'état
    setCurrentUser(null);
    setError('');
    
    // Appel optionnel à l'API logout
    try {
      userApi.logout();
    } catch (error) {
      console.error('Erreur logout API:', error);
    }
  }

  // Vérification de rôle
  const hasRole = (role) => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    
    return currentUser.role === role;
  };

  // Vérification de permission (à implémenter selon tes besoins)
  const checkPermission = (permission) => {
    return true; // Simplification pour le moment
  };

  const value = {
    currentUser,
    login,
    register,
    logout: handleLogout,
    loading,
    error,
    hasRole,
    checkPermission,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
