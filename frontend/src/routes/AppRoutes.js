// frontend/src/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import HomePage from './components/HomePage';
import ESignProPage from './components/ESignProPage';
import SignaturePage from './components/SignaturePage';
import SignatoryPage from './components/SignatoryPage';
import UnauthorizedPage from './components/UnauthorizedPage';
import ProfilePage from './components/ProfilePage';
import CreateConventionPage from './components/CreateConventionPage';
import StudentDashboard from './components/StudentDashboard';

const AppRoutes = () => {
  const { ROLES } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes - All Authenticated Users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<ESignProPage />} />
      </Route>

      {/* Routes for Teachers & Companies */}
      <Route 
        element={
          <ProtectedRoute 
            roles={[ROLES.PROFESSEUR, ROLES.ENTREPRISE, ROLES.ADMIN]} 
            permission="create_convention"
          />
        }
      >
        <Route path="/conventions/create" element={<CreateConventionPage />} />
      </Route>

      {/* Student-Specific Routes */}
      <Route element={<ProtectedRoute roles={ROLES.ELEVE} />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Route>

      {/* Signature Routes - All Roles */}
      <Route element={<ProtectedRoute permission="sign_document" />}>
        <Route path="/documents/:documentId/sign" element={<SignaturePage />} />
      </Route>

      {/* Signatory Management Routes */}
      <Route element={<ProtectedRoute roles={[ROLES.PROFESSEUR, ROLES.ADMIN]} />}>
        <Route path="/documents/:documentId/signatories" element={<SignatoryPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
