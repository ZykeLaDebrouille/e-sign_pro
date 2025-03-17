import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCommentAlt, FaMapMarkerAlt, FaClock, FaBuilding } from 'react-icons/fa';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null,
    loading: false
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitted: false, error: null, loading: true });
    
    // Simulation d'un envoi de formulaire
    setTimeout(() => {
      // Validation simple
      if (!formData.name || !formData.email || !formData.message) {
        setFormStatus({
          submitted: false,
          error: "Veuillez remplir tous les champs obligatoires.",
          loading: false
        });
        return;
      }
      
      // Réussite simulée
      setFormStatus({
        submitted: true,
        error: null,
        loading: false
      });
      
      // Réinitialiser le formulaire après succès
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Faire disparaître le message de succès après 5 secondes
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Notre équipe est à votre écoute pour toute question concernant E-Sign PRO</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <h2>Informations de contact</h2>
          
          <div className="info-card">
            <div className="info-item">
              <FaBuilding className="info-icon" />
              <div>
                <h3>E-Sign PRO</h3>
                <p>Solution de signature électronique pour conventions de stage</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h3>Adresse</h3>
                <p>51 Rue de Seine</p>
                <p>75006 Paris, France</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaPhone className="info-icon" />
              <div>
                <h3>Téléphone</h3>
                <p>+33 (0)1 23 45 67 89</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <h3>Email</h3>
                <p>contact@esignpro.fr</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <h3>Horaires</h3>
                <p>Lundi - Vendredi: 9h00 - 18h00</p>
                <p>Weekend: Fermé</p>
              </div>
            </div>
          </div>
          
          <div className="contact-map">
            <div className="map-placeholder">
              <FaMapMarkerAlt className="map-marker" />
              <span>E-Sign PRO</span>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <div className="form-header">
            <h2>Envoyez-nous un message</h2>
            <p>Remplissez le formulaire ci-dessous et nous vous répondrons dans les meilleurs délais.</p>
          </div>
          
          {formStatus.submitted && (
            <div className="form-success">
              Votre message a bien été envoyé. Merci de nous avoir contactés !
            </div>
          )}
          
          {formStatus.error && (
            <div className="form-error">
              {formStatus.error}
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser className="input-icon" />
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Votre email"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone className="input-icon" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Votre numéro (optionnel)"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">
                  <FaCommentAlt className="input-icon" />
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Objet de votre message"
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Détaillez votre demande ici..."
                rows="5"
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={formStatus.loading}
            >
              {formStatus.loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
