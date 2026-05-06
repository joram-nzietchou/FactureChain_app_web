// Service API centralisé
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error(`API Error ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ========== NOUVELLES ROUTES BLOCKCHAIN ==========
  
  // Vérifier une transaction blockchain
  async verifyBlockchainTransaction(txHash) {
    return this.get(`/blockchain/verify/${txHash}`);
  }

  // Récupérer une réclamation depuis la blockchain
  async getBlockchainClaim(claimId) {
    return this.get(`/blockchain/reclamation/${claimId}`);
  }

  // Récupérer le prochain ID
  async getNextBlockchainId() {
    return this.get('/blockchain/prochain-id');
  }
  // Ajouter dans src/services/api.js

// Récupérer l'historique blockchain
async getBlockchainHistory() {
  return this.get('/blockchain/history');
}

// Récupérer un relevé blockchain par ID
async getBlockchainReading(id) {
  return this.get(`/blockchain/reading/${id}`);
}

// Récupérer le dernier relevé blockchain
async getLastBlockchainReading() {
  return this.get('/blockchain/last-reading');
}
}

export default new ApiService();