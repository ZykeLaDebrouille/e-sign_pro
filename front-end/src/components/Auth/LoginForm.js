import React, { useState } from "react";
import axios from "axios";

function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Remplacez l’URL par celle de votre backend
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
        rememberMe,
      });
      
      // Traitement de la réponse
      console.log("Réponse du serveur:", response.data);
      // Ex: redirection vers la page d’accueil, stockage du token, etc.
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Une erreur est survenue");
      } else {
        setErrorMessage("Impossible de se connecter, veuillez réessayer.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="options-group">
          <div className="remember-me">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Se souvenir de moi</label>
          </div>
          <a href="#!">Mot de passe oublié ?</a>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="btn-primary">
          Se connecter
        </button>
      </form>

      <p className="switch-auth">
        Pas encore de compte ?{" "}
        <button onClick={onSwitchToRegister} className="link-button">
          S’inscrire
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
