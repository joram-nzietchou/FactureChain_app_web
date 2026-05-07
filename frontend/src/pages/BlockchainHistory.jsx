import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const BlockchainHistory = ({ onNavigate }) => {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, readings, claims
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Chargement historique blockchain...');
      
      // Charger les relevés de compteur
      const readingsResponse = await api.get('/blockchain/history');
      console.log('📥 Relevés:', readingsResponse);
      
      // Charger les réclamations
      const claimsResponse = await api.get('/claims');
      console.log('📥 Réclamations:', claimsResponse);
      
      if (readingsResponse.success) {
        setReadings(readingsResponse.data?.readings || []);
      }
      
      if (claimsResponse.success) {
        setClaims(claimsResponse.data?.claims || []);
      }
      
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      setError(error.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const verifyOnPolygonscan = (hash) => {
    if (hash) {
      window.open(`https://amoy.polygonscan.com/tx/${hash}`, '_blank');
    } else {
      alert('Hash non disponible');
    }
  };

  // Combiner tous les éléments pour l'onglet "Tout"
  const allItems = [
    ...readings.map(r => ({ ...r, type: 'reading', typeLabel: '📊 Relevé', typeIcon: '📊' })),
    ...claims.map(c => ({ ...c, type: 'claim', typeLabel: '📝 Réclamation', typeIcon: '📝' }))
  ].sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));

  const getItemsByTab = () => {
    switch (activeTab) {
      case 'readings':
        return readings.map(r => ({ ...r, type: 'reading', typeLabel: '📊 Relevé', typeIcon: '📊' }));
      case 'claims':
        return claims.map(c => ({ ...c, type: 'claim', typeLabel: '📝 Réclamation', typeIcon: '📝' }));
      default:
        return allItems;
    }
  };

  const currentItems = getItemsByTab();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Chargement de l'historique blockchain...</div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Retour</button>
          <h1>🏛️ Historique Blockchain</h1>
          <p className="subtitle">Tous vos relevés et réclamations enregistrés sur la blockchain Polygon</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
            <button onClick={loadHistory} className="retry-btn">Réessayer</button>
          </div>
        )}

        {/* Statistiques */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-value">{readings.length}</span>
              <span className="stat-label">Relevés enregistrés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <span className="stat-value">{claims.length}</span>
              <span className="stat-label">Réclamations</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔗</div>
            <div className="stat-info">
              <span className="stat-value">Polygon</span>
              <span className="stat-label">Réseau blockchain</span>
            </div>
          </div>
          <button className="stat-card" onClick={loadHistory}>
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <span className="stat-value">Actualiser</span>
              <span className="stat-label">Rafraîchir</span>
            </div>
          </button>
        </div>

        {/* Onglets */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📋 Tout ({allItems.length})
          </button>
          <button 
            className={`tab ${activeTab === 'readings' ? 'active' : ''}`}
            onClick={() => setActiveTab('readings')}
          >
            📊 Relevés ({readings.length})
          </button>
          <button 
            className={`tab ${activeTab === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('claims')}
          >
            📝 Réclamations ({claims.length})
          </button>
        </div>

        {currentItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Aucune donnée trouvée</h3>
            <p>Vous n'avez pas encore enregistré de relevé ou de réclamation sur la blockchain.</p>
            <div className="empty-buttons">
              <button className="btn-primary" onClick={() => onNavigate('meter-reading')}>
                📊 Enregistrer un relevé
              </button>
              <button className="btn-secondary" onClick={() => onNavigate('reclamation')}>
                📝 Déposer une réclamation
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="items-list">
              <h2>📋 Historique complet</h2>
              <div className="table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Détails</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Preuve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, idx) => (
                      <tr 
                        key={idx} 
                        className="item-row"
                        onClick={() => setSelectedItem(item)}
                      >
                        <td>
                          <span className="type-badge" style={{
                            background: item.type === 'reading' ? '#e8f7ee' : '#fef2f2',
                            color: item.type === 'reading' ? '#16a344' : '#ef4444'
                          }}>
                            {item.typeIcon} {item.typeLabel}
                          </span>
                        </td>
                        <td className="item-id">#{item.id || item.claimNumber || item._id?.substring(0, 8)}</td>
                        <td className="date-cell">{formatDate(item.timestamp || item.createdAt)}</td>
                        <td>
                          {item.type === 'reading' ? (
                            <div>
                              {item.previousIndex} → {item.currentIndex} kWh
                            </div>
                          ) : (
                            <div>
                              {item.month} {item.year} - {item.subscriberNumber}
                            </div>
                          )}
                        </td>
                        <td className="amount-cell">
                          {item.type === 'reading' 
                            ? `${item.calculatedAmount?.toLocaleString() || item.amount?.toLocaleString() || 0} FCFA`
                            : `${item.eneoAmount?.toLocaleString() || 0} FCFA`
                          }
                        </td>
                        <td>
                          <span className={`status-badge ${item.status === 'resolved' ? 'resolved' : (item.isAnomaly || item.status === 'anomaly' ? 'anomaly' : 'normal')}`}>
                            {item.status === 'resolved' ? '✓ Résolu' : 
                             (item.isAnomaly || item.status === 'anomaly' ? '⚠ Anomalie' : '✓ Normal')}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="verify-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              verifyOnPolygonscan(item.blockchainHash || item.transactionHash);
                            }}
                          >
                            🔍 Vérifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal détails */}
            {selectedItem && (
              <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
                  <h2>{selectedItem.type === 'reading' ? '📊 Détails du relevé' : '📝 Détails de la réclamation'}</h2>
                  
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID Blockchain</label>
                      <code>#{selectedItem.id || selectedItem.claimNumber || selectedItem._id?.substring(0, 10)}</code>
                    </div>
                    <div className="detail-item">
                      <label>Date</label>
                      <span>{formatDate(selectedItem.timestamp || selectedItem.createdAt)}</span>
                    </div>
                    {selectedItem.type === 'reading' ? (
                      <>
                        <div className="detail-item">
                          <label>Index précédent</label>
                          <span>{selectedItem.previousIndex}</span>
                        </div>
                        <div className="detail-item">
                          <label>Index actuel</label>
                          <span><strong>{selectedItem.currentIndex}</strong></span>
                        </div>
                        <div className="detail-item">
                          <label>Consommation</label>
                          <strong>{(selectedItem.currentIndex - selectedItem.previousIndex)} kWh</strong>
                        </div>
                        <div className="detail-item">
                          <label>Montant calculé</label>
                          <strong className="amount-highlight">{selectedItem.calculatedAmount?.toLocaleString()} FCFA</strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="detail-item">
                          <label>Numéro réclamation</label>
                          <span>{selectedItem.claimNumber}</span>
                        </div>
                        <div className="detail-item">
                          <label>Période</label>
                          <span>{selectedItem.month} {selectedItem.year}</span>
                        </div>
                        <div className="detail-item">
                          <label>Consommation blockchain</label>
                          <span>{selectedItem.blockchainConsumption} kWh</span>
                        </div>
                        <div className="detail-item">
                          <label>Montant facturé</label>
                          <strong>{selectedItem.eneoAmount?.toLocaleString()} FCFA</strong>
                        </div>
                        <div className="detail-item full-width">
                          <label>Description</label>
                          <p className="description-text">{selectedItem.description || 'Aucune description'}</p>
                        </div>
                      </>
                    )}
                    <div className="detail-item full-width">
                      <label>Hash transaction</label>
                      <code className="tx-hash">{selectedItem.blockchainHash || selectedItem.transactionHash || 'Non disponible'}</code>
                    </div>
                  </div>

                  <div className="blockchain-proof">
                    <h3>🔒 Preuve cryptographique</h3>
                    <p>Cette transaction est enregistrée de manière permanente sur la blockchain Polygon. Elle constitue une preuve légale infalsifiable.</p>
                    <button 
                      onClick={() => verifyOnPolygonscan(selectedItem.blockchainHash || selectedItem.transactionHash)}
                      className="polygonscan-link"
                      disabled={!selectedItem.blockchainHash && !selectedItem.transactionHash}
                    >
                      🔍 Voir la transaction sur Polygonscan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .history-page {
          min-height: 100vh;
          background: #f3f4f6;
          padding: 32px;
        }
        .history-container {
          max-width: 1300px;
          margin: 0 auto;
        }
        .history-header {
          margin-bottom: 32px;
        }
        .back-btn {
          background: none;
          border: none;
          color: #16a344;
          cursor: pointer;
          margin-bottom: 16px;
          font-size: 14px;
        }
        .history-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 14px;
        }
        .error-message {
          background: #fef2f2;
          color: #ef4444;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .retry-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s;
          border: none;
          width: 100%;
          text-align: left;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        .stat-icon {
          font-size: 36px;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #16a344;
        }
        .stat-label {
          font-size: 12px;
          color: #6b7280;
        }
        .tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 12px;
        }
        .tab {
          padding: 8px 20px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          border-radius: 20px;
          transition: all 0.2s;
        }
        .tab.active {
          background: #16a344;
          color: white;
        }
        .items-list h2 {
          font-size: 18px;
          margin-bottom: 16px;
        }
        .table-container {
          background: white;
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }
        .items-table th {
          padding: 14px 16px;
          text-align: left;
          background: #f9fafb;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }
        .items-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .item-row {
          cursor: pointer;
          transition: background 0.2s;
        }
        .item-row:hover {
          background: #f9fafb;
        }
        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .item-id {
          font-family: monospace;
          font-size: 12px;
        }
        .date-cell {
          font-size: 12px;
          color: #6b7280;
        }
        .amount-cell {
          font-weight: 600;
          color: #16a344;
        }
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
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
        .status-badge.resolved {
          background: #eff6ff;
          color: #2563eb;
        }
        .verify-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
        }
        .empty-state {
          text-align: center;
          padding: 60px;
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
        .empty-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }
        .btn-primary {
          background: #16a344;
          color: white;
        }
        .btn-secondary {
          background: white;
          border: 1.5px solid #16a344;
          color: #16a344;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 550px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 20px 0;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-item.full-width {
          grid-column: span 2;
        }
        .detail-item label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
        }
        .detail-item code {
          font-family: monospace;
          font-size: 11px;
          background: #f3f4f6;
          padding: 6px 8px;
          border-radius: 6px;
          word-break: break-all;
        }
        .amount-highlight {
          font-size: 18px;
          color: #16a344;
        }
        .description-text {
          font-size: 13px;
          color: #374151;
          line-height: 1.5;
          background: #f9fafb;
          padding: 10px;
          border-radius: 8px;
          margin-top: 5px;
        }
        .tx-hash {
          font-size: 10px;
          word-break: break-all;
        }
        .blockchain-proof {
          background: #e8f7ee;
          border-radius: 12px;
          padding: 16px;
          margin-top: 20px;
        }
        .polygonscan-link {
          display: inline-block;
          margin-top: 12px;
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
        .polygonscan-link:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .history-page { padding: 16px; }
          .stats-cards { grid-template-columns: repeat(2, 1fr); }
          .empty-buttons { flex-direction: column; }
          .detail-grid { grid-template-columns: 1fr; }
          .detail-item.full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default BlockchainHistory;