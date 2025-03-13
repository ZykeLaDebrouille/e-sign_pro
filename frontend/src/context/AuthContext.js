// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import userApi from '../services/api/userApi';

// Rôles disponibles
export const ROLES = {
  ADMIN: 'ADMIN',
  ELEVE: 'ELEVE',
  PARENT: 'PARENT',
  PROFESSEUR: 'PROFESSEUR',
  ENTREPRISE: 'ENTREPRISE'
};

// Création du contexte
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          // Définir l'utilisateur stocké d'abord
          setCurrentUser(JSON.parse(storedUser));
          
          // Puis vérifier l'authenticité auprès du serveur
          try {
            const response = await userApi.checkAuth();
            if (response.data && response.data.data && response.data.data.user) {
              setCurrentUser(response.data.data.user);
              // Mettre à jour le stockage local
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
          } catch (err) {
            console.log('Session expirée, maintien de l\'utilisateur local');
          }
        } catch (err) {
          console.error('Erreur dans checkAuth:', err);
          // Ne pas déconnecter tout de suite
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (roles) => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userApi.login({ email, password });
      console.log('Réponse de login:', response.data);
      
      if (response.data && response.data.data) {
        const { user, accessToken } = response.data.data;
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        
        console.log('Utilisateur connecté:', user);
        return user;
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.response?.data?.message || 'Échec de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Envoi de demande d\'inscription:', userData);
      const response = await userApi.register(userData);
      console.log('Réponse d\'inscription:', response.data);
      
      if (response.data && response.data.data) {
        const { user, accessToken } = response.data.data;
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        
        return user;
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.response?.data?.message || 'Échec de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await userApi.logout();
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  };

  // Valeur du contexte avec les fonctions
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export pour l'utilisation avec useContext
export { AuthContext };