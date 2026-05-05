import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const storedUser = localStorage.getItem('facturechain_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Pour la démo, accepter n'importe quel email/mot de passe
    if (email && password) {
      const userData = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        subscriberNumber: 'CM-YDE-004821',
        role: 'subscriber',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('facturechain_user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      return true;
    } else {
      setError('Email ou mot de passe incorrect');
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: 'user_' + Date.now(),
      email: userData.email,
      name: userData.fullName,
      phone: userData.phone,
      subscriberNumber: userData.eneoNumber,
      role: 'subscriber',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('facturechain_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('facturechain_user');
    setUser(null);
  };

  const resetPassword = async (email) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    return true;
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('facturechain_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setLoading(false);
    return true;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};