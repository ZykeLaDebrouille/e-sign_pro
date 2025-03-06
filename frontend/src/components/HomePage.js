// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Bienvenue sur E-Sign Pro</h1>
      <p>
        Découvrez notre solution de signature électronique moderne et sécurisée. 
        Simplifiez la gestion de vos documents et signez en toute sérénité.
      </p>
      <Link
        to="/esignpro"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none'
        }}
      >
        Accéder à ESignPro
      </Link>
    </div>
  );
};

export default HomePage;
