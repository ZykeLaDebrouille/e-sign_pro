import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      <div className="logo font-bold text-xl">MonSite</div>
      <ul className="flex space-x-4">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/esignpro">E-Sign Pro</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/about">À propos</Link></li>
        {user ? (
          <>
            <li>Bonjour, {user.username}</li>
            <li>
              <button onClick={handleLogout} className="bg-red-600 px-2 py-1 rounded">
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login">Connexion</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
