import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('juillet 2025');

  useEffect(() => {
    setAnimate(true);
  }, []);

  const historiqueData = [
    { date: '01/04/2026', kwh: 15000, eneo: 18000, statut: 'normal' },
    { date: '10/04/2026', kwh: 18700, eneo: 23400, statut: 'anomalie' },
    { date: '25/03/2026', kwh: 14500, eneo: 17400, statut: 'normal' },
    { date: '10/03/2026', kwh: 14200, eneo: 17000, statut: 'normal' }
  ];

  const zoneStats = [
    { label: 'Réclamations actives', value: 47, color: '#2563eb', icon: '📋' },
    { label: 'Surfacturations', value: 28, color: '#f59e0b', icon: '⚠️' },
    { label: 'Erreurs de relevé', value: 12, color: '#ef4444', icon: '🔴' },
    { label: 'Résolues', value: 35, color: '#16a344', icon: '✅' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f3f4f6',
      animation: animate ? 'fadeIn 0.5s ease-out' : 'none'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
        }
        .table-row {
          transition: background 0.2s ease;
        }
        .table-row:hover {
          background: #f9fafb;
        }
      `}</style>

      {/* Header */}
      <div style={{ 
        background: 'white', 
        padding: '20px 32px', 
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
              Dashboard Consommation
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
              Bienvenue, {user?.name || 'Utilisateur'} 👋
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white' }}
            >
              <option>juillet 2025</option>
              <option>juin 2025</option>
              <option>mai 2025</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        
        {/* Cartes KPI */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Carte Consommation Blockchain */}
          <div className="card-hover" style={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ opacity: 0.8, fontSize: '13px', marginBottom: '8px' }}>Consommation Blockchain</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>18 700 kWh</p>
                <p style={{ opacity: 0.7, fontSize: '11px', marginTop: '8px' }}>Dernier relevé: 10/04/2026</p>
              </div>
              <div style={{ fontSize: '32px' }}>⚡</div>
            </div>
            <div style={{ marginTop: '16px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
              <div style={{ width: '78%', height: '100%', background: 'white', borderRadius: '2px' }}></div>
            </div>
          </div>

          {/* Carte Montant ENEO */}
          <div className="card-hover" style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ opacity: 0.8, fontSize: '13px', marginBottom: '8px' }}>Montant Facturé ENEO</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>23 400 FCFA</p>
                <p style={{ opacity: 0.7, fontSize: '11px', marginTop: '8px' }}>Facture de {selectedMonth}</p>
              </div>
              <div style={{ fontSize: '32px' }}>📄</div>
            </div>
            <div style={{ marginTop: '16px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
              <div style={{ width: '100%', height: '100%', background: 'white', borderRadius: '2px' }}></div>
            </div>
          </div>

          {/* Carte Surfacturation */}
          <div className="card-hover" style={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ opacity: 0.8, fontSize: '13px', marginBottom: '8px' }}>Surfacturation détectée</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>+25%</p>
                <p style={{ opacity: 0.7, fontSize: '11px', marginTop: '8px' }}>Soit 4 700 FCFA de trop</p>
              </div>
              <div style={{ fontSize: '32px' }}>⚠️</div>
            </div>
            <div style={{ marginTop: '16px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
              <div style={{ width: '25%', height: '100%', background: 'white', borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>

        {/* Section Historique */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Historique des consommations</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Date</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Consommation (kWh)</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Montant ENEO (FCFA)</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Statut</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {historiqueData.map((row, i) => (
                  <tr key={i} className="table-row" style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500' }}>{row.date}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>{row.kwh.toLocaleString('fr-FR')}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>{row.eneo.toLocaleString('fr-FR')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: row.statut === 'normal' ? '#e8f7ee' : '#fef2f2',
                        color: row.statut === 'normal' ? '#0e7a31' : '#ef4444'
                      }}>
                        {row.statut === 'normal' ? '✓ Normal' : '⚠ Anomalie'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => row.statut === 'anomalie' && onNavigate('reclamation')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: row.statut === 'anomalie' ? '#ef4444' : '#16a344',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: row.statut === 'anomalie' ? 'pointer' : 'default'
                        }}
                      >
                        {row.statut === 'anomalie' ? 'Contester →' : 'Voir détails'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zone Stats */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📍</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Anomalies dans votre zone</h2>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6b7280' }}>Yaoundé - Mvog-Mbi</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: '#e5e7eb' }}>
            {zoneStats.map((stat, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <button
            onClick={() => onNavigate('reclamation')}
            style={{
              background: '#16a344',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 6px -1px rgba(22,163,68,0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📝 Nouvelle réclamation
          </button>
          <button
            onClick={() => onNavigate('suivi')}
            style={{
              background: 'white',
              border: '2px solid #16a344',
              color: '#16a344',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e8f7ee'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            🔍 Suivre ma réclamation
          </button>
        </div>

        {/* Footer Blockchain */}
        <div style={{
          marginTop: '40px',
          padding: '16px',
          background: 'linear-gradient(135deg, #16a34420 0%, #2563eb20 100%)',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#4b5563'
        }}>
          🔗 Données enregistrées sur blockchain Polygon — Preuve légale infalsifiable
        </div>
      </div>
    </div>
  );
};

export default Dashboard;