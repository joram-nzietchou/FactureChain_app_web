import api from './api';

class ClaimService {
  async createClaim(claimData) {
    return api.post('/claims', claimData);
  }

  async getUserClaims(page = 1, limit = 10, status = '') {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    return api.get(`/claims?${params.toString()}`);
  }

  async getClaimById(id) {
    return api.get(`/claims/${id}`);
  }

  async getClaimStats() {
    return api.get('/claims/stats');
  }
}

export default new ClaimService();