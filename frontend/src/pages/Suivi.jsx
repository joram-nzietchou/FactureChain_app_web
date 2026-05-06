import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

const Suivi = ({ onNavigate }) => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [blockchainProof, setBlockchainProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const response = await claimService.getUserClaims();
      if (response.success) {
        setClaims(response.data.claims || []);
        if (response.data.claims?.length > 0) {
          setSelectedClaim(response.data.claims[0]);
          if (response.data.claims[0].blockchainHash) {
            verifyBlockchainProof(response.data.claims[0].blockchainHash);
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement réclamations:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBlockchainProof = async (txHash) => {
    setVerifying(true);
    try {
      const response = await api.verifyBlockchainTransaction(txHash);
      if (response.success) {
        setBlockchainProof(response.data);
      }
    } catch (error) {
      console.error('Erreur vérification blockchain:', error);
    } finally {
      setVerifying(false);
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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
  }

  return (
    <div className="suivi-page">
      <div className="suivi-container">
        <div className="suivi-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Retour</button>
          <h1>Mes réclamations</h1>
        </div>

        {claims.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
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
                  onClick={() => {
                    setSelectedClaim(claim);
                    if (claim.blockchainHash) verifyBlockchainProof(claim.blockchainHash);
                  }}
                >
                  <div className="claim-header">
                    <span className="claim-number">{claim.claimNumber}</span>
                    <span className="claim-status" style={{ background: getStatusColor(claim.status) }}>
                      {getStatusLabel(claim.status)}
                    </span>
                  </div>
                  <div className="claim-date">{new Date(claim.createdAt).toLocaleDateString('fr-FR')}</div>
                  <div className="claim-amount">Différence: {claim.difference?.toLocaleString()} FCFA</div>
                  {claim.blockchainHash && (
                    <div className="blockchain-badge">
                      🔗 Preuve blockchain
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
                        🔗 Hash blockchain: {selectedClaim.blockchainHash.substring(0, 20)}...
                      </p>
                      {blockchainProof?.verified && (
                        <div className="proof-verified">
                          ✅ Transaction vérifiée (Bloc {blockchainProof.blockNumber})
                        </div>
                      )}
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
                    <strong>{selectedClaim.eneoAmount?.toLocaleString()} FCFA</strong>
                  </div>
                  <div className="amount">
                    <span>Montant blockchain</span>
                    <strong>{selectedClaim.blockchainConsumption?.toLocaleString()} kWh</strong>
                  </div>
                  <div className="amount">
                    <span>Écart</span>
                    <strong className="difference">{selectedClaim.difference?.toLocaleString()} FCFA</strong>
                  </div>
                </div>

                <div className="progress">
                  <div className="progress-steps">
                    <div className={`step ${selectedClaim.status !== 'submitted' ? 'completed' : selectedClaim.status === 'submitted' ? 'active' : ''}`}>
                      <div className="step-dot"></div>
                      <span>Soumis</span>
                    </div>
                    <div className={`step ${selectedClaim.status === 'transmitted' || selectedClaim.status === 'investigating' || selectedClaim.status === 'resolved' ? 'completed' : selectedClaim.status === 'transmitted' ? 'active' : ''}`}>
                      <div className="step-dot"></div>
                      <span>ENEO</span>
                    </div>
                    <div className={`step ${selectedClaim.status === 'resolved' ? 'completed' : selectedClaim.status === 'investigating' ? 'active' : ''}`}>
                      <div className="step-dot"></div>
                      <span>ARSEL</span>
                    </div>
                    <div className={`step ${selectedClaim.status === 'resolved' ? 'completed active' : ''}`}>
                      <div className="step-dot"></div>
                      <span>Résolu</span>
                    </div>
                  </div>
                </div>

                <div className="timeline">
                  <h3>Suivi détaillé</h3>
                  {selectedClaim.timeline?.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot completed"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">{item.step}</div>
                        <div className="timeline-date">{new Date(item.date).toLocaleString('fr-FR')}</div>
                        <div className="timeline-desc">{item.description}</div>
                        {item.transactionHash && (
                          <div className="timeline-tx">
                            Tx: {item.transactionHash.substring(0, 16)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="zone-stats">
                  <h3>📍 Anomalies dans votre zone (Yaoundé - Mvog-Mbi)</h3>
                  <div className="stats">
                    <div>Réclamations actives: <strong>47</strong></div>
                    <div>Surfacturation: <strong>28</strong></div>
                    <div>Erreur de relevé: <strong>12</strong></div>
                    <div>Résolues ce mois: <strong>35</strong></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
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
        .proof-verified {
          font-size: 11px;
          color: #16a344;
          margin: 5px 0;
        }
        .polygonscan-link {
          font-size: 11px;
          color: #2563eb;
          text-decoration: none;
        }
        .blockchain-section {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 8px;
          margin-top: 12px;
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
        .zone-stats {
          background: #f9fafb;
          padding: 16px;
          border-radius: 12px;
        }
        .zone-stats h3 {
          font-size: 13px;
          margin-bottom: 12px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .stats div {
          font-size: 13px;
        }
        .stats strong {
          color: #16a344;
        }
      `}</style>
    </div>
  );
};

export default Suivi;