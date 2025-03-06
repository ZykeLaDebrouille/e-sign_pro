// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.9)' }}>
      {/* Logo */}
      <div style={{ marginRight: '2rem' }}>
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/images/logo.png'}
            alt="Logo E-Sign Pro"
            style={{ height: '50px' }}
          />
        </Link>
      </div>

      {/* Liens de navigation */}
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0, padding: 0 }}>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/about">À propos</Link></li>
        <li><Link to="/esignpro">ESignPro</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
