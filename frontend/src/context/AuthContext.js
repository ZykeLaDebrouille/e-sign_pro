import React, { createContext, useState, useEffect } from 'react';
import { checkAuth } from '../services/api/userApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const data = await checkAuth();
        setCurrentUser(data.user);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};