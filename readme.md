Voici le code complet du `README.md` pour votre dépôt GitHub :

```markdown
# ⚡ FactureChain - Vérification des factures ENEO sur Blockchain

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-black)](https://soliditylang.org/)
[![Polygon](https://img.shields.io/badge/Polygon-AMOY-purple)](https://polygon.technology/)

## 📋 À propos

**FactureChain** est une application complète permettant aux abonnés ENEO du Cameroun de :

- 📊 **Enregistrer** leur index de compteur sur la blockchain Polygon
- 🔍 **Vérifier** leurs factures et détecter automatiquement les anomalies
- 📝 **Contester** les surfacturations avec une preuve infalsifiable
- 🔗 **Bénéficier** d'une preuve légale enregistrée sur blockchain
- 📈 **Suivre** l'évolution de leurs réclamations en temps réel

## 🎯 Problématique résolue

Au Cameroun, les abonnés ENEO subissent :
- ❌ Délestages fréquents (8-12h/jour en saison sèche)
- ❌ Factures contestées (40% des abonnés contestent au moins une facture par an)
- ❌ 800 000 compteurs défaillants
- ❌ Délais de résolution de 6 à 18 mois

**FactureChain** apporte une solution transparente et décentralisée grâce à la blockchain.

## 🏗️ Architecture du projet

```
FactureChain_app_web/
│
├── frontend/                    # Application React (Vite)
│   ├── src/
│   │   ├── pages/              # Pages de l'application
│   │   ├── services/           # Services API
│   │   ├── contexts/           # Contextes React
│   │   └── App.jsx
│   └── package.json
│
├── backend/                     # API Node.js/Express
│   ├── src/
│   │   ├── models/             # Modèles MongoDB
│   │   ├── controllers/        # Contrôleurs
│   │   ├── routes/             # Routes API
│   │   ├── services/           # Services (blockchain, email)
│   │   └── app.js
│   └── package.json
│
├── blockchain/                  # Smart contracts (Hardhat)
│   ├── contracts/
│   │   └── Reclamation.sol     # Contrat Solidity
│   ├── scripts/
│   │   └── deploy.js           # Script de déploiement
│   └── hardhat.config.cjs
│
├── .gitignore
└── README.md
```

## 🚀 Technologies utilisées

| Composant | Technologies |
|-----------|--------------|
| **Frontend** | React 18, Vite, CSS-in-JS, Axios |
| **Backend** | Node.js, Express, MongoDB, JWT, Nodemailer |
| **Blockchain** | Solidity, Hardhat, Ethers.js, Polygon (Amoy) |
| **Authentification** | JWT, Bcrypt |

## 📦 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)
- Git

### 1. Cloner le dépôt

```bash
git clone https://github.com/joram-nzietchou/FactureChain_app_web.git
cd FactureChain_app_web
```

### 2. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Blockchain
cd ../blockchain
npm install
```

### 3. Configuration des variables d'environnement

**Backend** - Créer `backend/.env` :

```env
# Serveur
PORT=3001
NODE_ENV=development

# Base de données
MONGODB_URI=mongodb://localhost:27017/facturechain

# JWT
JWT_SECRET=votre_secret_key_pour_jwt
JWT_EXPIRE=7d

# Blockchain (pour développement local)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
BLOCKCHAIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Frontend** - Créer `frontend/.env` :

```env
VITE_API_URL=http://localhost:3001/api
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## 🚀 Démarrage

### 1. Démarrer MongoDB

```bash
# Windows (si installé comme service)
net start MongoDB

# ou
mongod --dbpath C:\data\db
```

### 2. Démarrer la blockchain locale

```bash
cd blockchain
npx hardhat node
```

⚠️ **Ce terminal doit rester ouvert**

### 3. Déployer le smart contract

**Dans un nouveau terminal :**

```bash
cd blockchain
npx hardhat run scripts/deploy.cjs --network localhost
```

**Notez l'adresse du contrat déployé** (ex: `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

### 4. Démarrer le backend

```bash
cd backend
npm run dev
```

### 5. Démarrer le frontend

```bash
cd frontend
npm run dev
```

### 6. Accéder à l'application

- 🌐 **Frontend** : http://localhost:5173
- 🔗 **API Backend** : http://localhost:3001/api
- ⛓️ **Blockchain** : http://127.0.0.1:8545

## 📱 Fonctionnalités

### 👤 Authentification
- Inscription avec vérification du numéro ENEO
- Connexion sécurisée (JWT)
- Réinitialisation du mot de passe
- Mode démo (anonyme)

### 📊 Dashboard
- Vue d'ensemble de la consommation
- Cartes KPI (consommation blockchain, montant ENEO, surfacturation)
- Historique des consommations
- Statistiques par zone géographique

### 📝 Relevé de compteur
- Enregistrement de l'index du compteur
- Calcul automatique de la consommation
- Génération de la facture selon les tarifs ENEO
- Enregistrement sur la blockchain

### 🔍 Réclamations
- Formulaire en 4 étapes
- Détection automatique des anomalies
- Preuve blockchain infalsifiable
- Soumission traçable

### 📈 Suivi
- Timeline détaillée du traitement
- Statut en temps réel
- Hash blockchain vérifiable

### 👤 Profil utilisateur
- Gestion des informations personnelles
- Statistiques des réclamations
- Historique blockchain

## 🔗 Tarifs ENEO implémentés

| Tranche (kWh) | Prix (FCFA/kWh) |
|---------------|-----------------|
| 0 - 110 | 110 FCFA |
| 111 - 220 | 115 FCFA |
| 221 et plus | 120 FCFA |

*TVA : 19.25% appliquée*

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/profile` | Profil utilisateur |
| POST | `/api/claims` | Créer réclamation |
| GET | `/api/claims` | Liste réclamations |
| POST | `/api/meter/store` | Enregistrer relevé compteur |
| GET | `/api/blockchain/history` | Historique blockchain |

## 🧪 Tests

```bash
# Tests backend
cd backend
npm test

# Tests blockchain
cd blockchain
npx hardhat test
```

## 📦 Build de production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

## 👤 Auteur

**Joram Nzietchou**
- GitHub : [@joram-nzietchou](https://github.com/joram-nzietchou)
- Email : joram@facturechain.cm

## 🙏 Remerciements

- ENEO Cameroun pour les données de référence
- Polygon pour l'infrastructure blockchain
- La communauté Open Source

## 📞 Support

Pour toute question ou suggestion :
- 📧 Email : support@facturechain.cm
- 📱 WhatsApp : +237 690 000 000
- 🌐 Site web : https://facturechain.cm

---

<p align="center">
  <b>Développé avec ❤️ pour les abonnés ENEO du Cameroun</b>
</p>
```

## 🚀 **Comment ajouter ce README à votre dépôt**

```powershell
# 1. Créer ou modifier le fichier README.md
cd C:\Users\K TECH SOLUTION\Desktop\P\app_web

# 2. Copier le contenu ci-dessus dans README.md

# 3. Ajouter et pousser
git add README.md
git commit -m "docs: Ajout du README complet du projet"
git push origin main
```

Votre dépôt aura maintenant un README **professionnel et complet** ! 🎉