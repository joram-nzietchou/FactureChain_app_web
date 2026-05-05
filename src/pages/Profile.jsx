import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ onNavigate }) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '690000000'
  });

  const stats = [
    { label: 'Réclamations', value: '3', icon: '📋', color: '#2563eb' },
    { label: 'Résolues', value: '2', icon: '✅', color: '#16a344' },
    { label: 'En cours', value: '1', icon: '⏳', color: '#f59e0b' }
  ];

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => onNavigate('dashboard')}
          style={{ background: 'none', border: 'none', color: '#16a344', fontSize: '14px', cursor: 'pointer', marginBottom: '24px' }}
        >
          ← Retour au Dashboard
        </button>

        {/* Profile Header */}
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg, #16a344 0%, #2563eb 100%)', padding: '48px 32px 32px', textAlign: 'center', color: 'white' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'white',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#16a344'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>{user?.name || 'Utilisateur'}</h1>
            <p style={{ opacity: 0.9 }}>{user?.email}</p>
            <span style={{ display: 'inline-block', marginTop: '12px', padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '12px' }}>
              Abonné ENEO
            </span>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Informations personnelles</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{ background: 'none', border: 'none', color: '#16a344', fontWeight: '600', cursor: 'pointer' }}
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {isEditing ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nom complet</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                  />
                </div>
                <button
                  onClick={handleSave}
                  style={{ background: '#16a344', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Enregistrer les modifications
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Nom complet</span>
                  <span style={{ fontWeight: '500' }}>{user?.name || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Email</span>
                  <span style={{ fontWeight: '500' }}>{user?.email || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Téléphone</span>
                  <span style={{ fontWeight: '500' }}>{user?.phone || 'Non renseigné'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Numéro abonné ENEO</span>
                  <span style={{ fontWeight: '500' }}>{user?.subscriberNumber || 'CM-YDE-004821'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#6b7280' }}>Membre depuis</span>
                  <span style={{ fontWeight: '500' }}>{new Date(user?.createdAt || Date.now()).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={logout}
          style={{
            width: '100%',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '16px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Profile;