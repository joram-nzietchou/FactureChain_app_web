import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import claimService from '../services/claimService';
import api from '../services/api';

const Reclamation = ({ onNavigate }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [formData, setFormData] = useState({
    subscriberNumber: user?.subscriberNumber || '',
    month: 'Juillet',
    year: 2025,
    blockchainConsumption: 18700,
    eneoAmount: 23400,
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await claimService.createClaim(formData);
      if (response.success) {
        setSubmittedClaim(response.data.claim);
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

  const difference = formData.eneoAmount - (formData.blockchainConsumption * 1.2);
  const anomalyPercentage = (difference / formData.eneoAmount * 100).toFixed(0);

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
              <p><strong>ID Réclamation Blockchain :</strong> {blockchainInfo.claimId || '—'}</p>
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
        `}</style>
      </div>
    );
  }

  // Formulaire principal (étapes 1-4)
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
              <div><strong>Numéro abonné:</strong> {user?.subscriberNumber || 'CM-YDE-004821'}</div>
              <div>
                <strong>Mois contesté:</strong>
                <select name="month" value={formData.month} onChange={handleChange} style={{ marginLeft: '8px', padding: '4px' }}>
                  {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div><strong>Nom complet:</strong> {user?.fullName || 'Jean-Baptiste Kamga'}</div>
              <div><strong>Email:</strong> {user?.email || 'jean.kamga@email.com'}</div>
            </div>
            <button onClick={() => setStep(2)} style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', marginTop: '24px', float: 'right', cursor: 'pointer' }}>
              Suivant →
            </button>
          </div>
        )}

        {/* Étape 2: Anomalies */}
        {step === 2 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '20px' }}>⚠ ANOMALIE DÉTECTÉE</h3>
            <div style={{ background: '#fef2f2', borderRadius: '12px', border: '1px solid #fca5a5', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>
                <strong>Anomalie confirmée</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>
                <span>Surfacturation détectée</span>
                <strong>+{anomalyPercentage}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>
                <span>Consommation blockchain</span>
                <strong>{formData.blockchainConsumption} kWh</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #fecaca' }}>
                <span>Montant facturé ENEO</span>
                <strong>{formData.eneoAmount} FCFA</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fecaca' }}>
                <span>Différence constatée</span>
                <strong>{Math.abs(difference).toFixed(0)} FCFA</strong>
              </div>
            </div>
            <button onClick={() => setStep(1)} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '12px', marginTop: '24px', cursor: 'pointer' }}>
              ← Retour
            </button>
            <button onClick={() => setStep(3)} style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', marginTop: '24px', float: 'right', cursor: 'pointer' }}>
              Suivant →
            </button>
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
              <strong>Exemple :</strong> Ma consommation est identique aux mois précédents (environ 14 000–15 000 kWh) mais la facture de juillet 2025 affiche 18 700 kWh...
            </div>
            <button onClick={() => setStep(2)} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '12px', marginTop: '24px', cursor: 'pointer' }}>
              ← Retour
            </button>
            <button onClick={() => setStep(4)} style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', marginTop: '24px', float: 'right', cursor: 'pointer' }}>
              Suivant →
            </button>
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
                <span>Montant contesté</span>
                <strong style={{ color: '#ef4444' }}>{Math.abs(difference).toFixed(0)} FCFA</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Anomalie</span>
                <strong style={{ color: '#ef4444' }}>+{anomalyPercentage}%</strong>
              </div>
            </div>
            <button onClick={() => setStep(3)} style={{ background: 'white', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}>
              ← Retour
            </button>
            <button onClick={handleSubmit} disabled={submitting} style={{ background: '#16a344', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', float: 'right', cursor: 'pointer' }}>
              {submitting ? 'Soumission...' : 'Soumettre la réclamation'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .reclamation-page {
          min-height: 100vh;
          background: #f3f4f6;
          padding: 32px;
        }
        @media (max-width: 768px) {
          .reclamation-page {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Reclamation;