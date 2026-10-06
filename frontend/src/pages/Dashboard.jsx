import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

// Icônes SVG
const Icons = {
  reading: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  claim: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  blockchain: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  user: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  link: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  ),
  home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H5a2 2 0 0 1-2-2z"/>
    </svg>
  )
};

const Dashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [billStats, setBillStats] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState({
    connected: false,
    network: 'Polygon Amoy',
    lastBlock: null
  });
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const handleLogout = async () => {
    await logout();
    onNavigate('login');
  };

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
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Navbar */
        .navbar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .navbar-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .navbar-logo:hover {
          transform: scale(1.02);
        }

        .nav-home-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .nav-home-btn:hover {
          background: #fef3c7;
          color: #f59e0b;
        }

        .navbar-brand {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .blockchain-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${blockchainStatus.connected ? '#e8f7ee' : '#fef2f2'};
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 12px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: ${blockchainStatus.connected ? '#16a344' : '#ef4444'};
          border-radius: 50%;
          animation: ${blockchainStatus.connected ? 'pulse 2s infinite' : 'none'};
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .user-menu {
          position: relative;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .user-avatar:hover {
          transform: scale(1.05);
        }

        .user-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          width: 200px;
          overflow: hidden;
          z-index: 100;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: #f1f5f9;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 4px 0;
        }

        /* Main content */
        .main-content {
          padding: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .welcome-section {
          margin-bottom: 32px;
        }

        .welcome-section h1 {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .welcome-section p {
          color: #64748b;
        }

        /* Stats cards */
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: #fef3c7;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon svg {
          stroke: #f59e0b;
        }

        .stat-info .value {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
        }

        .stat-info .label {
          font-size: 12px;
          color: #64748b;
        }

        /* Actions rapides */
        .quick-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .action-card {
          flex: 1;
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid #e2e8f0;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          border-color: #f59e0b;
        }

        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon.reading { background: #e0f2fe; }
        .action-icon.claim { background: #dcfce7; }
        .action-icon.history { background: #fef3c7; }

        .action-icon.reading svg { stroke: #0284c7; }
        .action-icon.claim svg { stroke: #16a34a; }
        .action-icon.history svg { stroke: #f59e0b; }

        .action-info h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .action-info p {
          font-size: 13px;
          color: #64748b;
        }

        /* Section factures */
        .bills-section {
          background: white;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #e2e8f0;
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
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .bills-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bills-table th, .bills-table td {
          padding: 14px 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .bills-table th {
          color: #64748b;
          font-weight: 600;
          font-size: 12px;
        }

        .amount-cell {
          font-weight: 600;
          color: #f59e0b;
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
          background: #dcfce7;
          color: #16a34a;
        }

        .status-badge.anomaly {
          background: #fef2f2;
          color: #ef4444;
        }

        .action-btn {
          background: none;
          border: none;
          color: #f59e0b;
          cursor: pointer;
          font-weight: 500;
        }

        .action-btn:hover {
          text-decoration: underline;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }

        .page-btn {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
        }

        .page-btn.active {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          color: #94a3b8;
        }

        .footer-note {
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          padding: 24px;
          border-top: 1px solid #e2e8f0;
          margin-top: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .navbar { padding: 0 16px; }
          .main-content { padding: 20px; }
          .stats-cards { grid-template-columns: repeat(2, 1fr); }
          .quick-actions { flex-direction: column; }
          .bills-table { display: block; overflow-x: auto; }
          .navbar-left { gap: 12px; }
          .nav-home-btn span { display: none; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <img 
              src="/logo2.png" 
              alt="LUMINA" 
              className="navbar-logo" 
              onClick={() => onNavigate('home')}
            />
            <button className="nav-home-btn" onClick={() => onNavigate('home')}>
              <Icons.home />
              <span>Accueil</span>
            </button>
          </div>
          <div className="navbar-right">
            <div className="blockchain-status">
              <div className="status-dot"></div>
              <span>{blockchainStatus.connected ? 'Blockchain connectée' : 'Blockchain déconnectée'}</span>
            </div>
            <div className="user-menu">
              <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              {showUserMenu && (
                <div className="user-dropdown">
                  <button className="dropdown-item" onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}>
                    <Icons.user />
                    <span>Mon profil</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <Icons.logout />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <div className="welcome-section">
          <h1>Tableau de bord</h1>
          <p>Bienvenue, {user?.fullName || user?.email?.split('@')[0] || 'Utilisateur'} 👋</p>
        </div>

        {/* Statistiques */}
        {billStats && (
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon"><Icons.dashboard /></div>
              <div className="stat-info">
                <div className="value">{billStats.totalBills || 0}</div>
                <div className="label">Factures émises</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Icons.dashboard /></div>
              <div className="stat-info">
                <div className="value">{billStats.totalAmount?.toLocaleString() || 0} FCFA</div>
                <div className="label">Montant total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Icons.dashboard /></div>
              <div className="stat-info">
                <div className="value">{billStats.anomalyCount || 0}</div>
                <div className="label">Anomalies détectées</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Icons.dashboard /></div>
              <div className="stat-info">
                <div className="value">{billStats.anomalyRate || 0}%</div>
                <div className="label">Taux d'anomalie</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="quick-actions">
          <div className="action-card" onClick={() => onNavigate('meter-reading')}>
            <div className="action-icon reading"><Icons.reading /></div>
            <div className="action-info">
              <h3>Nouveau relevé</h3>
              <p>Enregistrez votre index compteur</p>
            </div>
          </div>
          <div className="action-card" onClick={() => onNavigate('reclamation')}>
            <div className="action-icon claim"><Icons.claim /></div>
            <div className="action-info">
              <h3>Nouvelle réclamation</h3>
              <p>Contester une surfacturation</p>
            </div>
          </div>
          <div className="action-card" onClick={() => onNavigate('blockchain-history')}>
            <div className="action-icon history"><Icons.blockchain /></div>
            <div className="action-info">
              <h3>Historique blockchain</h3>
              <p>Consultez vos preuves</p>
            </div>
          </div>
        </div>

        {/* Historique des factures */}
        <div className="bills-section">
          <div className="bills-header">
            <h2>
              <Icons.dashboard />
              Historique des factures
              <span className="status-badge normal">{bills.length} factures</span>
            </h2>
            <div className="filter-buttons">
              <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => { setFilter('all'); setCurrentPage(1); }}>Toutes</button>
              <button className={`filter-btn ${filter === 'anomaly' ? 'active' : ''}`} onClick={() => { setFilter('anomaly'); setCurrentPage(1); }}>Anomalies</button>
              <button className={`filter-btn ${filter === 'normal' ? 'active' : ''}`} onClick={() => { setFilter('normal'); setCurrentPage(1); }}>Normales</button>
            </div>
          </div>

          {currentBills.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="bills-table">
                  <thead>
                    <tr><th>Période</th><th>Consommation</th><th>Montant facturé</th><th>Montant attendu</th><th>Différence</th><th>Statut</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {currentBills.map((bill, index) => (
                      <tr key={index}>
                        <td>{bill.period}</td>
                        <td>{bill.consumption} kWh</td>
                        <td className="amount-cell">{bill.eneoAmount.toLocaleString()} FCFA</td>
                        <td>{bill.expectedAmount.toLocaleString()} FCFA</td>
                        <td className={bill.isAnomaly ? 'anomaly-cell' : 'amount-cell'}>{bill.difference > 0 ? '+' : ''}{bill.difference.toLocaleString()} FCFA</td>
                        <td><span className={`status-badge ${bill.isAnomaly ? 'anomaly' : 'normal'}`}>{bill.isAnomaly ? '⚠ Anomalie' : '✓ Normal'}</span></td>
                        <td>{bill.isAnomaly && <button className="action-btn" onClick={() => onNavigate('reclamation')}>Contester</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
                  {[...Array(totalPages)].map((_, i) => (<button key={i} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>))}
                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state"><p>Aucune facture trouvée</p><button onClick={() => onNavigate('meter-reading')} style={{ marginTop: '16px', padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Enregistrer un relevé</button></div>
          )}
        </div>

        {/* Footer */}
        <div className="footer-note">
          <Icons.link />
          <span>Données enregistrées sur blockchain Polygon — Preuve légale infalsifiable</span>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;