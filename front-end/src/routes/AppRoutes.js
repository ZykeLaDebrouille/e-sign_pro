import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from '../components/HomePage';
import ESignProPage from '../components/ESignProPage';
import ContactPage from '../components/ContactPage';
import AboutPage from '../components/AboutPage';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage'; // <-- Ajoutez l'import

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/esignpro" element={<ESignProPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Route pour la page de connexion */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route pour la page d’inscription */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirige vers / si aucune route ne correspond */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
