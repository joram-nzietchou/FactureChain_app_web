#  FactureChain - Système de Réclamation Blockchain (ENEO)

Ce module permet d'enregistrer les plaintes de surfacturation de manière immuable sur la Blockchain et de notifier les utilisateurs en temps réel.


## 1. INSTALLATION INITIALE
*À faire une seule fois pour préparer l'environnement sur le PC.*

```bash
# Installation des bibliothèques (Blockchain + Backend)
npm install

# Compilation du Smart Contract (génère l'ABI pour le Frontend)
npx hardhat compile
```

---

##  2. LANCEMENT DE LA DÉMONSTRATION
*Ouvrez **3 terminaux** distincts et suivez cet ordre précis :*

###  TERMINAL 1 : LE RÉSEAU BLOCKCHAIN
```bash
npx hardhat node
```
*Laissez ce terminal ouvert. Il simule le registre public.*

###  TERMINAL 2 : DÉPLOIEMENT DU CONTRAT
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*👉 **Action requise** : Copiez l'adresse du contrat affichée et vérifiez qu'elle est identique dans `server.js` et `test-direct.cjs`.*

###  TERMINAL 3 : LE SERVEUR DE NOTIFICATIONS
```bash
node server.js
```
*Ce serveur fait le lien entre la Blockchain et l'App mobile.*

---

##  3. TEST DE VALIDATION (SIMULATION PLAINTE)
*À exécuter dans le **TERMINAL 2** pour prouver que tout communique.*

```bash
npx hardhat run scripts/test-direct.cjs --network localhost
```
**Résultat attendu :**
- Terminal 2 : `✅ Succès ! Réclamation enregistrée.`
- Terminal 3 (Serveur) : `🔔 Alerte : Nouvelle réclamation détectée !`

---

##  4. COMMANDES DE SECOURS (EN CAS DE BUG)
*Si le terminal est figé ou si vous avez des erreurs rouges.*

```bash
# 1. Arrêter un processus bloqué
Appuyer sur [CTRL + C]

# 2. Nettoyer les anciens fichiers de test
npx hardhat clean

# 3. Forcer la mise à jour des modules
npm pkg set type="module"
```

---

##  5. INTERFACE FRONTEND (DOSSIER DE LIVRAISON)
 éléments du développement Frontend :
1. **Adresse du contrat** : `0x5FbDB2315678afecb367f032d93F642f64180aa3`
2. **Chemin de l'ABI** : `./artifacts/contracts/Reclamation.sol/ReclamationSystem.json`
3. **URL Websocket** : `http://localhost:3000`
