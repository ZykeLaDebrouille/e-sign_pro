import React, { createContext, useState, useEffect } from 'react';

// Création du contexte
export const AuthContext = createContext();

// Provider pour l'authentification
export const AuthProvider = ({ children }) => {
  // On vérifie si un token est présent dans le localStorage pour initialiser l'état
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fonction de login : stocke le token et met à jour l'état
  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // Fonction de logout : supprime le token et met à jour l'état
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
