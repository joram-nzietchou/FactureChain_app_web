import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
          </div>
          <h1 className="auth-title">FactureChain</h1>
          <p className="auth-subtitle">Vérifiez vos factures ENEO</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox" /> Se souvenir de moi
            </label>
            <button
              type="button"
              className="forgot-link"
              onClick={() => onNavigate('forgot-password')}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <button onClick={() => onNavigate('register')} className="link-btn">
              S'inscrire
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .auth-container {
          background: white;
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo-box {
          width: 60px;
          height: 60px;
          background: #16a344;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .auth-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
        }
        .auth-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        .form-group input {
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
        }
        .form-group input:focus {
          outline: none;
          border-color: #16a344;
        }
        .password-input {
          position: relative;
        }
        .password-input input {
          width: 100%;
          padding-right: 48px;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          cursor: pointer;
        }
        .forgot-link {
          background: none;
          border: none;
          color: #16a344;
          cursor: pointer;
          font-weight: 500;
        }
        .error-message {
          background: #fef2f2;
          color: #ef4444;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          text-align: center;
        }
        .btn-auth {
          background: #16a344;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-auth:hover {
          background: #0e7a31;
        }
        .btn-auth:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
          color: #6b7280;
        }
        .link-btn {
          background: none;
          border: none;
          color: #16a344;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Login;