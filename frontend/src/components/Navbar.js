import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        setIsAuthenticated(true);
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error('Erreur parsing user:', e);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    // Vérifier à chaque changement de route
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Sign Pro
        </Link>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <i className={mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={mobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Accueil
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              À propos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/esignpro" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Mon espace
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Mon profil
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Connexion
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link button" onClick={() => setMobileMenuOpen(false)}>
                  S'inscrire
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
