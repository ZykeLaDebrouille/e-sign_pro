// src/components/ContactPage.jsx
import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre message !');
    setFormData({ name: '', email: '', message: '' });
  };
  
  return (
    <div className="contact-page">
      <h1>Contactez-nous</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Nom :
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Email :
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Message :
          <textarea name="message" value={formData.message} onChange={handleChange} required style={{ minHeight: '100px' }}></textarea>
        </label>
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
