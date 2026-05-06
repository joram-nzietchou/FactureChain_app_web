import api from './api';

class AuthService {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.data.token) {
      api.setToken(response.data.token);
    }
    return response;
  }

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      api.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    api.setToken(null);
  }

  async getProfile() {
    return api.get('/auth/profile');
  }

  async updateProfile(userData) {
    return api.put('/auth/profile', userData);
  }

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return api.post(`/auth/reset-password/${token}`, { password });
  }

  async verifyEmail(token) {
    return api.get(`/auth/verify/${token}`);
  }

  isAuthenticated() {
    return !!api.token;
  }

  getToken() {
    return api.token;
  }
}

export default new AuthService();