import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

// Icônes SVG
const Icons = {
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
  link: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  back: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  warning: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ),
  calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  amount: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  hash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  )
};

const Suivi = ({ onNavigate }) => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [blockchainReadings, setBlockchainReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('claims');

  useEffect(() => {
    loadClaims();
    loadBlockchainHistory();
  }, []);

  const loadClaims = async () => {
    try {
      const response = await claimService.getUserClaims();
      if (response.success) {
        setClaims(response.data.claims || []);
        if (response.data.claims?.length > 0) {
          setSelectedClaim(response.data.claims[0]);
        }
      }
    } catch (error) {
      console.error('Erreur chargement réclamations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlockchainHistory = async () => {
    try {
      const response = await api.getBlockchainHistory();
      if (response.success && response.data?.readings) {
        setBlockchainReadings(response.data.readings);
      }
    } catch (error) {
      console.error('Erreur chargement historique blockchain:', error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      submitted: 'Soumis',
      transmitted: 'Transmis à ENEO',
      investigating: 'En investigation',
      resolved: 'Résolu',
      rejected: 'Rejeté'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: '#f59e0b',
      transmitted: '#2563eb',
      investigating: '#8b5cf6',
      resolved: '#16a344',
      rejected: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos réclamations...</p>
        <style>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            color: white;
            gap: 16px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: #f59e0b;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="suivi-page">
      <div className="suivi-container">
        <div className="suivi-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            <Icons.back />
            <span>Retour</span>
          </button>
          <h1>Mes réclamations</h1>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('claims')}
          >
            <Icons.claim />
            <span>Réclamations ({claims.length})</span>
          </button>
          <button 
            className={`tab ${activeTab === 'blockchain' ? 'active' : ''}`}
            onClick={() => setActiveTab('blockchain')}
          >
            <Icons.blockchain />
            <span>Preuves blockchain ({blockchainReadings.length})</span>
          </button>
        </div>

        {activeTab === 'claims' && (
          <>
            {claims.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icons.claim />
                </div>
                <h3>Aucune réclamation</h3>
                <p>Vous n'avez pas encore déposé de réclamation.</p>
                <button className="btn-primary" onClick={() => onNavigate('reclamation')}>
                  Déposer une réclamation
                </button>
              </div>
            ) : (
              <>
                <div className="claims-list">
                  {claims.map(claim => (
                    <div
                      key={claim.claimNumber}
                      className={`claim-card ${selectedClaim?.claimNumber === claim.claimNumber ? 'active' : ''}`}
                      onClick={() => setSelectedClaim(claim)}
                    >
                      <div className="claim-header">
                        <span className="claim-number">{claim.claimNumber}</span>
                        <span className="claim-status" style={{ background: getStatusColor(claim.status) }}>
                          {getStatusLabel(claim.status)}
                        </span>
                      </div>
                      <div className="claim-date">
                        <Icons.calendar />
                        <span>{formatDate(claim.createdAt)}</span>
                      </div>
                      <div className="claim-amount">
                        <Icons.amount />
                        <span>Différence: {claim.difference?.toLocaleString() || '0'} FCFA</span>
                      </div>
                      {claim.blockchainHash && (
                        <div className="blockchain-badge">
                          <Icons.link />
                          <span>Preuve blockchain</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedClaim && (
                  <div className="claim-detail">
                    <div className="detail-header">
                      <h2>Réclamation {selectedClaim.claimNumber}</h2>
                      {selectedClaim.blockchainHash && (
                        <div className="blockchain-section">
                          <p className="detail-hash">
                            <Icons.hash />
                            <span>Hash blockchain: {selectedClaim.blockchainHash.substring(0, 20)}...</span>
                          </p>
                          <a 
                            href={`https://amoy.polygonscan.com/tx/${selectedClaim.blockchainHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="polygonscan-link"
                          >
                            Voir sur Polygonscan →
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="amounts">
                      <div className="amount">
                        <span>Facture contestée</span>
                        <strong>{selectedClaim.eneoAmount?.toLocaleString() || 0} FCFA</strong>
                      </div>
                      <div className="amount">
                        <span>Consommation relevée</span>
                        <strong>{selectedClaim.blockchainConsumption?.toLocaleString() || 0} kWh</strong>
                      </div>
                      <div className="amount">
                        <span>Écart</span>
                        <strong className="difference">{selectedClaim.difference?.toLocaleString() || 0} FCFA</strong>
                      </div>
                    </div>

                    <div className="progress">
                      <div className="progress-steps">
                        {['Soumis', 'ENEO', 'ARSEL', 'Résolu'].map((step, idx) => {
                          const stepStatus = {
                            0: selectedClaim.status !== 'submitted',
                            1: ['transmitted', 'investigating', 'resolved'].includes(selectedClaim.status),
                            2: ['investigating', 'resolved'].includes(selectedClaim.status),
                            3: selectedClaim.status === 'resolved'
                          };
                          return (
                            <div key={step} className={`step ${stepStatus[idx] ? 'completed' : selectedClaim.status === step ? 'active' : ''}`}>
                              <div className="step-dot"></div>
                              <span>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="timeline">
                      <h3>Suivi détaillé</h3>
                      {selectedClaim.timeline?.length > 0 ? (
                        selectedClaim.timeline.map((item, idx) => (
                          <div key={idx} className="timeline-item">
                            <div className="timeline-dot completed"></div>
                            <div className="timeline-content">
                              <div className="timeline-title">{item.step}</div>
                              <div className="timeline-date">{formatDate(item.date)}</div>
                              <div className="timeline-desc">{item.description}</div>
                              {item.transactionHash && (
                                <div className="timeline-tx">
                                  <Icons.hash />
                                  <span>Tx: {item.transactionHash.substring(0, 16)}...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>Aucun historique disponible</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'blockchain' && (
          <div className="blockchain-history">
            {blockchainReadings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icons.blockchain />
                </div>
                <h3>Aucune preuve blockchain</h3>
                <p>Vos relevés de compteur apparaîtront ici une fois enregistrés.</p>
                <button className="btn-primary" onClick={() => onNavigate('meter-reading')}>
                  Enregistrer un relevé
                </button>
              </div>
            ) : (
              <div className="readings-list">
                <h2>
                  <Icons.blockchain />
                  <span>Relevés enregistrés sur la blockchain</span>
                </h2>
                <div className="table-container">
                  <table className="readings-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Index précédent</th>
                        <th>Index actuel</th>
                        <th>Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockchainReadings.map((reading, idx) => (
                        <tr key={idx}>
                          <td><span className="reading-id">#{reading.id}</span></td>
                          <td className="date-cell">{formatDate(reading.timestamp)}</td>
                          <td>{reading.previousIndex}</td>
                          <td><strong>{reading.currentIndex}</strong></td>
                          <td>
                            <code className="hash-preview">{reading.id?.substring(0, 16)}...</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .suivi-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 32px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .suivi-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .suivi-header {
          margin-bottom: 32px;
        }

        .back-btn {
          background: none;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #f59e0b;
          cursor: pointer;
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #d97706;
        }

        .back-btn svg {
          width: 18px;
          height: 18px;
        }

        .suivi-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          background: white;
          border-radius: 60px;
          padding: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          border-radius: 40px;
          transition: all 0.3s;
        }

        .tab svg {
          width: 18px;
          height: 18px;
          stroke: #64748b;
        }

        .tab.active {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
        }

        .tab.active svg {
          stroke: white;
        }

        .claims-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .claim-card {
          background: white;
          padding: 20px 24px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
          border: 2px solid transparent;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .claim-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }

        .claim-card.active {
          border-color: #f59e0b;
          background: #fef3c7;
        }

        .claim-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .claim-number {
          font-weight: 700;
          font-size: 15px;
          color: #0f172a;
        }

        .claim-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: white;
        }

        .claim-date, .claim-amount {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .claim-date svg, .claim-amount svg {
          width: 14px;
          height: 14px;
        }

        .blockchain-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 4px 10px;
          background: #e8f7ee;
          border-radius: 20px;
          font-size: 11px;
          color: #16a344;
        }

        .blockchain-badge svg {
          width: 12px;
          height: 12px;
          stroke: #16a344;
        }

        .claim-detail {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .detail-header {
          margin-bottom: 24px;
        }

        .detail-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .detail-hash {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #64748b;
          font-family: monospace;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 10px;
        }

        .detail-hash svg {
          width: 14px;
          height: 14px;
        }

        .blockchain-section {
          margin-top: 16px;
        }

        .polygonscan-link {
          display: inline-block;
          margin-top: 8px;
          margin-left: 22px;
          font-size: 12px;
          color: #f59e0b;
          text-decoration: none;
        }

        .polygonscan-link:hover {
          text-decoration: underline;
        }

        .amounts {
          display: flex;
          gap: 24px;
          padding: 20px 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .amount {
          flex: 1;
          text-align: center;
        }

        .amount span {
          display: block;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .amount strong {
          font-size: 18px;
          color: #0f172a;
        }

        .difference {
          color: #f59e0b;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
          padding: 20px 0;
        }

        .step {
          text-align: center;
          flex: 1;
        }

        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e2e8f0;
          margin: 0 auto 8px;
        }

        .step.completed .step-dot {
          background: #16a344;
        }

        .step.active .step-dot {
          background: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.2);
        }

        .step span {
          font-size: 12px;
          color: #94a3b8;
        }

        .step.completed span, .step.active span {
          color: #f59e0b;
          font-weight: 600;
        }

        .timeline {
          margin-top: 24px;
        }

        .timeline h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #16a344;
          margin-top: 4px;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .timeline-date {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .timeline-desc {
          font-size: 13px;
          color: #475569;
          line-height: 1.4;
        }

        .timeline-tx {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 10px;
          color: #94a3b8;
          font-family: monospace;
        }

        .timeline-tx svg {
          width: 12px;
          height: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: white;
          border-radius: 24px;
        }

        .empty-icon svg {
          width: 64px;
          height: 64px;
          stroke: #cbd5e1;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245,158,11,0.3);
        }

        .readings-list h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .readings-list h2 svg {
          width: 22px;
          height: 22px;
          stroke: #f59e0b;
        }

        .table-container {
          background: white;
          border-radius: 20px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .readings-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 650px;
        }

        .readings-table th {
          padding: 14px 16px;
          text-align: left;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .readings-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          color: #475569;
        }

        .reading-id {
          font-family: monospace;
          font-weight: 600;
          color: #f59e0b;
        }

        .date-cell {
          font-size: 13px;
        }

        .hash-preview {
          font-family: monospace;
          font-size: 11px;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
        }

        @media (max-width: 768px) {
          .suivi-page { padding: 16px; }
          .amounts { flex-direction: column; gap: 16px; }
          .tabs { flex-direction: column; border-radius: 20px; }
          .claim-card { padding: 16px; }
          .claim-detail { padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Suivi;