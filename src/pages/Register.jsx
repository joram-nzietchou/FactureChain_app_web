import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', eneoNumber: '', password: '' });
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) onNavigate('dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '32px', borderRadius: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Créer un compte</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nom complet" onChange={(e) => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb' }} required />
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb' }} required />
          <input type="tel" placeholder="Téléphone" onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb' }} required />
          <input type="text" placeholder="Numéro ENEO" onChange={(e) => setFormData({...formData, eneoNumber: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb' }} required />
          <input type="password" placeholder="Mot de passe" onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1.5px solid #e5e7eb' }} required />
          <button type="submit" style={{ width: '100%', background: '#16a344', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '600' }}>{loading ? 'Inscription...' : "S'inscrire"}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Déjà un compte ? <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: '#16a344' }}>Se connecter</button></p>
      </div>
    </div>
  );
};

export default Register;