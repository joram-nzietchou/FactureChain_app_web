import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState({
    connected: false,
    network: 'Polygon Amoy',
    lastBlock: null
  });
  const [nextBlockchainId, setNextBlockchainId] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadClaimStats();
    checkBlockchainStatus();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      if (response.success) {
        setDashboardData(response.data);
        setHistory(response.data.history || []);
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClaimStats = async () => {
    try {
      const response = await claimService.getClaimStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const checkBlockchainStatus = async () => {
    try {
      const response = await api.getNextBlockchainId();
      if (response && response.success) {
        setBlockchainStatus({
          connected: true,
          network: 'Polygon Amoy',
          lastBlock: response.id ? parseInt(response.id) - 1 : 0
        });
        setNextBlockchainId(response.id);
      } else {
        setBlockchainStatus(prev => ({ ...prev, connected: false }));
      }
    } catch (error) {
      console.error('Erreur connexion blockchain:', error);
      setBlockchainStatus(prev => ({ ...prev, connected: false }));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Chargement des données...</div>
      </div>
    );
  }

  const currentConsumption = dashboardData?.currentConsumption || {
    consumptionKwh: 18700,
    eneoAmount: 23400,
    status: 'anomaly'
  };

  const zoneStats = dashboardData?.zoneStats || {
    activeClaims: 47,
    overcharges: 28,
    readingErrors: 12,
    resolutions: 35
  };

  const anomalyPercentage = ((currentConsumption.eneoAmount - currentConsumption.consumptionKwh * 1.2) / currentConsumption.eneoAmount * 100).toFixed(0);
  const overchargeAmount = (currentConsumption.eneoAmount - currentConsumption.consumptionKwh * 1.2).toFixed(0);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .dashboard-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
        }
        .dashboard-header p {
          color: #6b7280;
          margin-top: 4px;
          font-size: 14px;
        }
        .header-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .blockchain-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${blockchainStatus.connected ? '#e8f7ee' : '#fef2f2'};
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 13px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          background: ${blockchainStatus.connected ? '#16a344' : '#ef4444'};
          border-radius: 50%;
          animation: ${blockchainStatus.connected ? 'pulse 2s infinite' : 'none'};
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .status-text {
          color: ${blockchainStatus.connected ? '#16a344' : '#ef4444'};
          font-weight: 500;
        }
        .claim-btn {
          background: #16a344;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }
        .claim-btn:hover {
          background: #0e7a31;
          transform: translateY(-2px);
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        .metric-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }
        .metric-card.anomaly {
          background: #fef2f2;
          border: 1px solid #fca5a5;
        }
        .metric-icon {
          font-size: 40px;
        }
        .metric-content {
          flex: 1;
        }
        .metric-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .metric-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }
        .metric-card.anomaly .metric-value {
          color: #ef4444;
        }
        .metric-sub {
          display: block;
          font-size: 11px;
          color: #6b7280;
          margin-top: 8px;
        }
        .history-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .history-header h2 {
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .blockchain-badge {
          background: #e8f7ee;
          color: #16a344;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
        }
        .history-table th, .history-table td {
          padding: 14px 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .history-table th {
          color: #6b7280;
          font-weight: 600;
          font-size: 12px;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }
        .status-badge.normal {
          background: #e8f7ee;
          color: #0e7a31;
        }
        .status-badge.anomaly {
          background: #fef2f2;
          color: #ef4444;
        }
        .action-btn {
          background: none;
          border: none;
          color: #16a344;
          cursor: pointer;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .action-btn:hover {
          background: #e8f7ee;
        }
        .zone-stats {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .zone-stats h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .stat-item {
          text-align: center;
          padding: 16px;
          background: #f9fafb;
          border-radius: 16px;
          transition: transform 0.2s;
        }
        .stat-item:hover {
          transform: translateY(-2px);
        }
        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 800;
          color: #16a344;
        }
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 8px;
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }
        .btn-primary, .btn-secondary {
          padding: 14px;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
          font-size: 14px;
        }
        .btn-primary {
          background: #16a344;
          color: white;
        }
        .btn-primary:hover {
          background: #0e7a31;
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: white;
          border: 1.5px solid #16a344;
          color: #16a344;
        }
        .btn-secondary:hover {
          background: #e8f7ee;
          transform: translateY(-2px);
        }
        .footer-note {
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
          padding: 16px;
          background: #f9fafb;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        @media (max-width: 768px) {
          .dashboard { padding: 16px; }
          .metrics { grid-template-columns: 1fr; gap: 12px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .actions { grid-template-columns: 1fr; }
          .history-table { font-size: 12px; }
          .history-table th, .history-table td { padding: 10px 8px; }
          .history-table { display: block; overflow-x: auto; }
        }
      `}</style>

      <div className="dashboard-header">
        <div>
          <h1>Dashboard Consommation</h1>
          <p>Bienvenue, {user?.fullName || 'Utilisateur'} 👋</p>
        </div>
        <div className="header-actions">
          <button 
            className="reading-btn" 
            onClick={() => onNavigate('meter-reading')}
            style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
          >
            📊 Relevé compteur
          </button>
          <button className="claim-btn" onClick={() => onNavigate('reclamation')}>
            📝 Nouvelle réclamation
          </button>
<button 
  className="history-btn" 
  onClick={() => onNavigate('blockchain-history')}
  style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
>
  🏛️ Historique Blockchain
</button>
</div>
      </div>

      <div className="metrics">
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <span className="metric-label">Consommation Blockchain</span>
            <span className="metric-value">{currentConsumption.consumptionKwh.toLocaleString()} kWh</span>
            <span className="metric-sub">Dernier relevé: 10/04/2026</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📄</div>
          <div className="metric-content">
            <span className="metric-label">Montant Facturé ENEO</span>
            <span className="metric-value">{currentConsumption.eneoAmount.toLocaleString()} FCFA</span>
            <span className="metric-sub">Facture de juillet 2025</span>
          </div>
        </div>
        <div className="metric-card anomaly">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <span className="metric-label">Surfacturation détectée</span>
            <span className="metric-value">+{anomalyPercentage}%</span>
            <span className="metric-sub">Soit {parseFloat(overchargeAmount).toLocaleString()} FCFA de trop</span>
          </div>
        </div>
      </div>

      <div className="history-section">
        <div className="history-header">
          <h2>
            📊 Historique des consommations (blockchain)
            <span className="blockchain-badge">🔗 Preuve infalsifiable</span>
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Consommation (kWh)</th>
                <th>Montant ENEO (FCFA)</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 6).map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                  <td>{item.consumptionKwh.toLocaleString()}</td>
                  <td>{item.eneoAmount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${item.status || 'normal'}`}>
                      {item.status === 'anomaly' ? '⚠ Anomalie' : '✓ Normal'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => {
                        if (item.status === 'anomaly') {
                          onNavigate('reclamation');
                        } else {
                          alert(`Consommation du ${new Date(item.date).toLocaleDateString('fr-FR')}: ${item.consumptionKwh.toLocaleString()} kWh`);
                        }
                      }}
                    >
                      {item.status === 'anomaly' ? 'Contester' : 'Voir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              Aucune donnée d'historique disponible
            </div>
          )}
        </div>
      </div>

      <div className="zone-stats">
        <h3>
          📍 Anomalies dans votre zone
          <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6b7280' }}>
            (Yaoundé - Mvog-Mbi)
          </span>
        </h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{zoneStats.activeClaims}</span>
            <span className="stat-label">Réclamations actives</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{zoneStats.overcharges}</span>
            <span className="stat-label">Surfacturations</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{zoneStats.readingErrors}</span>
            <span className="stat-label">Erreurs de relevé</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{zoneStats.resolutions}</span>
            <span className="stat-label">Résolutions ce mois</span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="zone-stats">
          <h3>📈 Mes statistiques</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.total || 0}</span>
              <span className="stat-label">Total réclamations</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.resolved || 0}</span>
              <span className="stat-label">Résolues</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.pending || 0}</span>
              <span className="stat-label">En cours</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.rate || 0}%</span>
              <span className="stat-label">Taux de résolution</span>
            </div>
          </div>
        </div>
      )}

      <div className="actions">
        <button className="btn-primary" onClick={() => onNavigate('reclamation')}>
          📝 Nouvelle réclamation
        </button>
        <button className="btn-secondary" onClick={() => onNavigate('suivi')}>
          🔍 Suivre ma réclamation
        </button>
      </div>

      <div className="footer-note">
        <span>🔗</span>
        Données enregistrées sur blockchain Polygon — Preuve légale infalsifiable
        {blockchainStatus.connected && contractAddress && (
          <span style={{ marginLeft: '8px', fontSize: '10px' }}>
            • Contrat: {contractAddress.substring(0, 10)}...
          </span>
        )}
      </div>
    </div>
  );
};

export default Dashboard;