# 🖥️ LUMINA Backend

API REST sécurisée de LUMINA. Elle gère l'authentification, les relevés de compteur, les réclamations et l'interaction avec la blockchain Polygon.

[← Retour au README principal](../README.md)

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure](#structure)
- [Endpoints API](#endpoints-api)
- [Modèles de données](#modèles-de-données)
- [Sécurité](#sécurité)
- [Tests](#tests)
- [Scripts](#scripts)
- [Support](#support)

---

## Fonctionnalités

- 🔐 Authentification JWT
- 👤 Gestion des utilisateurs (inscription, profil, mot de passe)
- 📊 Relevés de compteur avec calcul automatique de la facture
- 📝 Réclamations avec preuve blockchain
- 🔗 Intégration blockchain via Ethers.js
- 📈 Statistiques par utilisateur et par zone
- 🛡️ Validation des données entrantes
- 🚨 Gestion centralisée des erreurs

---

## Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 22.x | Runtime |
| Express | 4.18.2 | Framework web |
| MongoDB | 6.x | Base de données |
| Mongoose | 8.0.0 | ODM MongoDB |
| jsonwebtoken | 9.0.2 | Authentification |
| bcryptjs | 2.4.3 | Hachage des mots de passe |
| Ethers.js | 6.13.0 | Interaction blockchain |
| express-validator | 7.0.1 | Validation |
| Helmet | 7.1.0 | En-têtes HTTP sécurisés |
| cors | 2.8.5 | Gestion CORS |
| dotenv | 16.3.1 | Variables d'environnement |

---

## Installation

**Prérequis :** Node.js v18+, MongoDB (local ou Atlas), npm ou yarn.

```bash
cd backend
npm install
cp .env.example .env
```

---

## Configuration

Renseignez le fichier `.env` (ne le committez jamais).

| Variable | Description |
|----------|-------------|
| `PORT` | Port du serveur (3001 par défaut) |
| `MONGODB_URI` | Chaîne de connexion MongoDB |
| `JWT_SECRET` | Secret de signature des tokens JWT |
| `RPC_URL` | Endpoint du nœud blockchain (Hardhat local ou Polygon Amoy) |
| `CONTRACT_ADDRESS` | Adresse du smart contract déployé |
| `PRIVATE_KEY` | Clé privée du compte signataire des transactions |

> Les noms exacts des variables sont définis dans `.env.example` : alignez ce tableau dessus.

---

## Démarrage

```bash
# Développement (rechargement automatique)
npm run dev

# Production
npm start
```

Sortie attendue :

```text
✅ MongoDB connecté: localhost
✅ Blockchain initialisée - Contrat: 0x5FbDB...
🚀 Serveur démarré sur http://localhost:3001
```

---

## Structure

```text
backend/
├── src/
│   ├── abis/                  # ABI des smart contracts
│   │   └── ReclamationSystem.json
│   ├── config/
│   │   ├── database.js        # Connexion MongoDB
│   │   └── blockchain.js      # Configuration blockchain
│   ├── models/
│   │   ├── User.js
│   │   ├── Claim.js
│   │   └── MeterReading.js
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
│   │   ├── auth.js            # Vérification JWT
│   │   ├── validation.js      # Validation des entrées
│   │   └── errorHandler.js    # Gestion des erreurs
│   └── app.js
├── scripts/
│   └── seed.js                # Données de test
├── .env.example
├── package.json
└── server.js
```

---

## Endpoints API

Les routes marquées 🔒 nécessitent un token JWT : `Authorization: Bearer <token>`.

### Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|:----:|
| POST | `/api/auth/register` | Inscription | – |
| POST | `/api/auth/login` | Connexion | – |
| GET | `/api/auth/profile` | Récupérer le profil | 🔒 |
| PUT | `/api/auth/profile` | Modifier le profil | 🔒 |
| POST | `/api/auth/forgot-password` | Mot de passe oublié | – |
| POST | `/api/auth/reset-password/:token` | Réinitialiser le mot de passe | – |
| POST | `/api/auth/logout` | Déconnexion | 🔒 |

### Tableau de bord

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|:----:|
| GET | `/api/dashboard` | Données du tableau de bord | 🔒 |
| GET | `/api/dashboard/history` | Historique de consommation | 🔒 |
| GET | `/api/dashboard/bills` | Historique des factures | 🔒 |
| GET | `/api/dashboard/bills/stats` | Statistiques des factures | 🔒 |
| POST | `/api/dashboard/verify-bill` | Vérifier une facture | 🔒 |

### Relevés de compteur

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|:----:|
| POST | `/api/meter/store` | Enregistrer un relevé | 🔒 |
| GET | `/api/meter/history` | Historique des relevés | 🔒 |
| GET | `/api/meter/last-index` | Dernier index | 🔒 |

### Réclamations

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|:----:|
| POST | `/api/claims` | Créer une réclamation | 🔒 |
| GET | `/api/claims` | Lister les réclamations | 🔒 |
| GET | `/api/claims/stats` | Statistiques | 🔒 |
| GET | `/api/claims/:id` | Détail d'une réclamation | 🔒 |
| PUT | `/api/claims/:id/status` | Mettre à jour le statut (admin) | 🔒 |

### Blockchain

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|:----:|
| GET | `/api/blockchain/prochain-id` | Prochain identifiant | – |
| GET | `/api/blockchain/history` | Historique blockchain | 🔒 |
| GET | `/api/blockchain/reading/:id` | Relevé enregistré on-chain | 🔒 |

### Profil

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|:----:|
| GET | `/api/profile` | Récupérer le profil | 🔒 |
| PUT | `/api/profile` | Modifier le profil | 🔒 |
| POST | `/api/profile/change-password` | Changer le mot de passe | 🔒 |
| GET | `/api/profile/stats` | Statistiques | 🔒 |

---

## Modèles de données

### User

```javascript
{
  subscriberNumber: String,   // ex. ENEO123456789 (unique)
  fullName: String,
  email: String,              // unique
  phone: String,
  password: String,           // haché (bcrypt)
  role: String,               // subscriber | admin | support
  city: String,
  district: String,
  isVerified: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Claim

```javascript
{
  claimNumber: String,        // ex. RC-2025-0001
  subscriberNumber: String,
  month: String,
  year: Number,
  blockchainConsumption: Number,
  eneoAmount: Number,
  difference: Number,
  anomalyPercentage: Number,
  description: String,
  blockchainHash: String,
  status: String,             // submitted | transmitted | resolved | rejected
  timeline: Array,
  createdAt: Date
}
```

### MeterReading

```javascript
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
```

---

## Sécurité

- 🔑 **JWT** pour l'authentification (expiration : 7 jours)
- 🔐 **bcrypt** pour le hachage des mots de passe (10 rounds)
- 🛡️ **Helmet** pour les en-têtes HTTP
- 🚦 **Rate limiting** : 100 requêtes / 15 minutes
- ✅ **Validation** systématique des entrées
- 🌐 **CORS** restreint au frontend
- 🔒 Secrets stockés dans `.env`, jamais committés

---

## Tests

```bash
npm test                  # Tests unitaires
npm run test:coverage     # Avec couverture
```

---

## Scripts

| Commande | Description |
|----------|-------------|
| `npm start` | Démarrage en production |
| `npm run dev` | Démarrage avec nodemon |
| `npm test` | Tests unitaires |
| `npm run seed` | Insertion de données de test |

---

## Support

- Email : [joramnzietchou@gmail.com]
- GitHub : [@joram-nzietchou](https://github.com/joram-nzietchou)