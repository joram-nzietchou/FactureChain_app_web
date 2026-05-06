import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
      console.log('Envoi des données:', formData);
      
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
      console.log('Réponse API:', data);
      
      if (response.ok && data.success) {
        // Sauvegarder le token
        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
        }
        alert('Inscription réussie ! Bienvenue sur FactureChain');
        onNavigate('dashboard');
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
          <button className="back-btn" onClick={() => onNavigate('login')}>←</button>
          <h1>Créer un compte</h1>
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
            ❌ {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={nextStep}>
            <div className="form-group">
              <label>Nom complet *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Téléphone *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="690000000"
                required
              />
              <small>9 chiffres (ex: 690000000)</small>
            </div>
            <div className="form-group">
              <label>Ville</label>
              <select name="city" value={formData.city} onChange={handleChange}>
                <option>Yaoundé</option>
                <option>Douala</option>
                <option>Garoua</option>
                <option>Bamenda</option>
                <option>Bafoussam</option>
              </select>
            </div>
            <button type="submit" className="btn-next">Continuer →</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Numéro abonné ENEO *</label>
              <input
                name="subscriberNumber"
                value={formData.subscriberNumber}
                onChange={handleChange}
                placeholder="ENEO123456789"
                required
              />
              <small>Format: ENEO suivi de 9 chiffres (ex: ENEO123456789)</small>
            </div>
            <div className="form-group">
              <label>Mot de passe *</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <small>Minimum 6 caractères</small>
            </div>
            <div className="form-group">
              <label>Confirmer le mot de passe *</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-back" onClick={prevStep}>← Retour</button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Inscription en cours...' : "S'inscrire"}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .register-container {
          background: white;
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .register-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: white;
          font-size: 20px;
          cursor: pointer;
        }
        .register-header h1 {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
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
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .step.active .step-circle {
          background: #16a344;
          color: white;
        }
        .step span {
          font-size: 12px;
          color: #9ca3af;
        }
        .step.active span {
          color: #16a344;
          font-weight: 600;
        }
        .step-line {
          flex: 1;
          height: 2px;
          background: #e5e7eb;
          margin: 0 12px;
          margin-bottom: 25px;
        }
        .step-line.active {
          background: #16a344;
        }
        .error-message {
          background: #fef2f2;
          color: #ef4444;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 13px;
          text-align: center;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #16a344;
        }
        .form-group small {
          display: block;
          font-size: 11px;
          color: #9ca3af;
          margin-top: 5px;
        }
        .btn-next, .btn-submit {
          width: 100%;
          background: #16a344;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-next:hover, .btn-submit:hover {
          background: #0e7a31;
        }
        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .form-actions {
          display: flex;
          gap: 12px;
        }
        .btn-back {
          flex: 1;
          background: white;
          border: 1.5px solid #16a344;
          color: #16a344;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-submit {
          flex: 2;
        }
      `}</style>
    </div>
  );
};

export default Register;