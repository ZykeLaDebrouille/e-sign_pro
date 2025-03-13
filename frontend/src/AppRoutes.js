// src/AppRoutes.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import ESignProPage from './components/ESignProPage';

import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ProfilePage from './components/ProfilePage';

import UnauthorizedPage from './components/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

const AppRoutes = () => {
  const { ROLES } = useAuth();
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    setBgImage(process.env.PUBLIC_URL + '/images/background.jpg');
  }, []);

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Router>
        <Navbar />
        <div style={{ flex: 1 }}>
        <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Routes protégées */}
            <Route 
              path="/esignpro" 
              element={<ESignProPage />}
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default AppRoutes;
