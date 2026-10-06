import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

// Icônes SVG
const Icons = {
  back: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  user: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-10 7L2 7"/>
    </svg>
  ),
  warning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ),
  check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a344" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  blockchain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  arrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  bolt: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  file: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
};

// Tarifs ENEO réels officiels
const TARIFFS = [
  { min: 0, max: 110, rate: 50 },
  { min: 111, max: 220, rate: 79 },
  { min: 221, max: 400, rate: 94 },
  { min: 401, max: Infinity, rate: 99 }
];

const TVA_RATE = 0.1925;

const calculateExpectedAmount = (consumption) => {
  if (consumption <= 0) return 0;
  
  let amount = 0;
  let remaining = consumption;
  
  for (const tier of TARIFFS) {
    if (remaining <= 0) break;
    
    const tierMax = tier.max === Infinity ? remaining : tier.max;
    const tierRange = Math.min(remaining, tierMax - tier.min + 1);
    amount += tierRange * tier.rate;
    remaining -= tierRange;
  }
  
  const tva = amount * TVA_RATE;
  return Math.round(amount + tva);
};

const getBillDetails = (consumption) => {
  if (consumption <= 0) return null;
  
  let price = 0;
  let remaining = consumption;
  let details = [];
  
  for (const tier of TARIFFS) {
    if (remaining <= 0) break;
    
    const tierMax = tier.max === Infinity ? remaining : tier.max;
    const tierRange = Math.min(remaining, tierMax - tier.min + 1);
    
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

const Reclamation = ({ onNavigate }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [lastReading, setLastReading] = useState(null);
  const [latestBill, setLatestBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billDetails, setBillDetails] = useState(null);
  const [formData, setFormData] = useState({
    subscriberNumber: user?.subscriberNumber || '',
    month: new Date().toLocaleString('fr-FR', { month: 'long' }),
    year: new Date().getFullYear(),
    blockchainConsumption: 0,
    eneoAmount: 0,
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const readingResponse = await api.get('/meter/last-index');
      if (readingResponse.success && readingResponse.lastIndex > 0) {
        setLastReading(readingResponse.lastIndex);
        setFormData(prev => ({ ...prev, blockchainConsumption: readingResponse.lastIndex }));
      }
      
      const dashboardResponse = await api.get('/dashboard');
      if (dashboardResponse.success && dashboardResponse.data?.currentConsumption) {
        setLatestBill(dashboardResponse.data.currentConsumption);
        setFormData(prev => ({ ...prev, eneoAmount: dashboardResponse.data.currentConsumption.eneoAmount || 0 }));
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setFormData(prev => ({ ...prev, blockchainConsumption: 187, eneoAmount: 13813 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.blockchainConsumption > 0) {
      const details = getBillDetails(formData.blockchainConsumption);
      setBillDetails(details);
    } else {
      setBillDetails(null);
    }
  }, [formData.blockchainConsumption]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await claimService.createClaim(formData);
      if (response.success) {
        setBlockchainInfo(response.data.blockchain);
        setStep(5);
      } else {
        alert('Erreur: ' + (response.error || 'Erreur lors de la soumission'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la soumission: ' + (error.message || 'Vérifiez que le backend est démarré'));
    } finally {
      setSubmitting(false);
    }
  };

  const expectedAmount = calculateExpectedAmount(formData.blockchainConsumption);
  const difference = formData.eneoAmount - expectedAmount;
  const anomalyPercentage = expectedAmount > 0 ? (difference / expectedAmount * 100).toFixed(1) : 0;
  const hasAnomaly = difference > 500;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos données...</p>
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

  if (step === 5 && blockchainInfo) {
    return (
      <div className="reclamation-page">
        <div className="success-container">
          <div className="success-icon">
            <Icons.check />
          </div>
          <h1>Réclamation soumise avec succès !</h1>
          
          <div className="blockchain-proof">
            <h3>
              <Icons.blockchain />
              <span>Preuve Blockchain</span>
            </h3>
            <div className="proof-details">
              <p><strong>Hash de transaction :</strong></p>
              <code className="tx-hash">{blockchainInfo.transactionHash}</code>
              <p><strong>ID Réclamation :</strong> {blockchainInfo.claimId || blockchainInfo.readingId || '—'}</p>
              <p><strong>Bloc :</strong> {blockchainInfo.blockNumber}</p>
              <p><strong>Réseau :</strong> Polygon Amoy</p>
            </div>
            <a 
              href={`https://amoy.polygonscan.com/tx/${blockchainInfo.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="polygonscan-link"
            >
              <Icons.link />
              <span>Voir sur Polygonscan</span>
            </a>
          </div>

          <div className="buttons">
            <button onClick={() => onNavigate('suivi')} className="btn-primary">
              Suivre ma réclamation
            </button>
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary">
              Retour au tableau de bord
            </button>
          </div>
        </div>

        <style>{`
          .reclamation-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 32px;
            font-family: 'Inter', sans-serif;
          }
          .success-container {
            max-width: 600px;
            margin: 50px auto;
            background: white;
            border-radius: 32px;
            padding: 48px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            animation: fadeInUp 0.5s ease-out;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .success-icon svg {
            width: 64px;
            height: 64px;
            margin-bottom: 20px;
          }
          h1 {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 28px;
            margin-bottom: 30px;
          }
          .blockchain-proof {
            background: #f8fafc;
            border-radius: 20px;
            padding: 24px;
            margin: 24px 0;
            text-align: left;
            border: 1px solid #e2e8f0;
          }
          .blockchain-proof h3 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #f59e0b;
          }
          .blockchain-proof h3 svg {
            width: 20px;
            height: 20px;
          }
          .proof-details p {
            margin: 12px 0;
            font-size: 13px;
          }
          .tx-hash {
            display: block;
            font-size: 11px;
            word-break: break-all;
            background: white;
            padding: 12px;
            border-radius: 10px;
            margin: 8px 0;
            font-family: monospace;
            border: 1px solid #e2e8f0;
          }
          .polygonscan-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 40px;
            text-decoration: none;
            margin-top: 16px;
            font-size: 13px;
            font-weight: 600;
          }
          .buttons {
            display: flex;
            gap: 16px;
            margin-top: 32px;
          }
          .btn-primary, .btn-secondary {
            flex: 1;
            padding: 14px;
            border-radius: 40px;
            cursor: pointer;
            font-weight: 600;
            border: none;
            transition: all 0.3s;
          }
          .btn-primary {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(245,158,11,0.3);
          }
          .btn-secondary {
            background: white;
            border: 1.5px solid #f59e0b;
            color: #f59e0b;
          }
          .btn-secondary:hover {
            background: #fef3c7;
            transform: translateY(-2px);
          }
          @media (max-width: 600px) {
            .reclamation-page { padding: 16px; }
            .success-container { padding: 32px 24px; }
            .buttons { flex-direction: column; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="reclamation-page">
      <div className="reclamation-container">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>
          <Icons.back />
          <span>Retour au tableau de bord</span>
        </button>

        <div className="header-card">
          <h1>
            <Icons.file />
            Nouvelle réclamation
          </h1>
          <p>Facture de {formData.month} {formData.year}</p>
        </div>

        {/* Affichage des tarifs */}
        <div className="tariffs-banner">
          <div className="tariffs-title">
            <Icons.bolt />
            <span>Tarifs ENEO officiels</span>
          </div>
          <div className="tariffs-list">
            <span>0-110 kWh: 50 FCFA/kWh</span>
            <span>111-220 kWh: 79 FCFA/kWh</span>
            <span>221-400 kWh: 94 FCFA/kWh</span>
            <span>401+ kWh: 99 FCFA/kWh</span>
            <span className="tva">TVA: 19.25%</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {['Identification', 'Anomalies', 'Description', 'Confirmation'].map((label, idx) => (
            <div key={idx} className={`step-item ${step > idx ? 'completed' : step === idx + 1 ? 'active' : ''}`}>
              <div className="step-circle">{step > idx ? '✓' : idx + 1}</div>
              <span>{label}</span>
              {idx < 3 && <div className={`step-line ${step > idx ? 'completed' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Étape 1: Identification */}
        {step === 1 && (
          <div className="form-card">
            <h3>
              <Icons.user />
              INFORMATIONS DE L'ABONNÉ
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Numéro abonné</label>
                <span>{user?.subscriberNumber || 'Non renseigné'}</span>
              </div>
              <div className="info-field">
                <label>Mois contesté</label>
                <select name="month" value={formData.month} onChange={handleChange}>
                  {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="info-field">
                <label>Année</label>
                <select name="year" value={formData.year} onChange={handleChange}>
                  {[2025, 2024, 2023, 2022].map(y => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="info-field">
                <label>Nom complet</label>
                <span>{user?.fullName || user?.email?.split('@')[0] || 'Utilisateur'}</span>
              </div>
              <div className="info-field">
                <label>Email</label>
                <span>{user?.email || 'Non renseigné'}</span>
              </div>
            </div>
            <button className="next-btn" onClick={() => setStep(2)}>
              Suivant
              <Icons.arrowRight />
            </button>
          </div>
        )}

        {/* Étape 2: Anomalies */}
        {step === 2 && (
          <div className="form-card">
            <h3>
              <Icons.warning />
              ANOMALIE DÉTECTÉE
            </h3>
            
            {formData.blockchainConsumption > 0 && formData.eneoAmount > 0 ? (
              <>
                <div className="comparison-box">
                  <div className="comparison-row">
                    <span>Consommation relevée</span>
                    <strong>{formData.blockchainConsumption} kWh</strong>
                  </div>
                  <div className="comparison-row">
                    <span>Montant facturé ENEO</span>
                    <strong>{formData.eneoAmount.toLocaleString()} FCFA</strong>
                  </div>
                  <div className="comparison-row highlight">
                    <span>Montant attendu</span>
                    <strong>{expectedAmount.toLocaleString()} FCFA</strong>
                  </div>
                </div>

                {billDetails && (
                  <div className="bill-details">
                    <div className="details-title">Détail du calcul par tranche :</div>
                    {billDetails.details.map((detail, idx) => (
                      <div key={idx} className="detail-row">
                        <span>{detail.range}</span>
                        <span>{detail.kwh} kWh × {detail.rate} F = {detail.amount.toLocaleString()} F</span>
                      </div>
                    ))}
                    <div className="detail-row subtotal">
                      <span>Sous-total HT</span>
                      <span>{billDetails.priceHT.toLocaleString()} FCFA</span>
                    </div>
                    <div className="detail-row">
                      <span>TVA (19.25%)</span>
                      <span>{billDetails.tva.toLocaleString()} FCFA</span>
                    </div>
                    <div className="detail-row total">
                      <span>Total TTC attendu</span>
                      <strong>{billDetails.total.toLocaleString()} FCFA</strong>
                    </div>
                  </div>
                )}

                <div className={`analysis-result ${hasAnomaly ? 'anomaly' : 'normal'}`}>
                  <div className="result-icon">
                    {hasAnomaly ? <Icons.warning /> : <Icons.check />}
                  </div>
                  <div className="result-text">
                    <div className="result-title">
                      {hasAnomaly ? 'Anomalie détectée' : 'Facture conforme'}
                    </div>
                    <div className="result-desc">
                      {hasAnomaly 
                        ? `Différence constatée : ${difference.toLocaleString()} FCFA (${anomalyPercentage}%)`
                        : 'Le montant facturé correspond aux tarifs ENEO officiels'}
                    </div>
                  </div>
                  {hasAnomaly && (
                    <div className="result-percentage">+{anomalyPercentage}%</div>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-data">
                <p>Veuillez vérifier vos données de consommation</p>
                <button className="test-btn" onClick={() => {
                  setFormData({ ...formData, blockchainConsumption: 187, eneoAmount: 13813 });
                }}>
                  Utiliser des valeurs de test
                </button>
              </div>
            )}
            
            <div className="form-actions">
              <button className="back-btn-step" onClick={() => setStep(1)}>Retour</button>
              <button className="next-btn" onClick={() => setStep(3)}>Suivant</button>
            </div>
          </div>
        )}

        {/* Étape 3: Description */}
        {step === 3 && (
          <div className="form-card">
            <h3>
              <Icons.file />
              DESCRIPTION DU LITIGE
            </h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre litige..."
              rows="6"
              required
            />
            <div className="example-box">
              <strong>Exemple :</strong> Je constate une différence entre ma consommation réelle et le montant facturé par ENEO. Ma consommation est de {formData.blockchainConsumption} kWh, ce qui devrait correspondre à environ {expectedAmount.toLocaleString()} FCFA TTC selon les tarifs officiels. Or, ENEO me facture {formData.eneoAmount.toLocaleString()} FCFA, soit une différence de {Math.abs(difference).toLocaleString()} FCFA.
            </div>
            <div className="form-actions">
              <button className="back-btn-step" onClick={() => setStep(2)}>Retour</button>
              <button 
                className="next-btn"
                onClick={() => setStep(4)} 
                disabled={!formData.description.trim()}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <div className="form-card">
            <h3>Récapitulatif de votre réclamation</h3>
            <div className="summary-box">
              <div className="summary-row">
                <span>Réclamation #</span>
                <strong>RC-{formData.year}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</strong>
              </div>
              <div className="summary-row">
                <span>Date</span>
                <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
              </div>
              <div className="summary-row">
                <span>Consommation relevée</span>
                <strong>{formData.blockchainConsumption} kWh</strong>
              </div>
              <div className="summary-row">
                <span>Montant facturé</span>
                <strong>{formData.eneoAmount.toLocaleString()} FCFA</strong>
              </div>
              <div className="summary-row">
                <span>Montant attendu</span>
                <strong>{expectedAmount.toLocaleString()} FCFA</strong>
              </div>
              {difference !== 0 && (
                <div className="summary-row highlight">
                  <span>Écart constaté</span>
                  <strong className={difference > 0 ? 'text-error' : 'text-success'}>
                    {difference > 0 ? '+' : ''}{Math.round(difference).toLocaleString()} FCFA ({anomalyPercentage}%)
                  </strong>
                </div>
              )}
            </div>
            <div className="form-actions">
              <button className="back-btn-step" onClick={() => setStep(3)}>Retour</button>
              <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Soumission en cours...' : 'Soumettre la réclamation'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reclamation-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 32px;
          font-family: 'Inter', sans-serif;
        }

        .reclamation-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #f59e0b;
          cursor: pointer;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: #d97706;
        }

        .header-card {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          color: white;
        }

        .header-card h1 {
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .header-card p {
          opacity: 0.9;
          font-size: 14px;
        }

        .tariffs-banner {
          background: #fef3c7;
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .tariffs-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #f59e0b;
        }

        .tariffs-list {
          display: flex;
          gap: 20px;
          font-size: 12px;
          flex-wrap: wrap;
        }

        .tariffs-list .tva {
          color: #f59e0b;
          font-weight: 600;
        }

        .stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 20px 32px;
          border-radius: 60px;
          margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: #64748b;
        }

        .step-item.completed .step-circle {
          background: #16a344;
          color: white;
        }

        .step-item.active .step-circle {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.2);
        }

        .step-item span {
          font-size: 13px;
          color: #64748b;
        }

        .step-item.active span {
          color: #f59e0b;
          font-weight: 600;
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin-left: 12px;
        }

        .step-line.completed {
          background: #16a344;
        }

        .form-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .form-card h3 {
          font-size: 14px;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .info-field label {
          display: block;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .info-field span, .info-field select {
          font-weight: 600;
          font-size: 14px;
          color: #0f172a;
        }

        .info-field select {
          width: 100%;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .comparison-box {
          background: #f8fafc;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .comparison-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .comparison-row:last-child {
          border-bottom: none;
        }

        .comparison-row.highlight {
          background: #fef3c7;
          margin: 0 -20px -20px -20px;
          padding: 16px 20px;
          border-radius: 0 0 16px 16px;
          font-weight: 700;
        }

        .bill-details {
          background: #f1f5f9;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .details-title {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #f59e0b;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 6px 0;
          color: #475569;
        }

        .detail-row.subtotal, .detail-row.total {
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1px solid #cbd5e1;
          font-weight: 600;
          color: #0f172a;
        }

        .analysis-result {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-radius: 16px;
          margin-top: 24px;
        }

        .analysis-result.anomaly {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .analysis-result.normal {
          background: #e8f7ee;
          border: 1px solid #86efac;
        }

        .result-icon svg {
          width: 24px;
          height: 24px;
        }

        .result-text {
          flex: 1;
        }

        .result-title {
          font-weight: 700;
          margin-bottom: 4px;
        }

        .result-desc {
          font-size: 12px;
          color: #64748b;
        }

        .result-percentage {
          font-size: 24px;
          font-weight: 700;
          color: #ef4444;
        }

        .empty-data {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }

        .test-btn {
          margin-top: 16px;
          padding: 8px 20px;
          background: #f59e0b;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        textarea {
          width: 100%;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          font-size: 13px;
          resize: vertical;
          font-family: inherit;
        }

        textarea:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .example-box {
          margin-top: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 32px;
        }

        .back-btn-step {
          padding: 12px 24px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
        }

        .next-btn, .submit-btn {
          padding: 12px 32px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .next-btn:hover, .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245,158,11,0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .summary-box {
          background: #fef3c7;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #fde68a;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row.highlight {
          margin: 0 -20px -20px -20px;
          padding: 16px 20px;
          border-radius: 0 0 16px 16px;
          background: #fde68a;
        }

        .text-error {
          color: #ef4444;
        }

        .text-success {
          color: #16a344;
        }

        @media (max-width: 768px) {
          .reclamation-page { padding: 16px; }
          .stepper { flex-wrap: wrap; border-radius: 20px; gap: 16px; }
          .info-grid { grid-template-columns: 1fr; }
          .tariffs-list { justify-content: center; }
          .step-item { flex: none; width: 100%; }
          .step-line { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Reclamation;