// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { userApi } from '../services/api/userApi';

// Définition des rôles côté frontend
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
          // Convertir l'utilisateur stocké en objet
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          
          // Optionnel: vérifier la validité du token avec une requête API
          setCurrentUser(response.data.data.user);
        } catch (err) {
          // En cas d'erreur, nettoyer le stockage local
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setError('Session expirée. Veuillez vous reconnecter.');
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

  // Vérifier si l'utilisateur a une permission
  const checkPermission = (permission) => {
    if (!currentUser) return false;
    
    // Mapping simplifié des permissions
    const rolePermissions = {
      ADMIN: ['*'],
      ELEVE: ['create_convention', 'sign_document', 'view_own_documents', 'edit_profile'],
      PARENT: ['sign_document', 'view_student_documents', 'edit_profile'],
      PROFESSEUR: ['create_convention', 'view_students', 'sign_document', 'edit_profile'],
      ENTREPRISE: ['sign_document', 'view_own_conventions', 'create_convention', 'edit_profile']
    };

    const userPermissions = rolePermissions[currentUser.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userApi.login({ email, password });
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return user;
    } catch (err) {
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
      
      const response = await userApi.register(userData);
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return user;
    } catch (err) {
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
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  };

  // Valeur du contexte avec les nouvelles fonctions
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    checkPermission,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportation pour l'utilisation dans d'autres fichiers
export { AuthContext };
