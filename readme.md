# ⚡ LUMINA — Surveillance électrique & transparence énergétique

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-black)](https://soliditylang.org/)
[![Polygon](https://img.shields.io/badge/Polygon-AMOY-purple)](https://polygon.technology/)

> **LUMINA** est une application web qui permet aux abonnés ENEO du Cameroun de lutter contre les surfacturations et le vol d'électricité grâce à la blockchain Polygon.

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Problématique](#-problématique)
- [Solution](#-solution)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Structure du projet](#-structure-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Documentation détaillée](#-documentation-détaillée)
- [Contribution](#-contribution)
- [Licence](#-licence)
- [Contact](#-contact)

---

## 🎯 À propos

**LUMINA** (du latin *lumen* = lumière) est une solution de **surveillance électrique intelligente** qui apporte transparence et justice dans la relation entre les abonnés ENEO et leur fournisseur d'électricité.

Le projet combine :
- 📊 **Surveillance de la consommation** (anti-surfacturation)
- 🤖 **Détection de fraude** (anti-branchement illicite)
- 🔗 **Preuve blockchain** (infalsifiable)
- 📱 **Interface moderne** (accessible à tous)

---

## 🔍 Problématique

### Problème n°1 : Surfacturations ENEO

| Indicateur | Valeur | Source |
|------------|--------|--------|
| Abonnés ENEO | 3 000 000+ | ARSEL 2024 |
| Contestations de factures | 40% | ARSEL 2024 |
| Appels de réclamation (2024) | 7 622 (+53%) | ARSEL 2024 |
| Délai de résolution | 2 à 18 mois | ARSEL 2024 |
| Compteurs défaillants | 800 000 | ENEO |

### Problème n°2 : Vol d'électricité

| Indicateur | Valeur | Source |
|------------|--------|--------|
| Pertes annuelles | 60 milliards FCFA | ENEO |
| Énergie détournée | 30% | ENEO |
| Décès par électrocution (2024) | 32 morts | ENEO |
| Taux de fraude (région Est) | 60% | ENEO |

---

## 💡 Solution

LUMINA agit sur **trois niveaux** :

### 1️⃣ Surveillance de la consommation
- Saisie ou captation automatique de l'index
- Calcul en temps réel selon les tarifs officiels ENEO
- Détection automatique des anomalies

### 2️⃣ Détection de fraude (IoT)
- Capteurs ESP32 + ACS712 en amont et aval du compteur
- Comparaison du courant entrant et sortant
- Alerte immédiate en cas de disparité

### 3️⃣ Preuve blockchain
- Enregistrement immuable sur Polygon
- Horodatage certifié
- Vérification publique sur Polygonscan

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React) │
│ http://localhost:5173 │
└─────────────────────────────────────────────────────────────┘
│
│ API REST
▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (Node.js) │
│ http://localhost:3001 │
└─────────────────────────────────────────────────────────────┘
│ │
▼ ▼
┌──────────────────┐ ┌──────────────────────────────┐
│ MONGODB │ │ BLOCKCHAIN POLYGON │
│ Base de données│ │ (Testnet Amoy) │
└──────────────────┘ └──────────────────────────────┘
▲
│
┌──────────────────┐
│ CAPTEURS IoT │
│ ESP32 + ACS712 │
└──────────────────┘

text

---

## 🛠️ Stack technique

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18.2 | Interface utilisateur |
| Vite | 5.4 | Build tool |
| Context API | - | Gestion d'état |

### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 22.x | Runtime |
| Express | 4.18 | Framework API |
| MongoDB | 6.x | Base de données |
| Mongoose | 8.0 | ODM MongoDB |
| JWT | 9.0 | Authentification |
| bcryptjs | 2.4 | Hachage |

### Blockchain
| Technologie | Version | Rôle |
|-------------|---------|------|
| Solidity | 0.8.20 | Smart contract |
| Hardhat | 2.22 | Environnement dev |
| Ethers.js | 6.13 | Interaction |
| Polygon Amoy | - | Réseau testnet |

### IoT (en développement)
| Technologie | Rôle |
|-------------|------|
| ESP32 | Microcontrôleur |
| ACS712 | Capteur de courant |
| ZMPT101B | Capteur de tension |

---

## 🚀 Installation

### Prérequis

- **Node.js** (v18 ou supérieur)
- **MongoDB** (local ou Atlas)
- **Git**
- **MetaMask** (optionnel)

### Cloner le dépôt

```bash
git clone https://github.com/joram-nzietchou/LUMINA.git
cd LUMINA
Installation des dépendances
bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Blockchain
cd ../blockchain
npm install
▶️ Démarrage
1. Démarrer MongoDB
bash
# Windows
net start MongoDB

# macOS/Linux
brew services start mongodb-community
2. Démarrer la blockchain locale
bash
cd blockchain
npx hardhat node
⚠️ Ce terminal doit rester ouvert

3. Déployer le contrat
bash
# Dans un nouveau terminal
cd blockchain
npx hardhat run scripts/deploy.cjs --network localhost
4. Démarrer le backend
bash
cd backend
npm run dev
Résultat attendu :

text
✅ MongoDB connecté: localhost
✅ Blockchain initialisée
🚀 Serveur démarré sur http://localhost:3001
5. Démarrer le frontend
bash
cd frontend
npm run dev
Accès : http://localhost:5173

📁 Structure du projet
text
LUMINA/
│
├── frontend/                    # Application React
│   ├── src/
│   │   ├── pages/              # Pages de l'application
│   │   ├── components/         # Composants réutilisables
│   │   ├── contexts/           # Contextes React
│   │   ├── services/           # Services API
│   │   └── App.jsx
│   └── README.md
│
├── backend/                     # API Node.js
│   ├── src/
│   │   ├── models/             # Modèles MongoDB
│   │   ├── controllers/        # Contrôleurs
│   │   ├── routes/             # Routes API
│   │   ├── services/           # Services métier
│   │   ├── middleware/         # Middlewares
│   │   └── app.js
│   └── README.md
│
├── blockchain/                  # Smart contracts
│   ├── contracts/
│   │   └── Reclamation.sol
│   ├── scripts/
│   │   └── deploy.cjs
│   └── hardhat.config.cjs
│
├── .gitignore
├── LICENSE
└── README.md
✨ Fonctionnalités
🔐 Authentification
Inscription avec vérification ENEO

Connexion sécurisée (JWT)

Mot de passe oublié

Gestion du profil

📊 Dashboard
Indicateurs de consommation

Historique des factures

Statistiques par zone

📈 Relevé de compteur
Saisie des index

Calcul automatique

Aperçu de la facture

📝 Réclamation
Formulaire en 4 étapes

Preuve blockchain

Confirmation et suivi

📋 Suivi
Timeline des réclamations

Statut en temps réel

Historique complet

🔗 Historique blockchain
Relevés et réclamations

Vérification sur Polygonscan

📚 Documentation détaillée
Documentation du backend

Documentation du frontend

🤝 Contribution
Les contributions sont les bienvenues !

Fork le projet

Créez votre branche (git checkout -b feature/NouvelleFonctionnalite)

Committez (git commit -m 'Ajout d'une nouvelle fonctionnalité')

Poussez (git push origin feature/NouvelleFonctionnalite)

Ouvrez une Pull Request

📞 Contact
Joram Nzietchou

GitHub : @joram-nzietchou

Email : joramnzietchou@gmail.com

<p align="center"> <b>LUMINA — La transparence énergétique par la blockchain</b> ⚡ </p> ```