import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onNavigate, currentPage }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    onNavigate('login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => onNavigate('home')}>
          <img src="/logo2.png" alt="LUMINA" className="logo-img" />
          {/* <span className="logo-text">LUMINA</span> */}
        </div>
        
        <div className="navbar-links">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
            onClick={() => onNavigate('home')}
          >
            Accueil
          </button>
          <button 
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} 
            onClick={() => onNavigate('dashboard')}
          >
            Tableau de bord
          </button>
          <button 
            className={`nav-link ${currentPage === 'meter-reading' ? 'active' : ''}`} 
            onClick={() => onNavigate('meter-reading')}
          >
            Relevé
          </button>
          <button 
            className={`nav-link ${currentPage === 'blockchain-history' ? 'active' : ''}`} 
            onClick={() => onNavigate('blockchain-history')}
          >
            Blockchain
          </button>
          
          <div className="user-menu">
            <button className="user-avatar" onClick={() => setShowMenu(!showMenu)}>
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </button>
            {showMenu && (
              <div className="user-dropdown">
                <button onClick={() => { onNavigate('profile'); setShowMenu(false); }}>👤 Mon profil</button>
                <button onClick={handleLogout}>🚪 Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 32px;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .logo-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          padding: 8px 16px;
          border-radius: 8px;
        }
        .nav-link:hover {
          color: #f59e0b;
          background: #fef3c7;
        }
        .nav-link.active {
          color: #f59e0b;
          background: #fef3c7;
          position: relative;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 16px;
          right: 16px;
          height: 2px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          border-radius: 2px;
        }
        .user-menu {
          position: relative;
          margin-left: 16px;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          border: none;
          transition: transform 0.2s;
        }
        .user-avatar:hover {
          transform: scale(1.05);
        }
        .user-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          width: 180px;
          overflow: hidden;
          z-index: 100;
        }
        .user-dropdown button {
          width: 100%;
          padding: 12px 16px;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-dropdown button:hover {
          background: #f1f5f9;
        }
        @media (max-width: 768px) {
          .navbar { padding: 0 16px; }
          .navbar-links { gap: 4px; }
          .logo-text { display: none; }
          .nav-link { padding: 6px 12px; font-size: 12px; }
          .nav-link.active::after { left: 12px; right: 12px; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;