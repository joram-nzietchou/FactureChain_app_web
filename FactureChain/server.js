import express from 'express';
import { ethers } from 'ethers';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// 1. Connexion à TA blockchain locale
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// 2. Charger l'ABI (récupéré de ton artifacts)
const contractJson = JSON.parse(fs.readFileSync('./artifacts/contracts/Reclamation.sol/ReclamationSystem.json'));
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contract = new ethers.Contract(contractAddress, contractJson.abi, provider);

// 3. ÉCOUTER la blockchain en temps réel
console.log("on écoute les réclamations sur la blockchain...");

contract.on("NouvelleReclamation", (id, abonne) => {
    console.log(`🔔 Alerte : Nouvelle réclamation n°${id} par ${abonne}`);
    // Envoyer l'info au Frontend instantanément via WebSocket
    io.emit("notification", { id: id.toString(), message: "Une nouvelle plainte a été enregistrée !" });
});

httpServer.listen(3000, () => {
    console.log('Serveur de notifications démarré sur le port 3000');
});
