// src/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ESignProPage from './components/ESignProPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';

// Import des nouvelles pages Auth
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';

// Import du composant de protection
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Pages d'authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Page ESignPro protégée */}
        <Route
          path="/esignpro"
          element={
            <ProtectedRoute>
              <ESignProPage />
            </ProtectedRoute>
          }
        />

        {/* Redirection si aucune route ne correspond */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
