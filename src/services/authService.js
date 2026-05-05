// Service d'authentification avec API réelle (à adapter)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const authService = {
  async login(email, password) {
    // Simulation API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '1',
            email,
            name: 'Jean-Baptiste Kamga',
            subscriberNumber: 'CM-YDE-004821',
            token: 'fake-jwt-token'
          }
        });
      }, 1000);
    });
  },

  async register(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '1',
            ...userData,
            token: 'fake-jwt-token'
          }
        });
      }, 1000);
    });
  },

  async verifyEneoNumber(eneoNumber) {
    // Vérification du numéro abonné ENEO
    const validNumbers = ['ENEO123456789', 'CM-YDE-004821'];
    return validNumbers.includes(eneoNumber);
  },

  async resetPassword(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};