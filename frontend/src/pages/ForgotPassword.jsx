import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Icônes SVG
const Icons = {
  mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  ),
  check: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  arrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  lock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
};

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="forgot-page">
        <div className="forgot-container success-container">
          <div className="success-icon">
            <Icons.check />
          </div>
          <h2>Email envoyé !</h2>
          <p>Un lien de réinitialisation a été envoyé à <strong>{email}</strong></p>
          <div className="success-info">
            <p>Vérifiez votre boîte de réception (et vos spams). Le lien expire dans 1 heure.</p>
          </div>
          <button className="btn-primary" onClick={() => onNavigate('login')}>
            Retour à la connexion
          </button>
        </div>

        <style>{`
          .forgot-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            padding: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }

          .forgot-container {
            background: white;
            border-radius: 32px;
            padding: 48px 40px;
            width: 100%;
            max-width: 460px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .success-icon {
            margin-bottom: 24px;
          }

          .success-icon svg {
            width: 64px;
            height: 64px;
          }

          h2 {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 12px;
          }

          .forgot-container p {
            color: #64748b;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 20px;
          }

          .success-info {
            background: #f8fafc;
            border-radius: 16px;
            padding: 16px;
            margin: 20px 0;
          }

          .success-info p {
            margin-bottom: 0;
            font-size: 13px;
            color: #475569;
          }

          .btn-primary {
            width: 100%;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            border: none;
            padding: 14px;
            border-radius: 14px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
          }

          @media (max-width: 480px) {
            .forgot-container {
              padding: 32px 24px;
            }
            h2 {
              font-size: 24px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <div className="forgot-header">
          <button className="back-btn" onClick={() => onNavigate('login')}>
            <Icons.arrowLeft />
            <span>Retour</span>
          </button>
          <div className="header-icon">
            <Icons.lock />
          </div>
          <h1>Mot de passe oublié ?</h1>
          <p className="subtitle">
            Ne vous inquiétez pas ! Entrez votre email ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label>Adresse email</label>
            <div className="input-icon">
              <Icons.mail />
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </button>
        </form>

        <div className="forgot-footer">
          <button onClick={() => onNavigate('login')} className="link-btn">
            Retour à la connexion
          </button>
        </div>
      </div>

      <style>{`
        .forgot-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .forgot-container {
          background: white;
          border-radius: 32px;
          padding: 48px 40px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .forgot-header {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }

        .back-btn {
          position: absolute;
          left: 0;
          top: 0;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #f59e0b;
        }

        .back-btn svg {
          width: 16px;
          height: 16px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: #fef3c7;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .header-icon svg {
          width: 32px;
          height: 32px;
          stroke: #f59e0b;
        }

        h1 {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
        }

        .forgot-form {
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

        .input-icon {
          display: flex;
          align-items: center;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 0 14px;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .input-icon:focus-within {
          border-color: #f59e0b;
          background: white;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .input-icon svg {
          width: 18px;
          height: 18px;
          stroke: #94a3b8;
          flex-shrink: 0;
        }

        .input-icon input {
          width: 100%;
          padding: 12px 12px;
          border: none;
          background: none;
          font-size: 14px;
          outline: none;
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

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

        .forgot-footer {
          text-align: center;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
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

        @media (max-width: 480px) {
          .forgot-container {
            padding: 32px 24px;
          }

          h1 {
            font-size: 24px;
          }

          .header-icon {
            width: 56px;
            height: 56px;
          }

          .header-icon svg {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;