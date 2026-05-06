import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const BlockchainHistory = ({ onNavigate }) => {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReading, setSelectedReading] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadBlockchainHistory();
  }, []);

  const loadBlockchainHistory = async () => {
    setLoading(true);
    try {
      const response = await api.getBlockchainHistory();
      if (response.success) {
        setReadings(response.data.readings || []);
      } else {
        console.error('Erreur:', response.error);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOnPolygonscan = (txHash) => {
    window.open(`https://amoy.polygonscan.com/tx/${txHash}`, '_blank');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
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
          <p className="subtitle">Tous vos relevés enregistrés sur la blockchain Polygon</p>
        </div>

        {/* Statistiques blockchain */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-value">{readings.length}</span>
              <span className="stat-label">Relevés enregistrés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔗</div>
            <div className="stat-info">
              <span className="stat-value">Polygon</span>
              <span className="stat-label">Réseau blockchain</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">Infalsifiable</span>
              <span className="stat-label">Preuve légale</span>
            </div>
          </div>
        </div>

        {/* Liste des relevés blockchain */}
        {readings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Aucun relevé trouvé</h3>
            <p>Vous n'avez pas encore enregistré de relevé sur la blockchain.</p>
            <button className="btn-primary" onClick={() => onNavigate('meter-reading')}>
              Enregistrer un relevé
            </button>
          </div>
        ) : (
          <>
            <div className="readings-list">
              <h2>📋 Vos relevés blockchain</h2>
              <div className="table-container">
                <table className="readings-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mois/Année</th>
                      <th>Index (précédent → actuel)</th>
                      <th>Consommation</th>
                      <th>Montant</th>
                      <th>Date</th>
                      <th>Preuve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.map((reading) => (
                      <tr 
                        key={reading.id} 
                        className="reading-row"
                        onClick={() => setSelectedReading(reading)}
                      >
                        <td><span className="reading-id">#{reading.id}</span></td>
                        <td>{reading.month} {reading.year}</td>
                        <td>{reading.previousIndex} → {reading.currentIndex}</td>
                        <td><strong>{reading.consumption} kWh</strong></td>
                        <td className="amount-cell">{parseInt(reading.amount).toLocaleString()} FCFA</td>
                        <td className="date-cell">{formatDate(reading.timestamp)}</td>
                        <td>
                          <button 
                            className="verify-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              verifyOnPolygonscan(reading.transactionHash || `0x${reading.id}...`);
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

            {/* Modal détails du relevé */}
            {selectedReading && (
              <div className="modal-overlay" onClick={() => setSelectedReading(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedReading(null)}>✕</button>
                  <h2>🔗 Détails du relevé blockchain</h2>
                  
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID Blockchain</label>
                      <code>#{selectedReading.id}</code>
                    </div>
                    <div className="detail-item">
                      <label>Période</label>
                      <span>{selectedReading.month} {selectedReading.year}</span>
                    </div>
                    <div className="detail-item">
                      <label>Index précédent</label>
                      <span>{selectedReading.previousIndex}</span>
                    </div>
                    <div className="detail-item">
                      <label>Index actuel</label>
                      <span>{selectedReading.currentIndex}</span>
                    </div>
                    <div className="detail-item">
                      <label>Consommation</label>
                      <strong>{selectedReading.consumption} kWh</strong>
                    </div>
                    <div className="detail-item">
                      <label>Montant</label>
                      <strong className="amount-highlight">{parseInt(selectedReading.amount).toLocaleString()} FCFA</strong>
                    </div>
                    <div className="detail-item">
                      <label>Horodatage</label>
                      <span>{formatDate(selectedReading.timestamp)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Adresse signataire</label>
                      <code className="address">{selectedReading.abonne}</code>
                    </div>
                  </div>

                  <div className="blockchain-proof">
                    <h3>🔒 Preuve cryptographique</h3>
                    <p>Ce relevé est enregistré de manière permanente sur la blockchain Polygon. Il constitue une preuve légale infalsifiable de votre consommation à cette date.</p>
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${selectedReading.transactionHash || `0x${selectedReading.id}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="polygonscan-link"
                    >
                      🔍 Voir la transaction sur Polygonscan
                    </a>
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
          max-width: 1200px;
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
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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
          min-width: 800px;
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
        .reading-row {
          cursor: pointer;
          transition: background 0.2s;
        }
        .reading-row:hover {
          background: #f9fafb;
        }
        .reading-id {
          font-family: monospace;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
        }
        .amount-cell {
          font-weight: 600;
          color: #16a344;
        }
        .date-cell {
          font-size: 12px;
          color: #6b7280;
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
        .btn-primary {
          background: #16a344;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          margin-top: 20px;
          cursor: pointer;
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
          max-width: 600px;
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
        .detail-item label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
        }
        .detail-item code {
          font-family: monospace;
          font-size: 12px;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 6px;
          word-break: break-all;
        }
        .amount-highlight {
          font-size: 20px;
          color: #16a344;
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
          color: #2563eb;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default BlockchainHistory;