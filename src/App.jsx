import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Reclamation from './pages/Reclamation';
import Suivi from './pages/Suivi';

const AppContent = () => {
  const [page, setPage] = useState('login');
  const { isAuthenticated } = useAuth();

  // Redirection si non authentifié (sauf pages publiques)
  const publicPages = ['login', 'register', 'forgot-password'];
  if (!isAuthenticated && !publicPages.includes(page)) {
    setPage('login');
    return <Login onNavigate={setPage} />;
  }

  const pages = {
    login: <Login onNavigate={setPage} />,
    register: <Register onNavigate={setPage} />,
    'forgot-password': <ForgotPassword onNavigate={setPage} />,
    dashboard: <Dashboard onNavigate={setPage} />,
    reclamation: <Reclamation onNavigate={setPage} />,
    suivi: <Suivi onNavigate={setPage} />,
    profile: <Profile onNavigate={setPage} />
  };

  return pages[page] || pages.dashboard;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;