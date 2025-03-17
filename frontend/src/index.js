import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Une erreur s'est produite</h2>
          <p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
          <button onClick={() => window.location.reload()}>
            Rafraîchir la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </ErrorBoundary>
);
