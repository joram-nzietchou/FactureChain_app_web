import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h2 style={{ color: '#16a344', marginBottom: '12px' }}>Email envoyé !</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Un lien de réinitialisation a été envoyé à {email}</p>
          <button onClick={() => onNavigate('login')} style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer' }}>
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '400px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Mot de passe oublié</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>Entrez votre email pour réinitialiser votre mot de passe</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1.5px solid #e5e7eb' }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#16a344', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>
        
        <button onClick={() => onNavigate('login')} style={{ width: '100%', background: 'none', border: 'none', color: '#16a344', marginTop: '16px', cursor: 'pointer' }}>
          Retour à la connexion
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;