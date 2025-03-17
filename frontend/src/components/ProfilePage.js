import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userApi from '../services/api/userApi';
import '../styles/ProfilePage.css';
import { FaUser, FaEnvelope, FaCalendarAlt, FaIdCard } from 'react-icons/fa';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await userApi.getProfile();
        setProfileData(response.data.user || response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil:', err);
        setError('Impossible de charger les informations de profil.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="profile-loading">Chargement des informations...</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>Mon Profil</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileData?.firstname?.charAt(0)}{profileData?.lastname?.charAt(0)}
          </div>
          <h2>{profileData?.firstname} {profileData?.lastname}</h2>
          <span className="profile-role">{profileData?.userRole}</span>
        </div>
        
        <div className="profile-info">
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <div>
              <span className="info-label">Email</span>
              <span className="info-value">{profileData?.email}</span>
            </div>
          </div>
          
          <div className="info-item">
            <FaIdCard className="info-icon" />
            <div>
              <span className="info-label">Rôle</span>
              <span className="info-value">{profileData?.userRole}</span>
            </div>
          </div>
          
          <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <div>
              <span className="info-label">Inscrit depuis</span>
              <span className="info-value">
                {new Date(profileData?.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="btn-primary">Modifier mon profil</button>
          <button className="btn-secondary">Changer mon mot de passe</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
