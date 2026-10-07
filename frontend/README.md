# 🎨 LUMINA Frontend

Interface web moderne et responsive de LUMINA. Elle permet aux abonnés ENEO de suivre leur consommation, de repérer les anomalies de facturation et de déposer des réclamations adossées à une preuve blockchain.

[← Retour au README principal](../README.md)

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Structure](#structure)
- [Pages](#pages)
- [Design](#design)
- [Déploiement](#déploiement)
- [Dépannage](#dépannage)
- [Support](#support)

---

## Fonctionnalités

- 🔐 Authentification complète (connexion, inscription, mot de passe oublié)
- 📊 Tableau de bord avec indicateurs de consommation
- 📈 Relevé de compteur avec calcul automatique de la facture
- 📝 Réclamation en 4 étapes
- 📋 Suivi des réclamations avec timeline
- 🔗 Historique blockchain consultable
- 👤 Profil utilisateur modifiable
- 📱 Design responsive (mobile, tablette, desktop)

---

## Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18.2.0 | Bibliothèque UI |
| Vite | 5.4.0 | Outil de build |
| React Router | 6.x | Navigation |
| Context API | – | Gestion d'état |
| CSS-in-JS | – | Styles |
| Fetch API | – | Requêtes HTTP |

---

## Installation

**Prérequis :** Node.js v18+ et npm (ou yarn).

```bash
cd frontend
npm install
```

---

## Configuration

Créez votre fichier d'environnement à partir du modèle :

```bash
cp .env.example .env
```

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:3001/api` |
| `VITE_CONTRACT_ADDRESS` | Adresse du smart contract déployé | `0x…` |

> Adaptez les valeurs à votre fichier `.env.example`. Ne committez jamais votre `.env`.

---

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (http://localhost:5173) |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | Vérification du code |

---

## Structure

```text
frontend/
├── public/
│   ├── logo.png
│   └── logo2.png
├── src/
│   ├── components/
│   │   ├── Icons.jsx              # Icônes SVG
│   │   └── Navbar.jsx             # Barre de navigation
│   ├── contexts/
│   │   └── AuthContext.jsx        # Contexte d'authentification
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MeterReading.jsx
│   │   ├── Reclamation.jsx
│   │   ├── Suivi.jsx
│   │   ├── BlockchainHistory.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   ├── api.js                 # Client API centralisé
│   │   ├── authService.js
│   │   └── claimService.js
│   ├── utils/
│   │   └── validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Présentation, fonctionnalités clés, fonctionnement, statistiques, appel à l'action |
| `/login` | Login | Email + mot de passe, affichage/masquage du mot de passe, liens utiles |
| `/register` | Register | Inscription en 2 étapes : informations personnelles, puis vérification ENEO et mot de passe |
| `/forgot-password` | ForgotPassword | Saisie de l'email et confirmation d'envoi |
| `/dashboard` | Dashboard | 4 cartes de statistiques, actions rapides, historique des factures avec filtres et pagination |
| `/meter-reading` | MeterReading | Saisie des index, calcul par tranche, enregistrement blockchain |
| `/reclamation` | Reclamation | Identification, anomalies détectées, description du litige, confirmation |
| `/suivi` | Suivi | Liste des réclamations, détails, timeline, preuve blockchain |
| `/blockchain-history` | BlockchainHistory | Vue combinée relevés/réclamations, filtres, hash, vérification Polygonscan |
| `/profile` | Profile | Modification des informations, changement de mot de passe, statistiques, déconnexion |

---

## Design

### Palette

| Couleur | Code | Usage |
|---------|------|-------|
| Orange principal | `#f59e0b` | Couleur primaire LUMINA |
| Orange foncé | `#ea580c` | Dégradés, survol |
| Bleu nuit | `#0f172a` | Fonds sombres |
| Bleu profond | `#1e1b4b` | Dégradés |
| Vert succès | `#16a34a` | Confirmations |
| Rouge erreur | `#ef4444` | Alertes |

### Typographie

Police principale **Inter**, avec repli sur `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`.

### Principes

- **Mobile-first** et responsive
- **Accessible** : contrastes respectés
- **Cohérent** : palette unifiée sur toutes les pages

---

## Déploiement

### Vercel (recommandé)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Définissez `VITE_API_URL` et `VITE_CONTRACT_ADDRESS` dans les variables d'environnement de votre plateforme.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| Page blanche | Vérifier `VITE_API_URL` dans `.env` |
| « Blockchain déconnectée » | Vérifier que le backend est démarré |
| Erreur CORS | Vérifier la configuration CORS du backend |
| Logo non affiché | Vérifier que `logo2.png` est dans `public/` |

---

## Support

- Email : [joramnzietchou@gmail.com)
- GitHub : [@joram-nzietchou](https://github.com/joram-nzietchou)