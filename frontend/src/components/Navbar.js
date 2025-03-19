import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logoutUser, loading, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logoutUser();
  };

  console.log("État d'authentification dans Navbar:", { currentUser, loading });

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Sign Pro
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Accueil
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              C'est quoi ?
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
          
          {loading ? (
            <li className="nav-item">
              <span className="nav-link">Chargement...</span>
            </li>
          ) : currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/esignpro" className="nav-link">
                  Mon espace
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  {currentUser.firstname || 'Mon Profil'}
                </Link>
              </li>
              <li className="nav-item">
                <button 
                  onClick={handleLogout} 
                  className="nav-link logout-button"
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/register" className="nav-link button">
                  Se connecter
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
