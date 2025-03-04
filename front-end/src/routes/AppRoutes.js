import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from '../components/HomePage';
import ESignProPage from '../components/ESignProPage';
import ContactPage from '../components/ContactPage';
import AboutPage from '../components/AboutPage';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext, AuthProvider } from '../context/AuthContext';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pour la page ESignPro, on vérifie l'authentification */}
        <Route
          path="/esignpro"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <ESignProPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
