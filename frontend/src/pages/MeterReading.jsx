import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MeterReading = ({ onNavigate }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    previousIndex: '',
    currentIndex: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await api.post('/meter/store', {
        subscriberNumber: user?.subscriberNumber,
        previousIndex: parseFloat(formData.previousIndex),
        currentIndex: parseFloat(formData.currentIndex)
      });
      
      if (response.success) {
        setResult(response.data);
      } else {
        alert('Erreur: ' + (response.error || 'Erreur lors de l\'enregistrement'));
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ color: '#16a344' }}>Relevé enregistré !</h1>
        <p>Votre index a été enregistré sur la blockchain Polygon.</p>
        
        <div style={{ background: '#e8f7ee', borderRadius: '12px', padding: '16px', margin: '20px 0', textAlign: 'left' }}>
          <p><strong>Hash :</strong> <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>{result.blockchain.transactionHash}</code></p>
          <p><strong>ID :</strong> {result.blockchain.readingId}</p>
          <p><strong>Bloc :</strong> {result.blockchain.blockNumber}</p>
        </div>

        <button onClick={() => onNavigate('dashboard')} style={{ padding: '12px 24px', background: '#16a344', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Retour au Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: '#16a344', marginBottom: '20px', cursor: 'pointer' }}>
        ← Retour
      </button>

      <h1>📝 Relevé de compteur</h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>Enregistrez votre index sur la blockchain</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Index précédent</label>
          <input
            type="number"
            name="previousIndex"
            value={formData.previousIndex}
            onChange={handleChange}
            placeholder="0"
            style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Index actuel</label>
          <input
            type="number"
            name="currentIndex"
            value={formData.currentIndex}
            onChange={handleChange}
            placeholder="Entrez l'index"
            style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          style={{ width: '100%', padding: '14px', background: '#16a344', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          {submitting ? 'Enregistrement...' : 'Enregistrer sur la blockchain'}
        </button>
      </form>
    </div>
  );
};

export default MeterReading;