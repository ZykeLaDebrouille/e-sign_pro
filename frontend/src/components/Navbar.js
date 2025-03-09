// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftContainer}>
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/images/logo.png'}
            alt="Logo E-Sign Pro"
            style={styles.logo}
          />
        </Link>
        <ul style={styles.navList}>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/esignpro">ESignPro</Link></li>
          {isAuthenticated && <li><Link to="/profile">Profil</Link></li>}
        </ul>
      </div>
      <div style={styles.rightContainer}>
        {isAuthenticated ? (
          <button onClick={logout} style={styles.btn}>Se déconnecter</button>
        ) : (
          <Link to="/login" style={styles.btn}>Connexion</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottom: '1px solid #ccc',
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '50px',
    marginRight: '1rem',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    margin: 0,
    padding: 0,
  },
  rightContainer: {},
  btn: {
    backgroundColor: '#007aff',
    color: '#fff',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;
