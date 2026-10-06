import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

// Icônes SVG
const Icons = {
  eye: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  blockchain: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  file: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  bolt: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  chart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  arrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  wallet: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 10h-4a2 2 0 0 0-2 2 2 2 0 0 0 2 2h4" />
      <circle cx="18" cy="12" r="1" />
    </svg>
  ),
  life: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  monitoring: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  fraudDetection: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  claim: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  twitter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  linkedin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  ),
  phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
};

const Home = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar onNavigate={onNavigate} currentPage="home" />
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                Surveillance électrique intelligente
              </div>
              <h1 className="hero-title">
                Maîtrisez votre <span className="gradient-text">consommation</span><br />
                et protégez-vous contre la <span className="gradient-text">fraude</span>
              </h1>
              <p className="hero-subtitle">
                LUMINA vous permet de suivre votre consommation électrique en temps réel,
                de détecter les anomalies et de constituer des preuves infalsifiables sur blockchain.
              </p>
              <div className="hero-buttons">
                {!isAuthenticated ? (
                  <>
                    <button className="btn-primary" onClick={() => onNavigate('login')}>
                      Commencer maintenant
                      <Icons.arrowRight />
                    </button>
                    <button className="btn-secondary" onClick={() => onNavigate('register')}>
                      Créer un compte
                    </button>
                  </>
                ) : (
                  <button className="btn-primary" onClick={() => onNavigate('dashboard')}>
                    Accéder au tableau de bord
                    <Icons.arrowRight />
                  </button>
                )}
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <Icons.users />
                  <div>
                    <span className="stat-number">3M+</span>
                    <span className="stat-label">Abonnés protégés</span>
                  </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <Icons.wallet />
                  <div>
                    <span className="stat-number">60Md</span>
                    <span className="stat-label">FCFA de pertes évitées</span>
                  </div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <Icons.check />
                  <div>
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Preuves infalsifiables</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-illustration">
                <div className="illustration-glow"></div>
                <div className="illustration-content">
                  <img src="/logo2.png" alt="LUMINA" className="illustration-logo" />
                  <div className="illustration-badge">
                    <Icons.blockchain />
                    <span>Blockchain active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Fonctionnalités</span>
              <h2 className="section-title">Une solution complète pour votre <span className="gradient-text">énergie</span></h2>
              <p className="section-subtitle">Découvrez comment LUMINA transforme votre relation avec l'électricité</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><Icons.monitoring /></div>
                <h3>Surveillance en temps réel</h3>
                <p>Suivez votre consommation électrique instantanément et détectez les anomalies dès qu'elles apparaissent.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Icons.blockchain /></div>
                <h3>Preuve blockchain</h3>
                <p>Chaque relevé est enregistré sur la blockchain Polygon, garantissant une preuve infalsifiable.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Icons.fraudDetection /></div>
                <h3>Détection de fraude</h3>
                <p>Identifiez les branchements illicites et protégez-vous contre le vol d'électricité.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Icons.claim /></div>
                <h3>Réclamation simplifiée</h3>
                <p>Déposez une réclamation en quelques clics avec une preuve déjà constituée.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Comment ça marche</span>
              <h2 className="section-title">Simple, rapide et <span className="gradient-text">efficace</span></h2>
              <p className="section-subtitle">Trois étapes pour reprendre le contrôle de votre consommation</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">01</div>
                <div className="step-icon"><Icons.chart /></div>
                <h3>Enregistrez votre relevé</h3>
                <p>Saisissez l'index de votre compteur ou laissez les capteurs faire le travail automatiquement.</p>
              </div>
              <div className="step-card">
                <div className="step-number">02</div>
                <div className="step-icon"><Icons.eye /></div>
                <h3>Analyse automatique</h3>
                <p>LUMINA compare votre consommation avec les tarifs officiels et détecte les anomalies.</p>
              </div>
              <div className="step-card">
                <div className="step-number">03</div>
                <div className="step-icon"><Icons.shield /></div>
                <h3>Preuve blockchain</h3>
                <p>En cas de litige, votre réclamation est enregistrée de manière infalsifiable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card-large"><Icons.chart /><div className="stat-value">800k</div><div className="stat-label">Compteurs défaillants identifiés</div></div>
              <div className="stat-card-large"><Icons.file /><div className="stat-value">40%</div><div className="stat-label">De contestations de factures</div></div>
              <div className="stat-card-large"><Icons.wallet /><div className="stat-value">60Md</div><div className="stat-label">FCFA de pertes annuelles</div></div>
              <div className="stat-card-large"><Icons.life /><div className="stat-value">32</div><div className="stat-label">Décès liés à des branchements illégaux (2024)</div></div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Prêt à reprendre le contrôle de votre électricité ?</h2>
              <p>Rejoignez des milliers d'abonnés qui font confiance à LUMINA</p>
              {!isAuthenticated ? (
                <button className="btn-cta" onClick={() => onNavigate('register')}>Créer un compte gratuitement <Icons.arrowRight /></button>
              ) : (
                <button className="btn-cta" onClick={() => onNavigate('dashboard')}>Accéder à mon tableau de bord <Icons.arrowRight /></button>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-section">
                <div className="footer-logo">
                  <img src="/logo2.png" alt="LUMINA" className="footer-logo-img" />
                  {/* <span className="footer-logo-text">LUMINA</span> */}
                </div>
                <p className="footer-description">
                  Surveillance électrique intelligente et transparence énergétique grâce à la blockchain.
                </p>
                <div className="footer-social">
                  <a href="#" className="social-link"><Icons.facebook /></a>
                  <a href="#" className="social-link"><Icons.twitter /></a>
                  <a href="#" className="social-link"><Icons.linkedin /></a>
                </div>
              </div>
              
              <div className="footer-section">
                <h4>Liens rapides</h4>
                <ul>
                  <li><button onClick={() => onNavigate('home')}>Accueil</button></li>
                  <li><button onClick={() => onNavigate('features')}>Fonctionnalités</button></li>
                  <li><button onClick={() => onNavigate('dashboard')}>Tableau de bord</button></li>
                  <li><button onClick={() => onNavigate('blockchain-history')}>Historique blockchain</button></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Support</h4>
                <ul>
                  <li><button onClick={() => onNavigate('faq')}>FAQ</button></li>
                  <li><button onClick={() => onNavigate('contact')}>Contact</button></li>
                  <li><button onClick={() => onNavigate('privacy')}>Confidentialité</button></li>
                  <li><button onClick={() => onNavigate('terms')}>Conditions d'utilisation</button></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Contact</h4>
                <ul className="contact-list">
                  <li>
                    <Icons.mail />
                    <span>support@lumina.cm</span>
                  </li>
                  <li>
                    <Icons.phone />
                    <span>+237 690 000 000</span>
                  </li>
                  <li>
                    <Icons.mapPin />
                    <span>Yaoundé, Cameroun</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2025 LUMINA. Tous droits réservés.</p>
              <p>Surveillance électrique & transparence énergétique</p>
            </div>
          </div>
        </footer>

        <style>{`
          /* Reset & Base */
          .home-page {
            min-height: 100vh;
            background: #ffffff;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Hero Section */
          .hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            padding: 80px 0;
            position: relative;
            overflow: hidden;
          }

          .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
          }

          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.1);
            padding: 6px 14px;
            border-radius: 30px;
            color: #f59e0b;
            font-size: 13px;
            margin-bottom: 24px;
          }

          .badge-dot {
            width: 8px;
            height: 8px;
            background: #f59e0b;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          .hero-title {
            font-size: 48px;
            font-weight: 800;
            color: white;
            line-height: 1.2;
            margin-bottom: 24px;
          }

          .gradient-text {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .hero-subtitle {
            font-size: 16px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 32px;
          }

          .hero-buttons {
            display: flex;
            gap: 16px;
            margin-bottom: 48px;
          }

          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 14px 28px;
            border-radius: 40px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(245,158,11,0.3);
          }

          .btn-secondary {
            background: transparent;
            border: 1.5px solid rgba(255,255,255,0.3);
            color: white;
            padding: 14px 28px;
            border-radius: 40px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }

          .btn-secondary:hover {
            border-color: #f59e0b;
            background: rgba(245,158,11,0.1);
          }

          .hero-stats {
            display: flex;
            gap: 24px;
            align-items: center;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .stat-item svg {
            stroke: #f59e0b;
          }

          .stat-item div {
            display: flex;
            flex-direction: column;
          }

          .stat-number {
            font-size: 20px;
            font-weight: 800;
            color: white;
          }

          .stat-label {
            font-size: 12px;
            color: #94a3b8;
          }

          .stat-divider {
            width: 1px;
            height: 40px;
            background: rgba(255,255,255,0.1);
          }

          /* Hero Illustration */
          .hero-right { display: flex; justify-content: center; }
          .hero-illustration { position: relative; }
          .illustration-glow { position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
          .illustration-content { position: relative; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 32px; padding: 40px; border: 1px solid rgba(255,255,255,0.1); }
          .illustration-logo { width: 120px; height: 120px; object-fit: contain; }
          .illustration-badge { display: flex; align-items: center; gap: 8px; margin-top: 24px; padding: 8px 16px; background: rgba(0,0,0,0.5); border-radius: 40px; color: #f59e0b; font-size: 13px; }
          .illustration-badge svg { width: 16px; height: 16px; }

          /* Features Section */
          .features { padding: 80px 0; background: #f8fafc; }
          .section-header { text-align: center; margin-bottom: 60px; }
          .section-badge { display: inline-block; background: #fef3c7; color: #f59e0b; padding: 6px 14px; border-radius: 30px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
          .section-title { font-size: 36px; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
          .section-subtitle { font-size: 16px; color: #64748b; }
          .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
          .feature-card { background: white; padding: 32px; border-radius: 24px; text-align: center; transition: all 0.3s; border: 1px solid #e2e8f0; }
          .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1); border-color: #f59e0b; }
          .feature-icon { width: 64px; height: 64px; background: #fef3c7; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
          .feature-icon svg { stroke: #f59e0b; }
          .feature-card h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
          .feature-card p { font-size: 14px; color: #64748b; line-height: 1.5; }

          /* How It Works */
          .how-it-works { padding: 80px 0; background: white; }
          .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
          .step-card { text-align: center; }
          .step-number { width: 40px; height: 40px; background: #fef3c7; color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; margin: 0 auto 20px; }
          .step-icon { width: 80px; height: 80px; background: #f8fafc; border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
          .step-icon svg { stroke: #f59e0b; }
          .step-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
          .step-card p { color: #64748b; line-height: 1.5; }

          /* Stats Section */
          .stats-section { background: #0f172a; padding: 60px 0; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
          .stat-card-large { text-align: center; padding: 24px; }
          .stat-card-large svg { stroke: #f59e0b; margin-bottom: 16px; }
          .stat-card-large .stat-value { font-size: 36px; font-weight: 800; color: white; margin-bottom: 8px; }
          .stat-card-large .stat-label { font-size: 14px; color: #94a3b8; }

          /* CTA Section */
          .cta-section { padding: 80px 0; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); }
          .cta-content { text-align: center; color: white; }
          .cta-content h2 { font-size: 32px; font-weight: 800; margin-bottom: 16px; }
          .cta-content p { font-size: 16px; margin-bottom: 32px; opacity: 0.9; }
          .btn-cta { display: inline-flex; align-items: center; gap: 8px; background: white; color: #f59e0b; padding: 14px 32px; border-radius: 40px; font-weight: 700; border: none; cursor: pointer; transition: all 0.3s; }
          .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

          /* Footer */
          .footer {
            background: #0f172a;
            color: #94a3b8;
            padding: 60px 0 30px;
          }

          .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          .footer-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
            margin-bottom: 40px;
          }

          .footer-section h4 {
            color: white;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .footer-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
          }

          .footer-logo-img {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }

          .footer-logo-text {
            font-size: 20px;
            font-weight: 800;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .footer-description {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
          }

          .footer-social {
            display: flex;
            gap: 16px;
          }

          .social-link svg {
            stroke: #94a3b8;
            transition: all 0.3s;
          }

          .social-link:hover svg {
            stroke: #f59e0b;
          }

          .footer-section ul {
            list-style: none;
            padding: 0;
          }

          .footer-section li {
            margin-bottom: 12px;
          }

          .footer-section button {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            transition: color 0.2s;
            font-size: 14px;
          }

          .footer-section button:hover {
            color: #f59e0b;
          }

          .contact-list li {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .contact-list svg {
            stroke: #f59e0b;
            flex-shrink: 0;
          }

          .footer-bottom {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #1e293b;
            font-size: 12px;
          }

          .footer-bottom p:first-child {
            margin-bottom: 8px;
          }

          /* Animations */
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .hero-content { grid-template-columns: 1fr; text-align: center; }
            .hero-buttons { justify-content: center; }
            .hero-stats { justify-content: center; }
            .features-grid { grid-template-columns: repeat(2, 1fr); }
            .steps-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .footer-grid { grid-template-columns: repeat(2, 1fr); }
          }

          @media (max-width: 640px) {
            .hero-title { font-size: 32px; }
            .features-grid { grid-template-columns: 1fr; }
            .stats-grid { grid-template-columns: 1fr; }
            .hero-stats { flex-direction: column; }
            .stat-divider { display: none; }
            .footer-grid { grid-template-columns: 1fr; text-align: center; }
            .footer-logo { justify-content: center; }
            .footer-social { justify-content: center; }
            .contact-list li { justify-content: center; }
          }
        `}</style>
      </div>
    </>
  );
};

export default Home;