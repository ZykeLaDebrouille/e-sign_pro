import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth } from '../services/api/userApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ROLES = {
    ADMIN: 'ADMIN',
    ELEVE: 'ELEVE',
    PARENT: 'PARENT',
    PROFESSEUR: 'PROFESSEUR',
    ENTREPRISE: 'ENTREPRISE'
  };

  // Fonction pour vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (requiredRoles) => {
    if (!currentUser) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(currentUser.userRole);
    }
    
    return currentUser.userRole === requiredRoles;
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await checkAuth();
        if (data && data.data) {
          setCurrentUser(data.data);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Erreur d'authentification:", err);
        setCurrentUser(null);
        setError(err.message || "Une erreur d'authentification est survenue");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Exposer les valeurs et fonctions du contexte
  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    hasRole,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
