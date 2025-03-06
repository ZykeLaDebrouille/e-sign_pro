// src/AppRoutes.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import ESignProPage from './components/ESignProPage';
import './index.css'; // Pour charger nos styles globaux

const AppRoutes = () => {
  // Liste d'images pour le fond (assurez-vous qu'elles sont dans public/images)
  const backgroundImages = [
    '/images/bg1.jpg',
    '/images/bg2.jpg',
    '/images/bg3.jpg',
    '/images/bg4.jpg'
  ];

  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBgImage(backgroundImages[randomIndex]);
  }, []);

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/esignpro" element={<ESignProPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default AppRoutes;
