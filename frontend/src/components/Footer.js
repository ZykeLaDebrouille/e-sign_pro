// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '1rem',
        textAlign: 'center',
        borderTop: '1px solid #ccc',
        marginTop: '2rem'
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} E-Sign Pro. Tous droits réservés.
      </p>
      <p style={{ margin: 0 }}>
        <a href="/contact" style={{ textDecoration: 'none', color: '#333', marginRight: '1rem' }}>
          Contact
        </a>
        <a href="/about" style={{ textDecoration: 'none', color: '#333' }}>
          À propos
        </a>
      </p>
    </footer>
  );
};

export default Footer;
