import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Icônes SVG (conservées)
const Icons = {
  user: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  mail: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>),
  phone: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  location: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  calendar: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  lock: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  edit: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3l4 4-7 7H10v-4l7-7z"/><path d="M4 20h16"/></svg>),
  save: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>),
  logout: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>),
  arrowLeft: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  stats: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  reading: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
  claim: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
  warning: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  success: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>)
};

const Profile = ({ onNavigate }) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: user?.city || 'Yaoundé',
    district: user?.district || 'Mvog-Mbi'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Charger les vraies statistiques
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await api.get('/profile/stats');
      if (response.success) {
        setStats(response.data);
      } else {
        console.error('Erreur chargement stats:', response.error);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await api.put('/profile', formData);
      if (response.success) {
        await updateProfile(formData);
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await api.post('/profile/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            <Icons.arrowLeft />
            <span>Retour</span>
          </button>
          <h1>Mon profil</h1>
        </div>

        <div className="profile-cover">
          <div className="profile-avatar">
            <div className="avatar">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <h2>{user?.fullName || user?.email?.split('@')[0]}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-badge">Abonné ENEO</span>
          </div>
        </div>

        <div className="profile-tabs">
          <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
            <Icons.edit />
            <span>Informations</span>
          </button>
          <button className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Icons.lock />
            <span>Sécurité</span>
          </button>
          <button className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <Icons.stats />
            <span>Statistiques</span>
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? <Icons.success /> : <Icons.warning />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="profile-content">
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Nom complet</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Votre nom complet" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} disabled className="disabled" />
                <small>L'email ne peut pas être modifié</small>
              </div>
              <div className="form-group">
                <label>Numéro abonné ENEO</label>
                <input type="text" value={user?.subscriberNumber || ''} disabled className="disabled" />
                <small>Le numéro abonné ne peut pas être modifié</small>
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="690000000" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ville</label>
                  <select name="city" value={formData.city} onChange={handleChange}>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Douala">Douala</option>
                    <option value="Garoua">Garoua</option>
                    <option value="Bamenda">Bamenda</option>
                    <option value="Bafoussam">Bafoussam</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quartier</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Votre quartier" />
                </div>
              </div>
              <div className="form-group">
                <label>Membre depuis</label>
                <input type="text" value={formatDate(user?.createdAt)} disabled className="disabled" />
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                <Icons.save />
                <span>{loading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Entrez votre mot de passe actuel" required />
              </div>
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Minimum 6 caractères" required />
              </div>
              <div className="form-group">
                <label>Confirmer le nouveau mot de passe</label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Confirmez votre nouveau mot de passe" required />
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                <Icons.save />
                <span>{loading ? 'Changement...' : 'Changer le mot de passe'}</span>
              </button>
            </form>
          )}

          {activeTab === 'stats' && (
            <div className="stats-container">
              {statsLoading ? (
                <div className="loading-stats">Chargement des statistiques...</div>
              ) : stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <Icons.reading />
                    <div className="stat-value">{stats.totalReadings || 0}</div>
                    <div className="stat-label">Relevés effectués</div>
                  </div>
                  <div className="stat-card">
                    <Icons.claim />
                    <div className="stat-value">{stats.totalClaims || 0}</div>
                    <div className="stat-label">Réclamations</div>
                  </div>
                  <div className="stat-card">
                    <Icons.stats />
                    <div className="stat-value">{stats.totalConsumption?.toLocaleString() || 0} kWh</div>
                    <div className="stat-label">Consommation totale</div>
                  </div>
                  <div className="stat-card">
                    <Icons.stats />
                    <div className="stat-value">{stats.totalAmount?.toLocaleString() || 0} FCFA</div>
                    <div className="stat-label">Montant total</div>
                  </div>
                  <div className="stat-card">
                    <Icons.stats />
                    <div className="stat-value">{stats.averageConsumption || 0} kWh</div>
                    <div className="stat-label">Moyenne/Relevé</div>
                  </div>
                  <div className="stat-card">
                    <Icons.stats />
                    <div className="stat-value">{stats.averageBill?.toLocaleString() || 0} FCFA</div>
                    <div className="stat-label">Facture moyenne</div>
                  </div>
                  <div className="stat-card">
                    <Icons.warning />
                    <div className="stat-value">{stats.anomalyCount || 0}</div>
                    <div className="stat-label">Anomalies détectées</div>
                  </div>
                  <div className="stat-card">
                    <Icons.calendar />
                    <div className="stat-value">{stats.resolutionRate || 0}%</div>
                    <div className="stat-label">Taux de résolution</div>
                  </div>
                </div>
              ) : (
                <div className="error-stats">Impossible de charger les statistiques</div>
              )}
            </div>
          )}
        </div>

        <div className="logout-section">
          <button className="logout-btn" onClick={logout}>
            <Icons.logout />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 32px;
        }
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }
        .back-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .profile-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin: 0;
        }
        .profile-cover {
          background: white;
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          margin-bottom: 24px;
        }
        .avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #16a344 0%, #2563eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 40px;
          font-weight: bold;
          color: white;
        }
        .profile-cover h2 {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }
        .profile-email {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .profile-badge {
          display: inline-block;
          background: #e8f7ee;
          color: #16a344;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .profile-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          background: white;
          border-radius: 50px;
          padding: 6px;
        }
        .tab {
          flex: 1;
          padding: 12px 20px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          border-radius: 40px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }
        .tab.active {
          background: #16a344;
          color: white;
        }
        .tab svg {
          width: 18px;
          height: 18px;
        }
        .message {
          background: white;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .message.success {
          background: #e8f7ee;
          color: #16a344;
          border: 1px solid #86efac;
        }
        .message.error {
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fca5a5;
        }
        .profile-content {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
        }
        .profile-form {
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
        .form-group input, .form-group select {
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #16a344;
        }
        .form-group input.disabled {
          background: #f3f4f6;
          color: #6b7280;
        }
        .form-group small {
          font-size: 11px;
          color: #9ca3af;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .save-btn {
          background: #16a344;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
        }
        .save-btn:hover {
          background: #0e7a31;
        }
        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .stats-container {
          width: 100%;
        }
        .loading-stats, .error-stats {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .stat-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }
        .stat-card svg {
          width: 32px;
          height: 32px;
          stroke: #16a344;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #16a344;
        }
        .stat-label {
          font-size: 11px;
          color: #6b7280;
          margin-top: 4px;
        }
        .logout-section {
          text-align: center;
        }
        .logout-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
        }
        .logout-btn:hover {
          background: #dc2626;
        }
        @media (max-width: 640px) {
          .profile-page { padding: 16px; }
          .form-row { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr; }
          .profile-tabs { flex-wrap: wrap; border-radius: 16px; }
          .tab { border-radius: 12px; }
        }
      `}</style>
    </div>
  );
};

export default Profile;