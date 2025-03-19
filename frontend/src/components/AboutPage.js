import React from 'react';
import '../styles/AboutPage.css'; // Nous allons créer ce fichier CSS

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="header-section">
        <h1 className="gradient-title">E-Sign Pro</h1>
        <div className="tagline">Simplifiez vos conventions de stage</div>
      </div>

      <div className="content-section">
        <div className="feature-card">
          <div className="icon">📝</div>
          <h2>Notre mission</h2>
          <p>
            E-Sign Pro révolutionne la gestion des conventions de stage au Lycée Jean Monnet d'Annemasse. 
            Notre plateforme dématérialise entièrement le processus administratif, de la création 
            jusqu'à la signature électronique par toutes les parties.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <h3>Création simplifiée</h3>
            <p>Générez vos conventions en quelques clics et suivez leur statut en temps réel</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🔐</div>
            <h3>Signatures sécurisées</h3>
            <p>Circuit de validation électronique pour l'élève, les parents, l'entreprise et l'établissement</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <h3>100% numérique</h3>
            <p>Accessible partout, fini les documents papier et les délais d'envoi postal</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🚀</div>
            <h3>Gain de temps</h3>
            <p>Réduisez de 80% le temps consacré aux procédures administratives</p>
          </div>
        </div>

        <div className="team-section">
          <h2>L'équipe derrière E-Sign Pro</h2>
          <p>
            Développée par Salomon et Enes, notre application est née d'un constat simple : 
            la gestion papier des conventions est chronophage et source d'erreurs. 
            Notre solution connecte efficacement tous les acteurs du stage dans une 
            interface moderne inspirée des meilleurs standards de l'UX design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
