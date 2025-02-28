import React, { useState } from 'react';
import { login, getProfile } from '../services/api/userApi';
import { getUserConventions } from '../services/api/conventionApi';
import { generateEditableConvention } from '../services/api/documentApi';

function ApiTest() {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async () => {
    setIsLoading(true);
    const result = await login({ 
      email: 'test@example.com', 
      password: 'password123' 
    });
    setResults({...results, login: result});
    setIsLoading(false);
  };

  const testGetProfile = async () => {
    setIsLoading(true);
    const result = await getProfile();
    setResults({...results, profile: result});
    setIsLoading(false);
  };

  const testGetConventions = async () => {
    setIsLoading(true);
    const result = await getUserConventions();
    setResults({...results, conventions: result});
    setIsLoading(false);
  };

  const testGenerateConvention = async () => {
    setIsLoading(true);
    try {
      const pdfBlob = await generateEditableConvention();
      
      // Créer une URL pour le blob et ouvrir dans une nouvelle fenêtre
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      
      setResults({...results, generateConvention: 'PDF généré avec succès'});
    } catch (error) {
      setResults({...results, generateConvention: `Erreur: ${error.message}`});
    }
    setIsLoading(false);
  };

  return (
    <div className="api-test">
      <h1>Test des API</h1>
      <div className="test-buttons">
        <button onClick={testLogin} disabled={isLoading}>Tester Login</button>
        <button onClick={testGetProfile} disabled={isLoading}>Tester Get Profile</button>
        <button onClick={testGetConventions} disabled={isLoading}>Tester Get Conventions</button>
        <button onClick={testGenerateConvention} disabled={isLoading}>Tester Generate Convention</button>
      </div>

      {isLoading && <p>Chargement en cours...</p>}
      
      <div className="results">
        <h2>Résultats:</h2>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ApiTest;