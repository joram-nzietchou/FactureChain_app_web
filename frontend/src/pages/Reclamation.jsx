import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

// Tarifs ENEO réels officiels
const TARIFFS = [
  { min: 0, max: 110, rate: 50 },      // 50 FCFA/kWh
  { min: 111, max: 220, rate: 79 },    // 79 FCFA/kWh
  { min: 221, max: 400, rate: 94 },    // 94 FCFA/kWh
  { min: 401, max: Infinity, rate: 99 } // 99 FCFA/kWh
];

const TVA_RATE = 0.1925; // 19.25%

/**
 * Calcule le montant attendu selon les tarifs ENEO
 * @param {number} consumption - Consommation en kWh
 * @returns {number} Montant TTC attendu
 */
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

/**
 * Calcule le détail de la facture
 * @param {number} consumption - Consommation en kWh
 * @returns {Object} Détail de la facture
 */
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
      // Charger le dernier relevé
      const readingResponse = await api.get('/meter/last-index');
      if (readingResponse.success && readingResponse.lastIndex > 0) {
        setLastReading(readingResponse.lastIndex);
        setFormData(prev => ({
          ...prev,
          blockchainConsumption: readingResponse.lastIndex
        }));
      }
      
      // Charger la dernière facture
      const dashboardResponse = await api.get('/dashboard');
      if (dashboardResponse.success && dashboardResponse.data?.currentConsumption) {
        setLatestBill(dashboardResponse.data.currentConsumption);
        setFormData(prev => ({
          ...prev,
          eneoAmount: dashboardResponse.data.currentConsumption.eneoAmount || 0
        }));
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
      // Données par défaut pour permettre le test
      setFormData(prev => ({
        ...prev,
        blockchainConsumption: 187,
        eneoAmount: 13813
      }));
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les détails de la facture quand la consommation change
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

  // Calcul des anomalies avec les nouveaux tarifs
  const expectedAmount = calculateExpectedAmount(formData.blockchainConsumption);
  const difference = formData.eneoAmount - expectedAmount;
  const anomalyPercentage = expectedAmount > 0 ? (difference / expectedAmount * 100).toFixed(1) : 0;
  const hasAnomaly = difference > 500; // Seuil de détection

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Chargement des données...
      </div>
    );
  }

  // Écran de confirmation avec preuve blockchain
  if (step === 5 && blockchainInfo) {
    return (
      <div className="reclamation-page">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h1>Réclamation soumise avec succès !</h1>
          
          <div className="blockchain-proof">
            <h3>🔗 Preuve Blockchain</h3>
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
              🔍 Voir sur Polygonscan
            </a>
          </div>

          <div className="buttons">
            <button onClick={() => onNavigate('suivi')} className="btn-primary">
              Suivre ma réclamation
            </button>
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary">
              Retour au Dashboard
            </button>
          </div>
        </div>

        <style>{`
          .reclamation-page {
            min-height: 100vh;
            background: #f3f4f6;
            padding: 32px;
          }
          .success-container {
            max-width: 600px;
            margin: 50px auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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
          .blockchain-proof {
            background: #f3f4f6;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
          }
          .blockchain-proof h3 {
            color: #16a344;
            margin-bottom: 15px;
          }
          .proof-details {
            margin-bottom: 15px;
          }
          .proof-details p {
            margin: 8px 0;
          }
          .tx-hash {
            font-size: 11px;
            word-break: break-all;
            background: white;
            padding: 8px;
            border-radius: 6px;
            display: block;
            margin: 8px 0;
            font-family: monospace;
          }
          .polygonscan-link {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 10px;
          }
          .buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
          }
          .btn-primary, .btn-secondary {
            flex: 1;
            padding: 12px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
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
          @media (max-width: 600px) {
            .reclamation-page { padding: 16px; }
            .buttons { flex-direction: column; }
          }
        `}</style>
      </div>
    );
  }

  // Formulaire principal
  return (
    <div className="reclamation-page">
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: '#16a344', cursor: 'pointer', marginBottom: '20px' }}>
          ← Retour au Dashboard
        </button>

        <div style={{ background: '#16a344', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: 0 }}>
            Nouvelle réclamation
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginTop: '5px' }}>
            Facture de {formData.month} {formData.year}
          </p>
        </div>

        {/* Affichage des tarifs */}
        <div className="tariffs-banner">
          <div className="tariffs-title">Tarifs ENEO officiels</div>
          <div className="tariffs-list">
            <span>0-110 kWh: 50 F/kWh</span>
            <span>111-220 kWh: 79 F/kWh</span>
            <span>221-400 kWh: 94 F/kWh</span>
            <span>401+ kWh: 99 F/kWh</span>
            <span className="tva">TVA: 19.25%</span>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '16px 24px', borderRadius: '50px', marginBottom: '24px' }}>
          {['Identification', 'Anomalies', 'Description', 'Confirmation'].map((label, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step > idx ? '#16a344' : step === idx + 1 ? '#16a344' : '#e5e7eb',
                  color: (step > idx || step === idx + 1) ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold'
                }}>
                  {step > idx ? '✓' : idx + 1}
                </div>
                <span style={{ fontSize: '11px', color: step === idx + 1 ? '#16a344' : '#9ca3af' }}>{label}</span>
              </div>
              {idx < 3 && <div style={{ width: '30px', height: '2px', background: step > idx ? '#16a344' : '#e5e7eb' }} />}
            </div>
          ))}
        </div>

        {/* Étape 1: Identification */}
        {step === 1 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ color: '#2563eb', fontSize: '14px', marginBottom: '20px' }}>INFORMATIONS DE L'ABONNÉ</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Numéro abonné:</strong>
                <span style={{ display: 'block', marginTop: '4px' }}>{user?.subscriberNumber || 'Non renseigné'}</span>
              </div>
              <div>
                <strong>Mois contesté:</strong>
                <select name="month" value={formData.month} onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <strong>Année:</strong>
                <select name="year" value={formData.year} onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  {[2025, 2024, 2023, 2022].map(y => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <strong>Nom complet:</strong>
                <span style={{ display: 'block', marginTop: '4px' }}>{user?.fullName || user?.email?.split('@')[0] || 'Utilisateur'}</span>
              </div>
              <div>
                <strong>Email:</strong>
                <span style={{ display: 'block', marginTop: '4px' }}>{user?.email || 'Non renseigné'}</span>
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', marginTop: '24px', float: 'right', cursor: 'pointer' }}>
              Suivant →
            </button>
          </div>
        )}

        {/* Étape 2: Anomalies - avec nouveaux tarifs */}
        {step === 2 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '20px' }}>⚠ ANOMALIE DÉTECTÉE</h3>
            
            {formData.blockchainConsumption > 0 && formData.eneoAmount > 0 ? (
              <div>
                {/* Informations générales */}
                <div style={{ background: '#f3f4f6', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Consommation relevée :</span>
                    <strong>{formData.blockchainConsumption} kWh</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Montant facturé ENEO :</span>
                    <strong>{formData.eneoAmount.toLocaleString()} FCFA</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Montant attendu (tarifs ENEO) :</span>
                    <strong>{expectedAmount.toLocaleString()} FCFA</strong>
                  </div>
                </div>

                {/* Détail du calcul */}
                {billDetails && (
                  <div className="bill-details">
                    <div className="details-title">Détail du calcul selon les tranches ENEO :</div>
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

                {/* Résultat de l'analyse */}
                <div style={{ 
                  background: hasAnomaly ? '#fef2f2' : '#e8f7ee', 
                  borderRadius: '12px', 
                  padding: '16px', 
                  marginTop: '20px',
                  border: `1px solid ${hasAnomaly ? '#fca5a5' : '#86efac'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {hasAnomaly ? '⚠️ Anomalie détectée' : '✓ Facture conforme'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {hasAnomaly 
                          ? `Différence constatée : ${difference.toLocaleString()} FCFA (${anomalyPercentage}%)`
                          : 'Le montant facturé correspond aux tarifs ENEO officiels'}
                      </div>
                    </div>
                    {hasAnomaly && (
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                        +{anomalyPercentage}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>Veuillez vérifier vos données de consommation</p>
                <button 
                  onClick={() => {
                    setFormData({
                      ...formData,
                      blockchainConsumption: 187,
                      eneoAmount: 13813
                    });
                  }}
                  style={{ marginTop: '16px', padding: '8px 16px', background: '#16a344', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Utiliser des valeurs de test
                </button>
              </div>
            )}
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}>
                ← Retour
              </button>
              <button 
                onClick={() => setStep(3)} 
                style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Étape 3: Description */}
        {step === 3 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ color: '#16a344', fontSize: '14px', marginBottom: '20px' }}>DESCRIPTION DU LITIGE</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre litige..."
              rows="6"
              style={{ width: '100%', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', resize: 'vertical' }}
              required
            />
            <div style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '8px', fontSize: '12px', color: '#6b7280' }}>
              <strong>Exemple :</strong> Je constate une différence entre ma consommation réelle et le montant facturé par ENEO. Ma consommation est de {formData.blockchainConsumption} kWh, ce qui devrait correspondre à environ {expectedAmount.toLocaleString()} FCFA TTC selon les tarifs officiels. Or, ENEO me facture {formData.eneoAmount.toLocaleString()} FCFA, soit une différence de {Math.abs(difference).toLocaleString()} FCFA.
            </div>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(2)} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}>
                ← Retour
              </button>
              <button 
                onClick={() => setStep(4)} 
                disabled={!formData.description.trim()}
                style={{ 
                  background: formData.description.trim() ? '#16a344' : '#9ca3af', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '12px', 
                  cursor: formData.description.trim() ? 'pointer' : 'not-allowed' 
                }}
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ color: '#16a344', fontSize: '14px', marginBottom: '20px' }}>✅ Récapitulatif de votre réclamation</h3>
            <div style={{ background: '#e8f7ee', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #c8e6d9' }}>
                <span>Réclamation #</span>
                <strong>RC-{formData.year}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #c8e6d9' }}>
                <span>Date</span>
                <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #c8e6d9' }}>
                <span>Consommation relevée</span>
                <strong>{formData.blockchainConsumption} kWh</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #c8e6d9' }}>
                <span>Montant facturé</span>
                <strong>{formData.eneoAmount.toLocaleString()} FCFA</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #c8e6d9' }}>
                <span>Montant attendu (tarifs ENEO)</span>
                <strong>{expectedAmount.toLocaleString()} FCFA</strong>
              </div>
              {difference !== 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span>Écart constaté</span>
                  <strong style={{ color: difference > 0 ? '#ef4444' : '#16a344' }}>
                    {difference > 0 ? '+' : ''}{Math.round(difference).toLocaleString()} FCFA ({anomalyPercentage}%)
                  </strong>
                </div>
              )}
            </div>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(3)} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}>
                ← Retour
              </button>
              <button onClick={handleSubmit} disabled={submitting} style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}>
                {submitting ? 'Soumission...' : 'Soumettre la réclamation'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reclamation-page {
          min-height: 100vh;
          background: #f3f4f6;
          padding: 32px;
        }
        .tariffs-banner {
          background: #eff6ff;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tariffs-title {
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
        }
        .tariffs-list {
          display: flex;
          gap: 16px;
          font-size: 11px;
          flex-wrap: wrap;
        }
        .tariffs-list span {
          color: #374151;
        }
        .tariffs-list .tva {
          color: #16a344;
          font-weight: 600;
        }
        .bill-details {
          background: #f9fafb;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
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
        .detail-row.subtotal, .detail-row.total {
          padding-top: 10px;
          margin-top: 5px;
          border-top: 1px solid #e5e7eb;
          font-weight: 600;
          color: #111827;
        }
        .detail-row.total strong {
          color: #16a344;
        }
        @media (max-width: 768px) {
          .reclamation-page { padding: 16px; }
          .tariffs-banner { flex-direction: column; text-align: center; }
          .tariffs-list { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Reclamation;