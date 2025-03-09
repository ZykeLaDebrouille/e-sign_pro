// src/components/ProfilePage.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { userRole } = useContext(AuthContext);

  // Données de profil simulées ; en production, vous récupérerez ces informations depuis le backend.
  const [profile, setProfile] = useState({
    nom: 'Doe',
    prenom: 'John',
    email: 'john.doe@example.com',
    role: userRole || 'Non défini',
  });

  // Mode édition pour modifier le profil
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Ici, vous devriez appeler une API pour sauvegarder les modifications du profil
    alert("Profil mis à jour !");
    setEditMode(false);
  };

  return (
    <div style={styles.container}>
      <h1>Profil Utilisateur</h1>
      <div style={styles.card}>
        <div style={styles.avatarContainer}>
          <img
            src={process.env.PUBLIC_URL + '/images/avatar-placeholder.png'}
            alt="Avatar"
            style={styles.avatar}
          />
        </div>
        <div style={styles.details}>
          {editMode ? (
            <>
              <p>
                <strong>Nom :</strong>
                <input
                  type="text"
                  name="nom"
                  value={profile.nom}
                  onChange={handleChange}
                  style={styles.input}
                />
              </p>
              <p>
                <strong>Prénom :</strong>
                <input
                  type="text"
                  name="prenom"
                  value={profile.prenom}
                  onChange={handleChange}
                  style={styles.input}
                />
              </p>
              <p>
                <strong>E-mail :</strong>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </p>
            </>
          ) : (
            <>
              <p><strong>Nom :</strong> {profile.nom}</p>
              <p><strong>Prénom :</strong> {profile.prenom}</p>
              <p><strong>E-mail :</strong> {profile.email}</p>
            </>
          )}
          <p><strong>Rôle :</strong> {profile.role}</p>
        </div>
      </div>
      {editMode ? (
        <div style={styles.buttonContainer}>
          <button onClick={handleSave} style={styles.btn}>Sauvegarder</button>
          <button onClick={() => setEditMode(false)} style={{ ...styles.btn, backgroundColor: '#aaa' }}>Annuler</button>
        </div>
      ) : (
        <button onClick={() => setEditMode(true)} style={styles.editBtn}>Modifier le profil</button>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '8px',
    margin: '2rem auto',
    maxWidth: '800px',
    textAlign: 'center',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    flex: '0 0 100px',
    marginRight: '1rem',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  details: {
    flex: '1',
    textAlign: 'left',
  },
  input: {
    marginLeft: '0.5rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  editBtn: {
    backgroundColor: '#007aff',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#007aff',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default ProfilePage;
