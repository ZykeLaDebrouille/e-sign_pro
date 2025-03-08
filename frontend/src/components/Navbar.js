// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Chemin correct ?

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navLeft}>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/about">À propos</Link></li>
        <li><Link to="/esignpro">ESignPro</Link></li>
      </ul>
      <ul style={styles.navRight}>
        {isAuthenticated ? (
          <li>
            <button onClick={logout} style={styles.btn}>Se déconnecter</button>
          </li>
        ) : (
          <li>
            <Link to="/login" style={styles.btn}>Connexion</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ccc',
  },
  navLeft: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    margin: 0,
    padding: 0,
  },
  navRight: {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
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
