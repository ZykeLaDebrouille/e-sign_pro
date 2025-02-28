import React, { useState } from "react";
import axios from "axios";

function RegisterForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Remplacez l’URL par celle de votre backend
      const response = await axios.post("http://localhost:3001/api/auth/register", {
        email,
        password,
      });

      console.log("Réponse du serveur:", response.data);
      setSuccessMessage("Votre compte a été créé avec succès !");
      // Possibilité de rediriger automatiquement vers la page de connexion, etc.
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Une erreur est survenue");
      } else {
        setErrorMessage("Impossible de créer le compte, veuillez réessayer.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      <form onSubmit={handleRegister} className="auth-form">
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="btn-primary">
          Créer un compte
        </button>
      </form>

      <p className="switch-auth">
        Vous avez déjà un compte ?{" "}
        <button onClick={onSwitchToLogin} className="link-button">
          Se connecter
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;
