import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onNavigate('home');  // ← Changé de 'dashboard' à 'home'
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header avec logo agrandi */}
        <div className="auth-header">
          <div className="logo-wrapper">
            <img src="/logo2.png" alt="LUMINA" className="logo-image" />
          </div>
          <p className="auth-subtitle">
            Surveillance électrique & transparence énergétique
          </p>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="3" y1="3" x2="21" y2="21" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Se souvenir de moi</span>
            </label>
            <button
              type="button"
              className="forgot-link"
              onClick={() => onNavigate('forgot-password')}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {error && (
            <div className="error-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Pied de page */}
        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <button onClick={() => onNavigate('register')} className="link-btn">
              Créer un compte
            </button>
          </p>
        </div>
      </div>

      <style>{`
        /* Reset & base */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Container principal */
        .auth-container {
          background: white;
          border-radius: 32px;
          padding: 48px 40px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease;
        }

        /* Header - Logo agrandi */
        .auth-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 1px;
        }

        .logo-image {
          width: 140px;
          height: 140px;
          object-fit: contain;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.1));
          transition: transform 0.3s ease;
        }

        .logo-image:hover {
          transform: scale(1.02);
        }

        .auth-subtitle {
          font-size: 13px;
          color: #64748b;
          margin-top: 8px;
        }

        /* Formulaire */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .form-group input {
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: #f8fafc;
        }

        .form-group input:focus {
          outline: none;
          border-color: #f59e0b;
          background: white;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        /* Champ mot de passe avec toggle */
        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper input {
          width: 100%;
          padding-right: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #f59e0b;
        }

        /* Options (checkbox + mot de passe oublié) */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #f59e0b;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #f59e0b;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #d97706;
        }

        /* Message d'erreur */
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #fecaca;
        }

        /* Bouton principal */
        .btn-auth {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-auth:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .btn-auth:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Spinner de chargement */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Pied de page */
        .auth-footer {
          text-align: center;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
          font-size: 13px;
          color: #64748b;
        }

        .link-btn {
          background: none;
          border: none;
          color: #f59e0b;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }

        .link-btn:hover {
          color: #d97706;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .auth-container {
            padding: 32px 24px;
          }

          .logo-image {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;