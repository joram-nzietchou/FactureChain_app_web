import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

// Icônes SVG
const Icons = {
  reading: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  claim: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  blockchain: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  user: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  link: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
};

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [billStats, setBillStats] = useState(null);
  const [lastBill, setLastBill] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState({
    connected: false,
    network: 'Polygon Amoy',
    lastBlock: null
  });
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 5;

  useEffect(() => {
    loadDashboardData();
    loadBillHistory();
    loadBillStats();
    checkBlockchainStatus();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBillHistory = async () => {
    try {
      const response = await api.getBillHistory();
      if (response.success) {
        setBills(response.data.bills || []);
        if (response.data.bills && response.data.bills.length > 0) {
          setLastBill(response.data.bills[0]);
        }
      }
    } catch (error) {
      console.error('Erreur chargement factures:', error);
    }
  };

  const loadBillStats = async () => {
    try {
      const response = await api.getBillStats();
      if (response.success) {
        setBillStats(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats factures:', error);
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
      } else {
        setBlockchainStatus(prev => ({ ...prev, connected: false }));
      }
    } catch (error) {
      console.error('Erreur connexion blockchain:', error);
      setBlockchainStatus(prev => ({ ...prev, connected: false }));
    }
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'anomaly') return bill.isAnomaly;
    if (filter === 'normal') return !bill.isAnomaly;
    return true;
  });

  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Chargement des données...</div>
      </div>
    );
  }

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
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .reading-btn, .claim-btn, .history-chain-btn, .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          border: none;
          font-size: 14px;
        }
        .reading-btn svg, .claim-btn svg, .history-chain-btn svg, .profile-btn svg {
          width: 18px;
          height: 18px;
        }
        .reading-btn {
          background: #8b5cf6;
          color: white;
        }
        .reading-btn:hover {
          background: #7c3aed;
          transform: translateY(-2px);
        }
        .claim-btn {
          background: #16a344;
          color: white;
        }
        .claim-btn:hover {
          background: #0e7a31;
          transform: translateY(-2px);
        }
        .history-chain-btn {
          background: #6b7280;
          color: white;
        }
        .history-chain-btn:hover {
          background: #4b5563;
          transform: translateY(-2px);
        }
        .profile-btn {
          background: #2563eb;
          color: white;
        }
        .profile-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
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
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .stat-card .value {
          font-size: 28px;
          font-weight: 800;
          color: #16a344;
        }
        .stat-card .label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 8px;
        }
        .bills-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .bills-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .bills-header h2 {
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-buttons {
          display: flex;
          gap: 8px;
        }
        .filter-btn {
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: #16a344;
          color: white;
          border-color: #16a344;
        }
        .bills-table {
          width: 100%;
          border-collapse: collapse;
        }
        .bills-table th, .bills-table td {
          padding: 14px 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .bills-table th {
          color: #6b7280;
          font-weight: 600;
          font-size: 12px;
        }
        .amount-cell {
          font-weight: 600;
          color: #16a344;
        }
        .anomaly-cell {
          color: #ef4444;
          font-weight: 600;
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
        .pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }
        .page-btn {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn.active {
          background: #16a344;
          color: white;
          border-color: #16a344;
        }
        .page-btn:hover:not(.active) {
          background: #f3f4f6;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
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
          .stats-cards { grid-template-columns: repeat(2, 1fr); }
          .bills-table { font-size: 12px; }
          .bills-table th, .bills-table td { padding: 8px; }
          .bills-table { display: block; overflow-x: auto; }
          .header-actions { flex-direction: column; width: 100%; }
          .reading-btn, .claim-btn, .history-chain-btn, .profile-btn { width: 100%; justify-content: center; }
          .filter-buttons { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue, {user?.fullName || user?.email?.split('@')[0] || 'Utilisateur'}</p>
        </div>
        <div className="header-actions">
          <button className="reading-btn" onClick={() => onNavigate('meter-reading')}>
            <Icons.reading />
            <span>Nouveau relevé</span>
          </button>
          <button className="claim-btn" onClick={() => onNavigate('reclamation')}>
            <Icons.claim />
            <span>Nouvelle réclamation</span>
          </button>
          <button className="history-chain-btn" onClick={() => onNavigate('blockchain-history')}>
            <Icons.blockchain />
            <span>Historique blockchain</span>
          </button>
          <button className="profile-btn" onClick={() => onNavigate('profile')}>
            <Icons.user />
            <span>Mon profil</span>
          </button>
          <div className="blockchain-status">
            <div className="status-dot"></div>
            <Icons.link />
            <span className="status-text">
              {blockchainStatus.connected ? `Blockchain connectée` : 'Blockchain déconnectée'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {billStats && (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="value">{billStats.totalBills || 0}</div>
            <div className="label">Factures émises</div>
          </div>
          <div className="stat-card">
            <div className="value">{billStats.totalAmount?.toLocaleString() || 0} FCFA</div>
            <div className="label">Montant total</div>
          </div>
          <div className="stat-card">
            <div className="value">{billStats.anomalyCount || 0}</div>
            <div className="label">Anomalies détectées</div>
          </div>
          <div className="stat-card">
            <div className="value">{billStats.anomalyRate || 0}%</div>
            <div className="label">Taux d'anomalie</div>
          </div>
        </div>
      )}

      {/* Historique des factures */}
      <div className="bills-section">
        <div className="bills-header">
          <h2>
            <Icons.dashboard />
            Historique des factures
            <span className="status-badge normal">{bills.length} factures</span>
          </h2>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => { setFilter('all'); setCurrentPage(1); }}
            >
              Toutes
            </button>
            <button 
              className={`filter-btn ${filter === 'anomaly' ? 'active' : ''}`}
              onClick={() => { setFilter('anomaly'); setCurrentPage(1); }}
            >
              Anomalies
            </button>
            <button 
              className={`filter-btn ${filter === 'normal' ? 'active' : ''}`}
              onClick={() => { setFilter('normal'); setCurrentPage(1); }}
            >
              Normales
            </button>
          </div>
        </div>

        {currentBills.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="bills-table">
                <thead>
                  <tr>
                    <th>Période</th>
                    <th>Consommation</th>
                    <th>Montant facturé</th>
                    <th>Montant attendu</th>
                    <th>Différence</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBills.map((bill, index) => (
                    <tr key={index}>
                      <td>{bill.period}</td>
                      <td>{bill.consumption} kWh</td>
                      <td className="amount-cell">{bill.eneoAmount.toLocaleString()} FCFA</td>
                      <td>{bill.expectedAmount.toLocaleString()} FCFA</td>
                      <td className={bill.isAnomaly ? 'anomaly-cell' : 'amount-cell'}>
                        {bill.difference > 0 ? '+' : ''}{bill.difference.toLocaleString()} FCFA
                      </td>
                      <td>
                        <span className={`status-badge ${bill.isAnomaly ? 'anomaly' : 'normal'}`}>
                          {bill.isAnomaly ? '⚠ Anomalie' : '✓ Normal'}
                        </span>
                      </td>
                      <td>
                        {bill.isAnomaly && (
                          <button 
                            className="action-btn"
                            onClick={() => onNavigate('reclamation')}
                          >
                            Contester
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>Aucune facture trouvée</p>
            <button 
              onClick={() => onNavigate('meter-reading')}
              style={{ marginTop: '16px', padding: '10px 20px', background: '#16a344', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Enregistrer un relevé
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-note">
        <Icons.link />
        <span>Données enregistrées sur blockchain Polygon — Preuve légale infalsifiable</span>
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