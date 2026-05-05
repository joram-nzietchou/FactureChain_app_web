import React, { useState } from 'react';

const Suivi = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('current');

  const claim = {
    reference: 'RC-2025-00419',
    hash: '0x4f3a9b2c1e8d71f6a5b4c3d2e1f0d9b8c7d6e5f4a',
    eneoAmount: 23400,
    blockchainAmount: 18700,
    difference: 4700,
    status: 'En cours de traitement',
    currentStep: 3, // 1: soumis, 2: eneo, 3: arsel, 4: resolu
    steps: [
      { name: 'Soumis', status: 'completed', date: '15/07/2025 - 10:32', tx: '0x4f3a...e5f4a' },
      { name: 'ENEO', status: 'completed', date: '15/07/2025 - 11:10', tx: null },
      { name: 'ARSEL', status: 'active', date: 'En cours', tx: null },
      { name: 'Résolu', status: 'pending', date: 'À venir', tx: null }
    ]
  };

  const timeline = [
    { step: 1, title: 'Réclamation soumise', status: 'completed', date: '15 juillet 2025 - 10:32', description: 'Confirmé', tx: '0x4f3a...e5f4a' },
    { step: 2, title: 'Transmise à ENEO', status: 'completed', date: '15 juillet 2025 - 11:10', description: 'Confirmé', tx: null },
    { step: 3, title: 'En attente de réponse ENEO', status: 'active', date: 'En cours', description: 'Délai légal : 15 jours ouvrés', tx: null },
    { step: 4, title: 'Résolution finale', status: 'pending', date: 'À venir', description: 'Remboursement ou régularisation', tx: null }
  ];

  const zoneStats = [
    { label: 'Réclamations actives', value: 47, color: '#2563eb' },
    { label: 'Surfacturation', value: 28, color: '#f59e0b' },
    { label: 'Erreur de relevé', value: 12, color: '#ef4444' },
    { label: 'Résolues ce mois', value: 35, color: '#16a344' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '32px' }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .timeline-item {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
        .timeline-item:nth-child(1) { animation-delay: 0.1s; }
        .timeline-item:nth-child(2) { animation-delay: 0.2s; }
        .timeline-item:nth-child(3) { animation-delay: 0.3s; }
        .timeline-item:nth-child(4) { animation-delay: 0.4s; }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            style={{ background: 'none', border: 'none', color: '#16a344', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}
          >
            ← Retour au Dashboard
          </button>
        </div>

        {/* Informations principales */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '48px', height: '48px', background: '#2563eb20', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px' }}>📋</span>
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Réclamation {claim.reference}</h1>
                  <p style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>Hash: {claim.hash}...</p>
                </div>
              </div>
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: '#fef2f2',
              color: '#ef4444',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              En cours
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Facture contestée</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>{claim.eneoAmount.toLocaleString('fr-FR')} FCFA</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Montant blockchain</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a344' }}>{claim.blockchainAmount.toLocaleString('fr-FR')} FCFA</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Écart</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{claim.difference.toLocaleString('fr-FR')} FCFA</div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            {claim.steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: step.status === 'completed' ? '#16a344' : step.status === 'active' ? '#f59e0b' : '#e5e7eb',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: '20px',
                    animation: step.status === 'active' ? 'pulse 2s infinite' : 'none'
                  }}>
                    {step.status === 'completed' ? '✓' : step.name.charAt(0)}
                  </div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{step.name}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>{step.date}</div>
                </div>
                {idx < claim.steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: step.status === 'completed' ? '#16a344' : '#e5e7eb',
                    marginTop: '24px'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={{ background: '#fef2f2', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ animation: 'pulse 2s infinite' }}>⏳</span>
            <div>
              <div style={{ fontWeight: '600' }}>{claim.status}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Transmise à ENEO - Délai légal : 15 jours ouvrés</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('current')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'current' ? '2px solid #16a344' : 'none',
              color: activeTab === 'current' ? '#16a344' : '#6b7280',
              fontWeight: activeTab === 'current' ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Suivi détaillé
          </button>
          <button
            onClick={() => setActiveTab('zone')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'zone' ? '2px solid #16a344' : 'none',
              color: activeTab === 'zone' ? '#16a344' : '#6b7280',
              fontWeight: activeTab === 'zone' ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Statistiques zone
          </button>
        </div>

        {/* Timeline */}
        {activeTab === 'current' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Suivi détaillé du traitement</h3>
            {timeline.map((item, idx) => (
              <div key={idx} className="timeline-item" style={{ display: 'flex', gap: '16px', marginBottom: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: item.status === 'completed' ? '#16a344' : item.status === 'active' ? '#f59e0b' : '#e5e7eb'
                  }} />
                  {idx < timeline.length - 1 && (
                    <div style={{ width: '2px', flex: 1, background: '#e5e7eb', marginTop: '4px' }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: idx < timeline.length - 1 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{item.title}</h4>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{item.date}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{item.description}</p>
                  {item.status === 'completed' && (
                    <span style={{ display: 'inline-block', padding: '2px 8px', background: '#e8f7ee', color: '#0e7a31', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>
                      ✓ Confirmé
                    </span>
                  )}
                  {item.status === 'active' && (
                    <span style={{ display: 'inline-block', padding: '2px 8px', background: '#fffbeb', color: '#92400e', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>
                      ⏳ En cours
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span style={{ display: 'inline-block', padding: '2px 8px', background: '#f3f4f6', color: '#6b7280', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>
                      ❌ À venir
                    </span>
                  )}
                  {item.tx && (
                    <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9ca3af', marginTop: '6px' }}>Tx: {item.tx}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Zone Stats */}
        {activeTab === 'zone' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <span style={{ fontSize: '24px' }}>📍</span>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Anomalies signalées dans votre zone</h3>
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Yaoundé - Mvog-Mbi</div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {zoneStats.map((stat, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '12px' }}>
                  <span style={{ fontWeight: '500' }}>{stat.label}</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blockchain Footer */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: 'linear-gradient(135deg, #16a34420 0%, #2563eb20 100%)',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#4b5563'
        }}>
          🔗 Données enregistrées sur blockchain Polygon — Publiquement vérifiables
        </div>
      </div>
    </div>
  );
};

export default Suivi;