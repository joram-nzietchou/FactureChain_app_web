import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Icônes SVG
const Icons = {
  user: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-10 7L2 7"/>
    </svg>
  ),
  phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  location: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  badge: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  lock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  warning: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
};

const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subscriberNumber: '',
    password: '',
    confirmPassword: '',
    city: 'Yaoundé',
    district: 'Mvog-Mbi'
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Le nom complet est requis');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Email invalide');
      return false;
    }
    if (!formData.phone.match(/^[0-9]{9}$/)) {
      setError('Téléphone invalide (9 chiffres)');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.subscriberNumber.match(/^ENEO[0-9]{9}$/)) {
      setError('Numéro ENEO invalide (ex: ENEO123456789)');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const prevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subscriberNumber: formData.subscriberNumber,
          password: formData.password,
          city: formData.city,
          district: formData.district
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
        }
        // Rediriger vers la page d'accueil après inscription
        onNavigate('home');
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de contacter le serveur. Vérifiez que le backend est démarré sur le port 3001');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <button className="back-btn" onClick={() => onNavigate('login')}>
            <span>←</span>
          </button>
          <h1>Créer un compte</h1>
          <p className="register-subtitle">Rejoignez LUMINA et protégez votre consommation électrique</p>
        </div>

        <div className="stepper">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span>Informations</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span>Vérification</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <Icons.warning />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={nextStep}>
            <div className="form-group">
              <label>Nom complet</label>
              <div className="input-icon">
                <Icons.user />
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <div className="input-icon">
                <Icons.mail />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@email.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <div className="input-icon">
                <Icons.phone />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="690000000"
                  required
                />
              </div>
              <small>9 chiffres (ex: 690000000)</small>
            </div>
            <div className="form-group">
              <label>Ville</label>
              <div className="input-icon">
                <Icons.location />
                <select name="city" value={formData.city} onChange={handleChange}>
                  <option>Yaoundé</option>
                  <option>Douala</option>
                  <option>Garoua</option>
                  <option>Bamenda</option>
                  <option>Bafoussam</option>
                  <option>Maroua</option>
                  <option>Ngaoundéré</option>
                  <option>Bertoua</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Quartier (optionnel)</label>
              <div className="input-icon">
                <Icons.location />
                <input
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Votre quartier"
                />
              </div>
            </div>
            <button type="submit" className="btn-next">
              Continuer
              <Icons.arrowRight />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Numéro abonné ENEO</label>
              <div className="input-icon">
                <Icons.badge />
                <input
                  name="subscriberNumber"
                  value={formData.subscriberNumber}
                  onChange={handleChange}
                  placeholder="ENEO123456789"
                  required
                />
              </div>
              <small>Format: ENEO suivi de 9 chiffres (ex: ENEO123456789)</small>
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-icon">
                <Icons.lock />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <small>Minimum 6 caractères</small>
            </div>
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div className="input-icon">
                <Icons.lock />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Informations de sécurité */}
            <div className="security-info">
              <Icons.shield />
              <div className="security-text">
                <strong>Données sécurisées</strong>
                <p>Vos informations sont protégées et votre consommation sera enregistrée sur la blockchain Polygon.</p>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-back" onClick={prevStep}>
                Retour
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Inscription en cours...' : "S'inscrire"}
              </button>
            </div>
          </form>
        )}

        <div className="register-footer">
          <p>
            Déjà un compte ?{' '}
            <button onClick={() => onNavigate('login')} className="link-btn">
              Se connecter
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .register-container {
          background: white;
          border-radius: 32px;
          padding: 40px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .back-btn {
          position: absolute;
          left: 24px;
          top: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #f1f5f9;
        }

        .register-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .register-subtitle {
          font-size: 13px;
          color: #64748b;
        }

        .stepper {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #64748b;
        }

        .step.active .step-circle {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
        }

        .step span {
          font-size: 12px;
          color: #94a3b8;
        }

        .step.active span {
          color: #f59e0b;
          font-weight: 600;
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 12px;
          margin-bottom: 25px;
        }

        .step-line.active {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
        }

        .error-message {
          background: #fef2f2;
          color: #ef4444;
          padding: 12px 16px;
          border-radius: 14px;
          margin-bottom: 24px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #fecaca;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
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

        .input-icon input, .input-icon select {
          width: 100%;
          padding: 12px 12px;
          border: none;
          background: none;
          font-size: 14px;
          outline: none;
        }

        .input-icon select {
          cursor: pointer;
        }

        .form-group small {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 6px;
        }

        .btn-next {
          width: 100%;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-next:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .security-info {
          background: #fef3c7;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          gap: 14px;
          margin-bottom: 24px;
        }

        .security-info svg {
          width: 24px;
          height: 24px;
          stroke: #f59e0b;
          flex-shrink: 0;
        }

        .security-text strong {
          display: block;
          font-size: 13px;
          color: #f59e0b;
          margin-bottom: 4px;
        }

        .security-text p {
          font-size: 12px;
          color: #92400e;
          line-height: 1.4;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .btn-back {
          flex: 1;
          background: white;
          border: 1.5px solid #f59e0b;
          color: #f59e0b;
          padding: 14px;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: #fef3c7;
        }

        .btn-submit {
          flex: 2;
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

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-footer {
          text-align: center;
          margin-top: 24px;
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

        @media (max-width: 640px) {
          .register-container {
            padding: 32px 24px;
          }

          .register-header h1 {
            font-size: 24px;
          }

          .back-btn {
            left: 16px;
            top: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;