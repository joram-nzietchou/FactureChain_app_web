# 🖥️ LUMINA Backend — API REST

API REST sécurisée pour l'application LUMINA. Gère l'authentification, les relevés de compteur, les réclamations et l'interaction avec la blockchain Polygon.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Structure](#-structure)
- [Endpoints API](#-endpoints-api)
- [Modèles de données](#-modèles-de-données)
- [Sécurité](#-sécurité)
- [Tests](#-tests)

---

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** sécurisée
- 👤 **Gestion des utilisateurs** (inscription, profil, mot de passe)
- 📊 **Relevés de compteur** avec calcul automatique
- 📝 **Réclamations** avec preuve blockchain
- 🔗 **Intégration blockchain** via Ethers.js
- 📈 **Statistiques** utilisateur et par zone
- 🛡️ **Validation** des données entrantes
- 🚨 **Gestion des erreurs** centralisée

---

## 🛠️ Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 22.x | Runtime JavaScript |
| Express | 4.18.2 | Framework web |
| MongoDB | 6.x | Base de données NoSQL |
| Mongoose | 8.0.0 | ODM MongoDB |
| JWT | 9.0.2 | Authentification |
| bcryptjs | 2.4.3 | Hachage de mots de passe |
| Ethers.js | 6.13.0 | Interaction blockchain |
| express-validator | 7.0.1 | Validation |
| Helmet | 7.1.0 | Sécurité HTTP |
| CORS | 2.8.5 | Gestion CORS |
| dotenv | 16.3.1 | Variables d'environnement |

---

## 🚀 Installation

### Prérequis

- Node.js v18+
- MongoDB (local ou Atlas)
- npm ou yarn

### Étapes

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

▶️ Démarrage
bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start

Résultat attendu :
text
✅ MongoDB connecté: localhost
✅ Blockchain initialisée - Contrat: 0x5FbDB...
🚀 Serveur démarré sur http://localhost:3001
📁 Structure
text
backend/
├── src/
│   ├── abis/                   # ABIs des smart contracts
│   │   └── ReclamationSystem.json
│   ├── config/
│   │   ├── database.js         # Connexion MongoDB
│   │   └── blockchain.js       # Configuration blockchain
│   ├── models/
│   │   ├── User.js             # Modèle utilisateur
│   │   ├── Claim.js            # Modèle réclamation
│   │   └── MeterReading.js     # Modèle relevé
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── claimController.js
│   │   ├── meterController.js
│   │   ├── profileController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── claimRoutes.js
│   │   ├── meterRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── blockchainRoutes.js
│   ├── services/
│   │   ├── blockchainService.js
│   │   ├── billingService.js
│   │   └── emailService.js
│   ├── middleware/
│   │   ├── auth.js             # Vérification JWT
│   │   ├── validation.js       # Validation des entrées
│   │   └── errorHandler.js     # Gestion erreurs
│   └── app.js
├── scripts/
│   └── seed.js                 # Données de test
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
📡 Endpoints API
🔐 Authentification
Méthode	Endpoint	Description	Auth
POST	/api/auth/register	Inscription	❌
POST	/api/auth/login	Connexion	❌
GET	/api/auth/profile	Récupérer profil	✅
PUT	/api/auth/profile	Modifier profil	✅
POST	/api/auth/forgot-password	Mot de passe oublié	❌
POST	/api/auth/reset-password/:token	Réinitialiser	❌
POST	/api/auth/logout	Déconnexion	✅
📊 Dashboard
Méthode	Endpoint	Description	Auth
GET	/api/dashboard	Données dashboard	✅
GET	/api/dashboard/history	Historique conso	✅
GET	/api/dashboard/bills	Historique factures	✅
GET	/api/dashboard/bills/stats	Stats factures	✅
POST	/api/dashboard/verify-bill	Vérifier une facture	✅
📈 Relevés de compteur
Méthode	Endpoint	Description	Auth
POST	/api/meter/store	Enregistrer relevé	✅
GET	/api/meter/history	Historique relevés	✅
GET	/api/meter/last-index	Dernier index	✅
📝 Réclamations
Méthode	Endpoint	Description	Auth
POST	/api/claims	Créer réclamation	✅
GET	/api/claims	Liste réclamations	✅
GET	/api/claims/:id	Détail réclamation	✅
GET	/api/claims/stats	Statistiques	✅
PUT	/api/claims/:id/status	MàJ statut (admin)	✅
🔗 Blockchain
Méthode	Endpoint	Description	Auth
GET	/api/blockchain/prochain-id	Prochain ID	❌
GET	/api/blockchain/history	Historique blockchain	✅
GET	/api/blockchain/reading/:id	Relevé blockchain	✅
👤 Profil
Méthode	Endpoint	Description	Auth
GET	/api/profile	Récupérer profil	✅
PUT	/api/profile	Modifier profil	✅
POST	/api/profile/change-password	Changer MDP	✅
GET	/api/profile/stats	Statistiques	✅
🗄️ Modèles de données
User
javascript
{
  subscriberNumber: String,    // ENEO123456789 (unique)
  fullName: String,
  email: String,               // unique
  phone: String,
  password: String,            // hashé avec bcrypt
  role: String,                // subscriber | admin | support
  city: String,
  district: String,
  isVerified: Boolean,
  createdAt: Date,
  lastLogin: Date
}
Claim
javascript
{
  claimNumber: String,         // RC-2025-0001
  subscriberNumber: String,
  month: String,
  year: Number,
  blockchainConsumption: Number,
  eneoAmount: Number,
  difference: Number,
  anomalyPercentage: Number,
  description: String,
  blockchainHash: String,
  status: String,              // submitted | transmitted | resolved | rejected
  timeline: Array,
  createdAt: Date
}
MeterReading
javascript
{
  subscriberNumber: String,
  month: String,
  year: Number,
  previousIndex: Number,
  currentIndex: Number,
  consumption: Number,
  calculatedAmount: Number,
  blockchainHash: String,
  createdAt: Date
}
🔒 Sécurité
🔑 JWT pour l'authentification (expiration 7 jours)

🔐 bcrypt pour le hachage des mots de passe (10 rounds)

🛡️ Helmet pour les headers HTTP sécurisés

🚦 Rate limiting (100 requêtes / 15 minutes)

✅ Validation systématique des entrées

🌐 CORS configuré pour le frontend uniquement

🔒 Variables sensibles dans .env (jamais committées)

🧪 Tests
bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage
📦 Scripts npm
Script	Description
npm start	Démarrage en production
npm run dev	Démarrage avec nodemon
npm test	Tests unitaires
npm run seed	Insérer données de test
📞 Support
Email : support@lumina.cm
GitHub : @joram-nzietchou

<p align="center"> <b>LUMINA Backend — API REST sécurisée</b> 🚀 </p> ```