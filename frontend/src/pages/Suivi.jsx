import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Chargement de vos réclamations...</div>
      </div>
    );
  }

  return (
    <div className="suivi-page">
      <div className="suivi-container">
        <div className="suivi-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Retour</button>
          <h1>Mes réclamations</h1>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('claims')}
          >
             Réclamations ({claims.length})
          </button>
          <button 
            className={`tab ${activeTab === 'blockchain' ? 'active' : ''}`}
            onClick={() => setActiveTab('blockchain')}
          >
            🔗 Preuves blockchain ({blockchainReadings.length})
          </button>
        </div>

        {activeTab === 'claims' && (
          <>
            {claims.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"></div>
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
                      <div className="claim-date">{formatDate(claim.createdAt)}</div>
                      <div className="claim-amount">
                        Différence: {claim.difference?.toLocaleString() || '0'} FCFA
                      </div>
                      {claim.blockchainHash && (
                        <div className="blockchain-badge">🔗 Preuve blockchain</div>
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
                            🔗 Hash blockchain: {selectedClaim.blockchainHash.substring(0, 20)}...
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
                                  Tx: {item.transactionHash.substring(0, 16)}...
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
                <div className="empty-icon">🔗</div>
                <h3>Aucune preuve blockchain</h3>
                <p>Vos relevés de compteur apparaîtront ici une fois enregistrés.</p>
                <button className="btn-primary" onClick={() => onNavigate('meter-reading')}>
                  Enregistrer un relevé
                </button>
              </div>
            ) : (
              <div className="readings-list">
                <h2> Relevés enregistrés sur la blockchain</h2>
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
                          <td>#{reading.id}</td>
                          <td>{formatDate(reading.timestamp)}</td>
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
          background: #f3f4f6;
          padding: 32px;
        }
        .suivi-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .suivi-header {
          margin-bottom: 24px;
        }
        .back-btn {
          background: none;
          border: none;
          color: #16a344;
          cursor: pointer;
          margin-bottom: 16px;
          font-size: 14px;
        }
        .suivi-header h1 {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
        }
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .tab.active {
          color: #16a344;
          border-bottom-color: #16a344;
        }
        .claims-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .claim-card {
          background: white;
          padding: 16px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        .claim-card.active {
          border-color: #16a344;
          background: #e8f7ee;
        }
        .claim-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .claim-number {
          font-weight: 700;
          font-size: 14px;
        }
        .claim-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          color: white;
        }
        .claim-date {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .claim-amount {
          font-size: 13px;
        }
        .blockchain-badge {
          font-size: 10px;
          color: #16a344;
          margin-top: 8px;
        }
        .claim-detail {
          background: white;
          border-radius: 20px;
          padding: 24px;
        }
        .detail-header {
          margin-bottom: 20px;
        }
        .detail-header h2 {
          font-size: 18px;
          margin-bottom: 4px;
        }
        .detail-hash {
          font-size: 11px;
          color: #6b7280;
          font-family: monospace;
          margin: 5px 0;
        }
        .blockchain-section {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 8px;
          margin-top: 12px;
        }
        .polygonscan-link {
          font-size: 11px;
          color: #2563eb;
          text-decoration: none;
        }
        .amounts {
          display: flex;
          gap: 24px;
          padding: 16px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }
        .amount {
          flex: 1;
        }
        .amount span {
          display: block;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .amount strong {
          font-size: 18px;
        }
        .difference {
          color: #f59e0b;
        }
        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          padding: 20px 0;
        }
        .step {
          text-align: center;
          flex: 1;
          position: relative;
        }
        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e5e7eb;
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
          font-size: 11px;
          color: #9ca3af;
        }
        .step.completed span, .step.active span {
          color: #16a344;
          font-weight: 600;
        }
        .timeline {
          margin-bottom: 24px;
        }
        .timeline h3 {
          font-size: 16px;
          margin-bottom: 16px;
        }
        .timeline-item {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
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
        }
        .timeline-date {
          font-size: 11px;
          color: #6b7280;
          margin: 4px 0;
        }
        .timeline-desc {
          font-size: 13px;
        }
        .timeline-tx {
          font-size: 10px;
          color: #9ca3af;
          font-family: monospace;
          margin-top: 4px;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
        }
        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        .empty-state h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .empty-state p {
          color: #6b7280;
          margin-bottom: 24px;
        }
        .btn-primary {
          background: #16a344;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }
        .readings-list h2 {
          font-size: 18px;
          margin-bottom: 16px;
        }
        .table-container {
          background: white;
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .readings-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        .readings-table th {
          padding: 14px 16px;
          text-align: left;
          background: #f9fafb;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }
        .readings-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .hash-preview {
          font-family: monospace;
          font-size: 11px;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 6px;
        }
        @media (max-width: 768px) {
          .suivi-page { padding: 16px; }
          .amounts { flex-direction: column; gap: 12px; }
          .progress-steps { flex-wrap: wrap; gap: 16px; }
        }
      `}</style>
    </div>
  );
};

export default Suivi;