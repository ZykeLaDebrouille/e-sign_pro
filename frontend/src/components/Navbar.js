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
          <li><Link to="/" style={styles.navLink}>Accueil</Link></li>
          <li><Link to="/contact" style={styles.navLink}>Contact</Link></li>
          <li><Link to="/about" style={styles.navLink}>À propos</Link></li>
          <li><Link to="/esignpro" style={styles.navLink}>ESignPro</Link></li>
        </ul>
      </div>
      <div style={styles.rightContainer}>
        {isAuthenticated && (
          <Link to="/profile" style={styles.navLink}>Profil</Link>
        )}
        {isAuthenticated ? (
          <button onClick={logout} style={styles.navLink}>Se déconnecter</button>
        ) : (
          <Link to="/login" style={styles.navLink}>Connexion</Link>
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
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    backgroundColor: '#007aff',
    color: '#fff',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'inline-block',
  },
};

export default Navbar;
