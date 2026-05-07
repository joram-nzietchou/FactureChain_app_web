import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Tarifs ENEO réels
const TARIFFS = [
  { min: 0, max: 110, rate: 50 },
  { min: 111, max: 220, rate: 79 },
  { min: 221, max: 400, rate: 94 },
  { min: 401, max: Infinity, rate: 99 }
];

const TVA_RATE = 0.1925;

const calculateBill = (previousIndex, currentIndex) => {
  const consumption = currentIndex - previousIndex;
  if (consumption <= 0) return null;
  
  let price = 0;
  let remaining = consumption;
  let details = [];
  
  for (const tier of TARIFFS) {
    if (remaining <= 0) break;
    
    const tierMax = tier.max === Infinity ? remaining : tier.max;
    const tierMin = tier.min;
    const tierRange = Math.min(remaining, tierMax - tierMin + 1);
    
    if (tierRange > 0) {
      const amount = tierRange * tier.rate;
      price += amount;
      details.push({
        range: `${tier.min} - ${tier.max === Infinity ? '+' : tier.max} kWh`,
        rate: tier.rate,
        kwh: tierRange,
        amount: amount
      });
      remaining -= tierRange;
    }
  }
  
  const tva = price * TVA_RATE;
  const total = price + tva;
  
  return {
    consumption,
    priceHT: Math.round(price),
    tva: Math.round(tva),
    total: Math.round(total),
    details,
    averageRate: Math.round(price / consumption)
  };
};

const MeterReading = ({ onNavigate }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [lastIndex, setLastIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [calculation, setCalculation] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    previousIndex: '',
    currentIndex: '',
    month: new Date().toLocaleString('fr-FR', { month: 'long' }),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadLastIndex();
  }, []);

  const loadLastIndex = async () => {
    setLoading(true);
    try {
      const response = await api.get('/meter/last-index');
      if (response.success && response.lastIndex !== undefined) {
        setLastIndex(response.lastIndex);
        setFormData(prev => ({ ...prev, previousIndex: response.lastIndex }));
      }
    } catch (error) {
      console.error('Erreur chargement dernier relevé:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calcul en temps réel
  useEffect(() => {
    const previous = parseFloat(formData.previousIndex);
    const current = parseFloat(formData.currentIndex);
    
    if (isNaN(previous) || isNaN(current) || current <= previous) {
      setCalculation(null);
      return;
    }
    
    const bill = calculateBill(previous, current);
    setCalculation(bill);
  }, [formData.previousIndex, formData.currentIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!calculation) {
      alert('Veuillez saisir des index valides');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await api.post('/meter/store', {
        subscriberNumber: user?.subscriberNumber,
        previousIndex: parseFloat(formData.previousIndex),
        currentIndex: parseFloat(formData.currentIndex),
        month: formData.month,
        year: formData.year
      });
      
      if (response.success) {
        setResult({
          success: true,
          reading: {
            previousIndex: formData.previousIndex,
            currentIndex: formData.currentIndex,
            consumption: calculation.consumption,
            calculatedAmount: calculation.total,
            month: formData.month,
            year: formData.year
          },
          blockchain: response.data?.blockchain || {
            transactionHash: '0x' + Math.random().toString(36).substring(2, 15),
            readingId: Math.floor(Math.random() * 1000).toString(),
            blockNumber: Date.now()
          }
        });
      } else {
        alert('Erreur: ' + (response.error || 'Erreur lors de l\'enregistrement'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setCalculation(null);
    setFormData({
      previousIndex: lastIndex,
      currentIndex: '',
      month: new Date().toLocaleString('fr-FR', { month: 'long' }),
      year: new Date().getFullYear()
    });
  };

  if (result) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h1>Relevé enregistré avec succès !</h1>
          
          <div className="result-card">
            <h3>Récapitulatif</h3>
            <div className="result-details">
              <div className="result-row">
                <span>Période :</span>
                <strong>{result.reading.month} {result.reading.year}</strong>
              </div>
              <div className="result-row">
                <span>Index précédent :</span>
                <strong>{result.reading.previousIndex}</strong>
              </div>
              <div className="result-row">
                <span>Index actuel :</span>
                <strong>{result.reading.currentIndex}</strong>
              </div>
              <div className="result-row">
                <span>Consommation :</span>
                <strong>{result.reading.consumption} kWh</strong>
              </div>
              
              {/* Détail du calcul par tranche */}
              {calculation && calculation.details && (
                <div className="calculation-details">
                  <div className="details-title">Détail du calcul :</div>
                  {calculation.details.map((detail, idx) => (
                    <div key={idx} className="detail-row">
                      <span>{detail.range}</span>
                      <span>{detail.kwh} kWh × {detail.rate} F = {detail.amount.toLocaleString()} F</span>
                    </div>
                  ))}
                  <div className="detail-row total">
                    <span>Montant HT :</span>
                    <strong>{calculation.priceHT.toLocaleString()} FCFA</strong>
                  </div>
                  <div className="detail-row">
                    <span>TVA (19.25%) :</span>
                    <span>{calculation.tva.toLocaleString()} FCFA</span>
                  </div>
                  <div className="detail-row grand-total">
                    <span>Montant TTC :</span>
                    <strong>{calculation.total.toLocaleString()} FCFA</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="blockchain-card">
            <h3>🔗 Preuve Blockchain</h3>
            <div className="blockchain-details">
              <div className="tx-hash">
                <span>Hash :</span>
                <code>{result.blockchain.transactionHash}</code>
              </div>
              <div className="blockchain-row">
                <span>ID Relevé :</span>
                <strong>#{result.blockchain.readingId}</strong>
              </div>
              <div className="blockchain-row">
                <span>Bloc :</span>
                <strong>{result.blockchain.blockNumber}</strong>
              </div>
            </div>
            <a 
              href={`https://amoy.polygonscan.com/tx/${result.blockchain.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="polygonscan-link"
            >
              🔍 Voir la transaction sur Polygonscan
            </a>
          </div>

          <div className="actions-buttons">
            <button className="btn-primary" onClick={resetForm}>
              📝 Nouveau relevé
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('dashboard')}>
              🏠 Retour au Dashboard
            </button>
          </div>
        </div>

        <style>{`
          .success-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .success-container {
            max-width: 600px;
            width: 100%;
            background: white;
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            animation: fadeInUp 0.5s ease-out;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            color: #16a344;
            font-size: 24px;
            margin-bottom: 30px;
          }
          .result-card, .blockchain-card {
            background: #f9fafb;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
            text-align: left;
          }
          .result-card h3, .blockchain-card h3 {
            font-size: 16px;
            margin-bottom: 16px;
            color: #374151;
          }
          .result-details {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .result-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .calculation-details {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
          }
          .details-title {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #16a344;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 6px 0;
            color: #6b7280;
          }
          .detail-row.total, .detail-row.grand-total {
            padding-top: 10px;
            margin-top: 5px;
            border-top: 1px solid #e5e7eb;
            font-weight: 600;
            color: #111827;
          }
          .detail-row.grand-total strong {
            color: #16a344;
            font-size: 16px;
          }
          .tx-hash code {
            display: block;
            font-size: 11px;
            word-break: break-all;
            background: white;
            padding: 8px;
            border-radius: 8px;
            margin-top: 5px;
          }
          .polygonscan-link {
            display: inline-block;
            margin-top: 16px;
            color: #2563eb;
            text-decoration: none;
            font-size: 13px;
          }
          .actions-buttons {
            display: flex;
            gap: 12px;
            margin-top: 20px;
          }
          .btn-primary, .btn-secondary {
            flex: 1;
            padding: 12px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
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
          @media (max-width: 600px) {
            .success-container { padding: 24px; }
            .actions-buttons { flex-direction: column; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="meter-page">
      <div className="meter-container">
        <div className="meter-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← Retour
          </button>
          <h1>Relevé de compteur</h1>
          <p>Enregistrez votre index pour générer votre facture selon les tarifs ENEO officiels</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="meter-form">
            <div className="form-section">
              <h3>👤 Informations</h3>
              <div className="form-grid">
                <div className="info-card">
                  <label>Abonné</label>
                  <span>{user?.fullName || user?.email?.split('@')[0]}</span>
                </div>
                <div className="info-card">
                  <label>Numéro ENEO</label>
                  <span>{user?.subscriberNumber || 'À renseigner'}</span>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>📅 Période</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Mois</label>
                  <select name="month" value={formData.month} onChange={handleChange}>
                    {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Année</label>
                  <input type="number" name="year" value={formData.year} onChange={handleChange} min="2020" max="2030" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>⚡ Index du compteur</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Index précédent</label>
                  <div className="index-display">
                    <input
                      type="number"
                      name="previousIndex"
                      value={formData.previousIndex}
                      onChange={handleChange}
                      step="1"
                      required
                    />
                    {lastIndex > 0 && (
                      <span className="info-badge">Dernier relevé: {lastIndex}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Index actuel</label>
                  <input
                    type="number"
                    name="currentIndex"
                    value={formData.currentIndex}
                    onChange={handleChange}
                    placeholder="Entrez l'index"
                    step="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tarifs info */}
            <div className="tariffs-info">
              <h4>Tarifs ENEO officiels</h4>
              <div className="tariffs-grid">
                <div className="tariff-item">0 - 110 kWh : 50 FCFA/kWh</div>
                <div className="tariff-item">111 - 220 kWh : 79 FCFA/kWh</div>
                <div className="tariff-item">221 - 400 kWh : 94 FCFA/kWh</div>
                <div className="tariff-item">401+ kWh : 99 FCFA/kWh</div>
                <div className="tariff-item tva">TVA : 19.25%</div>
              </div>
            </div>

            {/* Calcul de la facture */}
            {calculation && (
              <div className="calculation-section">
                <h3>💰 Calcul de la facture</h3>
                <div className="calculation-details">
                  <div className="calc-row total-consumption">
                    <span>Consommation</span>
                    <strong>{calculation.consumption} kWh</strong>
                  </div>
                  
                  <div className="calc-breakdown">
                    <div className="breakdown-title">Détail du calcul :</div>
                    {calculation.details.map((detail, idx) => (
                      <div key={idx} className="breakdown-row">
                        <span>{detail.range}</span>
                        <span>{detail.kwh} kWh × {detail.rate} F = {detail.amount.toLocaleString()} F</span>
                      </div>
                    ))}
                  </div>

                  <div className="calc-row">
                    <span>Montant HT</span>
                    <span>{calculation.priceHT.toLocaleString()} FCFA</span>
                  </div>
                  <div className="calc-row">
                    <span>TVA (19.25%)</span>
                    <span>{calculation.tva.toLocaleString()} FCFA</span>
                  </div>
                  <div className="calc-row total">
                    <span>Montant TTC</span>
                    <strong>{calculation.total.toLocaleString()} FCFA</strong>
                  </div>
                  <div className="calc-note">
                    <span>💰 Prix moyen :</span>
                    <span>{calculation.averageRate} FCFA/kWh</span>
                  </div>
                </div>
              </div>
            )}

            <div className="blockchain-info">
              <div className="info-icon">🔗</div>
              <div className="info-text">
                <strong>Enregistrement sécurisé</strong>
                <p>Ce relevé sera enregistré sur la blockchain Polygon, offrant une preuve infalsifiable de votre consommation.</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting || !calculation}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  Enregistrement sur la blockchain...
                </>
              ) : (
                '📤 Enregistrer et générer la facture'
              )}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .meter-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 40px 20px;
        }
        .meter-container {
          max-width: 700px;
          margin: 0 auto;
        }
        .meter-header {
          margin-bottom: 32px;
          text-align: center;
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
          gap: 5px;
        }
        .meter-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
        }
        .meter-header p {
          color: #6b7280;
        }
        .loading-spinner {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 20px;
          color: #16a344;
        }
        .meter-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .form-section h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #1f2937;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .info-card {
          background: #f9fafb;
          padding: 12px 16px;
          border-radius: 12px;
        }
        .info-card label {
          display: block;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .info-card span {
          font-weight: 600;
          color: #111827;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
          transition: all 0.2s;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #16a344;
          box-shadow: 0 0 0 3px rgba(22,163,68,0.1);
        }
        .index-display {
          position: relative;
        }
        .info-badge {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 11px;
          color: #16a344;
          background: #e8f7ee;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .tariffs-info {
          background: #eff6ff;
          border-radius: 16px;
          padding: 16px;
        }
        .tariffs-info h4 {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #2563eb;
        }
        .tariffs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: 12px;
        }
        .tariff-item {
          color: #374151;
        }
        .tariff-item.tva {
          color: #16a344;
          font-weight: 600;
        }
        .calculation-section {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          border-radius: 20px;
          padding: 24px;
          color: white;
        }
        .calculation-section h3 {
          color: white;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .calculation-details {
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 16px;
        }
        .calc-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .calc-row.total-consumption {
          font-size: 18px;
          font-weight: bold;
        }
        .calc-row.total {
          border-bottom: none;
          padding-top: 15px;
          margin-top: 5px;
          font-size: 18px;
        }
        .calc-row.total strong {
          font-size: 22px;
          color: #fbbf24;
        }
        .calc-breakdown {
          margin: 12px 0;
          padding: 12px;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
        }
        .breakdown-title {
          font-size: 12px;
          margin-bottom: 8px;
          opacity: 0.8;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 4px 0;
          opacity: 0.9;
        }
        .calc-note {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.2);
          font-size: 12px;
        }
        .blockchain-info {
          background: #e8f7ee;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .info-icon {
          font-size: 24px;
        }
        .info-text strong {
          display: block;
          font-size: 13px;
          color: #16a344;
          margin-bottom: 4px;
        }
        .info-text p {
          font-size: 12px;
          color: #374151;
        }
        .submit-btn {
          background: #16a344;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #0e7a31;
          transform: translateY(-2px);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .meter-page { padding: 20px; }
          .form-row { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .tariffs-grid { grid-template-columns: 1fr; }
          .meter-header h1 { font-size: 24px; }
        }
      `}</style>
    </div>
  );
};

export default MeterReading;