// src/components/ProfilePage.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { userRole } = useContext(AuthContext);

  // Vous pouvez ajouter d'autres informations (nom, e-mail, etc.) récupérées depuis le backend
  return (
    <div style={styles.container}>
      <h1>Profil Utilisateur</h1>
      <p><strong>Rôle :</strong> {userRole}</p>
      <p>Vos informations personnelles s'afficheront ici.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '8px',
    margin: '2rem auto',
    maxWidth: '900px',
    textAlign: 'center',
  },
};

export default ProfilePage;
