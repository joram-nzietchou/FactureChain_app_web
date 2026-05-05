import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onNavigate('dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '400px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '50px', height: '50px', background: '#16a344', borderRadius: '12px', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>FactureChain</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Vérifiez vos factures ENEO</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px' }}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px' }}
            required
          />
          
          {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
          
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#16a344', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: '#16a344', fontWeight: '500', cursor: 'pointer' }}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;