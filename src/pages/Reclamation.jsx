import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Reclamation = ({ onNavigate }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState('');

  const steps = [
    { number: 1, title: 'Identification', icon: '👤' },
    { number: 2, title: 'Anomalies', icon: '⚠️' },
    { number: 3, title: 'Preuves', icon: '🔗' },
    { number: 4, title: 'Confirmation', icon: '✅' }
  ];

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '24px', 
          padding: '48px', 
          textAlign: 'center', 
          maxWidth: '500px',
          animation: 'fadeInUp 0.5s ease-out'
        }}>
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes checkmark {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#16a34420', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'checkmark 0.5s ease-out'
          }}>
            <div style={{ fontSize: '48px' }}>✅</div>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#16a344', marginBottom: '12px' }}>
            Réclamation soumise avec succès !
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>
            Référence : <strong style={{ fontFamily: 'monospace' }}>#RC-2025-00419</strong>
          </p>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
            Votre réclamation a été enregistrée sur la blockchain Polygon
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => onNavigate('dashboard')}
              style={{
                background: '#16a344',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retour au Dashboard
            </button>
            <button
              onClick={() => onNavigate('suivi')}
              style={{
                background: 'white',
                border: '2px solid #16a344',
                color: '#16a344',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Suivre ma réclamation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb', marginBottom: '20px' }}>
              INFORMATIONS DE L'ABONNÉ
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Numéro abonné</div>
                <div style={{ fontWeight: '600' }}>CM-YDE-004821</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Mois contesté</div>
                <div style={{ fontWeight: '600' }}>Juillet 2025</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Nom complet</div>
                <div style={{ fontWeight: '600' }}>{user?.name || 'Jean-Baptiste Kamga'}</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Email</div>
                <div style={{ fontWeight: '600' }}>{user?.email || 'jean.kamga@email.com'}</div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ 
              background: '#fef2f2', 
              borderRadius: '16px', 
              padding: '20px',
              border: '1px solid #fca5a5',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <span style={{ fontWeight: '700', color: '#ef4444' }}>Anomalie confirmée</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #fecaca' }}>
                <span>Surfacturation détectée</span>
                <span style={{ fontWeight: '700', color: '#ef4444' }}>+25%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #fecaca' }}>
                <span>Consommation blockchain</span>
                <span style={{ fontWeight: '600' }}>18 700 kWh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #fecaca' }}>
                <span>Montant facturé ENEO</span>
                <span style={{ fontWeight: '600' }}>23 400 FCFA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #fecaca' }}>
                <span>Différence constatée</span>
                <span style={{ fontWeight: '700', color: '#ef4444' }}>4 700 FCFA</span>
              </div>
            </div>
            
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>DESCRIPTION DU LITIGE</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre litige..."
              rows="5"
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        );
      case 3:
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{
              background: '#e8f7ee',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #86efac'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', background: '#16a344', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px' }}>🔗</span>
                </div>
                <div>
                  <h3 style={{ fontWeight: '700', color: '#16a344' }}>PREUVE BLOCKCHAIN</h3>
                  <p style={{ fontSize: '11px', color: '#6b7280' }}>Infalsifiable et vérifiable publiquement</p>
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', padding: '16px', fontFamily: 'monospace', fontSize: '11px' }}>
                <div style={{ color: '#6b7280', marginBottom: '8px' }}>Transaction blockchain</div>
                <div style={{ wordBreak: 'break-all', marginBottom: '12px' }}>0x4ffa39b2c1e8d7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280' }}>
                  <span>📅 16 Août 2025 — 09:42:17 UTC</span>
                  <span>🔗 Polygon (Matic)</span>
                  <span>✅ 32 confirmations</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{
              background: '#e8f7ee',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Récapitulatif de votre réclamation</h3>
              <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginTop: '20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#6b7280' }}>Réclamation #</span>
                  <span style={{ fontWeight: '600' }}>RC-2025-00419</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#6b7280' }}>Date</span>
                  <span style={{ fontWeight: '600' }}>{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#6b7280' }}>Montant contesté</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>4 700 FCFA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#6b7280' }}>Anomalie</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>+25%</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '32px' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            style={{ background: 'none', border: 'none', color: '#16a344', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}
          >
            ← Retour au Dashboard
          </button>
          <div style={{ background: '#16a344', borderRadius: '16px', padding: '20px' }}>
            <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>Nouvelle réclamation</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Facture de juillet 2025</p>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', background: 'white', padding: '16px 24px', borderRadius: '50px' }}>
          {steps.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: step >= s.number ? '#16a344' : '#e5e7eb',
                  color: step >= s.number ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {step > s.number ? '✓' : s.number}
                </div>
                <span style={{ fontSize: '12px', fontWeight: step === s.number ? '600' : '400', color: step === s.number ? '#16a344' : '#6b7280' }}>
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div style={{ width: '40px', height: '2px', background: step > s.number ? '#16a344' : '#e5e7eb' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: '14px 24px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Précédent
            </button>
          )}
          <button
            onClick={() => step < 4 ? setStep(step + 1) : setSubmitted(true)}
            style={{
              padding: '14px 32px',
              background: '#16a344',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: step === 1 ? 'auto' : 0
            }}
          >
            {step < 4 ? 'Suivant →' : 'Soumettre la réclamation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reclamation;