// frontend/src/components/Auth/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthStyles.css';
import { FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';

const RegisterPage = () => {
  const { register, ROLES } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstname: '',
    lastname: '',
    role: 'ELEVE',
    companyName: '',
    acceptTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const navigate = useNavigate();

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Évaluer la force du mot de passe si c'est ce champ qui change
    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  // Évaluation de la force du mot de passe
  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  // Validation du formulaire
  const validateForm = () => {
    if (formStep === 1) {
      if (!formData.email || !formData.firstname || !formData.lastname) {
        setError("Veuillez remplir tous les champs obligatoires");
        return false;
      }
      return true;
    } else if (formStep === 2) {
      if (!formData.password || formData.password !== formData.passwordConfirm) {
        setError("Les mots de passe ne correspondent pas");
        return false;
      }
      if (passwordStrength < 2) {
        setError("Votre mot de passe est trop faible");
        return false;
      }
      return true;
    } else if (formStep === 3) {
      if (!formData.acceptTerms) {
        setError("Veuillez accepter les conditions d'utilisation");
        return false;
      }
      if (formData.role === 'ENTREPRISE' && !formData.companyName) {
        setError("Veuillez indiquer le nom de votre entreprise");
        return false;
      }
      return true;
    }
    return false;
  };

  // Gestion de la navigation entre les étapes
  const handleNextStep = () => {
    if (validateForm()) {
      setError('');
      setFormStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setFormStep(prev => prev - 1);
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Données à envoyer à l'API
      const userData = {
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        role: formData.role
      };
      
      // Ajout des données spécifiques au rôle entreprise
      if (formData.role === 'ENTREPRISE' && formData.companyName) {
        userData.companyName = formData.companyName;
      }
      
      // Appel à la fonction d'inscription du contexte
      await register(userData);
      
      // Redirection après inscription réussie
      navigate('/esignpro');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      console.error('Erreur d\'inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  // Rendu des étapes du formulaire
  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continuer
              </button>
            </div>
          </>
        );
        
        case 2:
          return (
            <>
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  
                  {/* Indicateur de force du mot de passe */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          passwordStrength === 0 ? 'bg-gray-300' :
                          passwordStrength === 1 ? 'bg-red-500' :
                          passwordStrength === 2 ? 'bg-yellow-500' :
                          passwordStrength === 3 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength * 25}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {passwordStrength === 0 && "Entrez votre mot de passe"}
                      {passwordStrength === 1 && "Mot de passe faible"}
                      {passwordStrength === 2 && "Mot de passe moyen"}
                      {passwordStrength === 3 && "Mot de passe fort"}
                      {passwordStrength === 4 && "Mot de passe très fort"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continuer
                </button>
              </div>
            </>
          );
        }}}

export default RegisterPage;