import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Icônes SVG
const Icons = {
  back: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  history: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  reading: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  claim: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  blockchain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  refresh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6"/>
      <path d="M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/>
    </svg>
  ),
  list: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  verify: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  warning: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  amount: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  id: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  description: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  proof: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
};

const BlockchainHistory = ({ onNavigate }) => {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const readingsResponse = await api.get('/blockchain/history');
      const claimsResponse = await api.get('/claims');
      
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

  const allItems = [
    ...readings.map(r => ({ ...r, type: 'reading', typeLabel: 'Relevé', typeIcon: 'reading' })),
    ...claims.map(c => ({ ...c, type: 'claim', typeLabel: 'Réclamation', typeIcon: 'claim' }))
  ].sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));

  const getItemsByTab = () => {
    switch (activeTab) {
      case 'readings':
        return readings.map(r => ({ ...r, type: 'reading', typeLabel: 'Relevé', typeIcon: 'reading' }));
      case 'claims':
        return claims.map(c => ({ ...c, type: 'claim', typeLabel: 'Réclamation', typeIcon: 'claim' }));
      default:
        return allItems;
    }
  };

  const currentItems = getItemsByTab();

  const getTypeIcon = (type) => {
    if (type === 'reading') return <Icons.reading />;
    return <Icons.claim />;
  };

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
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            <Icons.back />
            <span>Retour</span>
          </button>
          <h1>
            <Icons.history />
            Historique Blockchain
          </h1>
          <p className="subtitle">Tous vos relevés et réclamations enregistrés sur la blockchain Polygon</p>
        </div>

        {error && (
          <div className="error-message">
            <Icons.warning />
            <span>{error}</span>
            <button onClick={loadHistory} className="retry-btn">Réessayer</button>
          </div>
        )}

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon"><Icons.reading /></div>
            <div className="stat-info">
              <span className="stat-value">{readings.length}</span>
              <span className="stat-label">Relevés enregistrés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Icons.claim /></div>
            <div className="stat-info">
              <span className="stat-value">{claims.length}</span>
              <span className="stat-label">Réclamations</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Icons.blockchain /></div>
            <div className="stat-info">
              <span className="stat-value">Polygon</span>
              <span className="stat-label">Réseau blockchain</span>
            </div>
          </div>
          <button className="stat-card" onClick={loadHistory}>
            <div className="stat-icon"><Icons.refresh /></div>
            <div className="stat-info">
              <span className="stat-value">Actualiser</span>
              <span className="stat-label">Rafraîchir</span>
            </div>
          </button>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            <Icons.list />
            <span>Tout ({allItems.length})</span>
          </button>
          <button className={`tab ${activeTab === 'readings' ? 'active' : ''}`} onClick={() => setActiveTab('readings')}>
            <Icons.reading />
            <span>Relevés ({readings.length})</span>
          </button>
          <button className={`tab ${activeTab === 'claims' ? 'active' : ''}`} onClick={() => setActiveTab('claims')}>
            <Icons.claim />
            <span>Réclamations ({claims.length})</span>
          </button>
        </div>

        {currentItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icons.list /></div>
            <h3>Aucune donnée trouvée</h3>
            <p>Vous n'avez pas encore enregistré de relevé ou de réclamation sur la blockchain.</p>
            <div className="empty-buttons">
              <button className="btn-primary" onClick={() => onNavigate('meter-reading')}>
                <Icons.reading />
                <span>Enregistrer un relevé</span>
              </button>
              <button className="btn-secondary" onClick={() => onNavigate('reclamation')}>
                <Icons.claim />
                <span>Déposer une réclamation</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="items-list">
              <h2>
                <Icons.list />
                Historique complet
              </h2>
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
                      <tr key={idx} className="item-row" onClick={() => setSelectedItem(item)}>
                        <td>
                          <span className={`type-badge ${item.type === 'reading' ? 'reading-badge' : 'claim-badge'}`}>
                            {getTypeIcon(item.type)}
                            <span>{item.typeLabel}</span>
                          </span>
                        </td>
                        <td className="item-id">#{item.id || item.claimNumber || item._id?.substring(0, 8)}</td>
                        <td className="date-cell">
                          <Icons.calendar />
                          <span>{formatDate(item.timestamp || item.createdAt)}</span>
                        </td>
                        <td>
                          {item.type === 'reading' ? (
                            <div>{item.previousIndex} → {item.currentIndex} kWh</div>
                          ) : (
                            <div>{item.month} {item.year}</div>
                          )}
                        </td>
                        <td className="amount-cell">
                          <Icons.amount />
                          <span>
                            {item.type === 'reading' 
                              ? `${item.calculatedAmount?.toLocaleString() || item.amount?.toLocaleString() || 0} FCFA`
                              : `${item.eneoAmount?.toLocaleString() || 0} FCFA`
                            }
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${item.status === 'resolved' ? 'resolved' : (item.isAnomaly || item.status === 'anomaly' ? 'anomaly' : 'normal')}`}>
                            {item.status === 'resolved' ? <Icons.check /> : (item.isAnomaly || item.status === 'anomaly' ? <Icons.warning /> : <Icons.check />)}
                            <span>
                              {item.status === 'resolved' ? 'Résolu' : 
                               (item.isAnomaly || item.status === 'anomaly' ? 'Anomalie' : 'Normal')}
                            </span>
                          </span>
                        </td>
                        <td>
                          <button className="verify-btn" onClick={(e) => { e.stopPropagation(); verifyOnPolygonscan(item.blockchainHash || item.transactionHash); }}>
                            <Icons.verify />
                            <span>Vérifier</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedItem && (
              <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedItem(null)}><Icons.close /></button>
                  <h2>
                    {getTypeIcon(selectedItem.type)}
                    <span>{selectedItem.type === 'reading' ? 'Détails du relevé' : 'Détails de la réclamation'}</span>
                  </h2>
                  
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label><Icons.id /> ID Blockchain</label>
                      <code>#{selectedItem.id || selectedItem.claimNumber || selectedItem._id?.substring(0, 10)}</code>
                    </div>
                    <div className="detail-item">
                      <label><Icons.calendar /> Date</label>
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
                          <label><Icons.amount /> Montant calculé</label>
                          <strong className="amount-highlight">{selectedItem.calculatedAmount?.toLocaleString()} FCFA</strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="detail-item">
                          <label><Icons.id /> Numéro réclamation</label>
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
                          <label><Icons.amount /> Montant facturé</label>
                          <strong>{selectedItem.eneoAmount?.toLocaleString()} FCFA</strong>
                        </div>
                        <div className="detail-item full-width">
                          <label><Icons.description /> Description</label>
                          <p className="description-text">{selectedItem.description || 'Aucune description'}</p>
                        </div>
                      </>
                    )}
                    <div className="detail-item full-width">
                      <label><Icons.link /> Hash transaction</label>
                      <code className="tx-hash">{selectedItem.blockchainHash || selectedItem.transactionHash || 'Non disponible'}</code>
                    </div>
                  </div>

                  <div className="blockchain-proof">
                    <h3><Icons.proof /> Preuve cryptographique</h3>
                    <p>Cette transaction est enregistrée de manière permanente sur la blockchain Polygon. Elle constitue une preuve légale infalsifiable.</p>
                    <button onClick={() => verifyOnPolygonscan(selectedItem.blockchainHash || selectedItem.transactionHash)} className="polygonscan-link" disabled={!selectedItem.blockchainHash && !selectedItem.transactionHash}>
                      <Icons.verify />
                      <span>Voir la transaction sur Polygonscan</span>
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
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .history-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
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
          align-items: center;
          gap: 10px;
        }
        .retry-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          margin-left: auto;
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
        .stat-icon svg {
          width: 32px;
          height: 32px;
          stroke: #16a344;
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
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab.active {
          background: #16a344;
          color: white;
        }
        .tab svg {
          width: 16px;
          height: 16px;
        }
        .items-list h2 {
          font-size: 18px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
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
          min-width: 900px;
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
        .reading-badge {
          background: #e8f7ee;
          color: #16a344;
        }
        .claim-badge {
          background: #fef2f2;
          color: #ef4444;
        }
        .type-badge svg {
          width: 14px;
          height: 14px;
        }
        .item-id {
          font-family: monospace;
          font-size: 12px;
        }
        .date-cell {
          font-size: 12px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .date-cell svg {
          width: 12px;
          height: 12px;
        }
        .amount-cell {
          font-weight: 600;
          color: #16a344;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .amount-cell svg {
          width: 14px;
          height: 14px;
        }
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
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
        .status-badge svg {
          width: 12px;
          height: 12px;
        }
        .verify-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .verify-btn svg {
          width: 12px;
          height: 12px;
          stroke: white;
        }
        .empty-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 20px;
        }
        .empty-icon svg {
          width: 64px;
          height: 64px;
          stroke: #9ca3af;
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
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary {
          background: #16a344;
          color: white;
        }
        .btn-primary svg {
          stroke: white;
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
          cursor: pointer;
          color: #6b7280;
        }
        .modal-close svg {
          width: 20px;
          height: 20px;
        }
        .modal-content h2 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
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
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .detail-item label svg {
          width: 12px;
          height: 12px;
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
        .blockchain-proof h3 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .polygonscan-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
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
          .tabs { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
};

export default BlockchainHistory;