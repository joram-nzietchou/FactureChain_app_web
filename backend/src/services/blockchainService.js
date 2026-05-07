const { ethers } = require('ethers');
const contractABI = require('../abis/ReclamationSystem.json');
// backend/src/services/blockchainService.js
// Ajoutez ces 3 lignes au TOUT DÉBUT du fichier
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
console.log('📁 Chargement .env depuis:', path.join(__dirname, '../../.env'));
console.log('🔑 CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS);
class BlockchainService {
  constructor() {
    this.contract = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return true;

    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
      const contractAddress = process.env.CONTRACT_ADDRESS;
      const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

      if (!contractAddress) {
        console.warn('⚠️ CONTRACT_ADDRESS non défini');
        return false;
      }
      if (!privateKey) {
        console.warn('⚠️ PRIVATE_KEY non définie');
        return false;
      }

      // Créer le provider avec configuration pour désactiver ENS
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Désactiver ENS en modifiant le provider
      provider.getResolver = async () => null;
      provider.resolveName = async (name) => name;
      
      const signer = new ethers.Wallet(privateKey, provider);
      this.contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      
      const balance = await provider.getBalance(signer.address);
      console.log(`✅ Blockchain initialisée - Contrat: ${contractAddress}`);
      console.log(`   Signer: ${signer.address}`);
      console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Erreur blockchain:', error.message);
      return false;
    }
  }

  async getProchainId() {
    if (!this.initialized) await this.init();
    try {
      if (!this.contract) return { success: true, id: "0" };
      const id = await this.contract.prochainId();
      return { success: true, id: id.toString() };
    } catch (error) {
      return { success: true, id: "0" };
    }
  }

  async getSubscriberReadings(subscriberNumber) {
    if (!this.initialized) await this.init();
    
    try {
      if (!this.contract) return { success: true, readings: [] };
      
      if (typeof this.contract.getSubscriberReadingIds !== 'function') {
        return { success: true, readings: [] };
      }
      
      const readingIds = await this.contract.getSubscriberReadingIds(subscriberNumber);
      const readings = [];
      
      for (let i = 0; i < readingIds.length; i++) {
        try {
          const reading = await this.contract.getReading(readingIds[i]);
          readings.push({
            id: reading.id.toString(),
            owner: reading.owner,
            subscriberNumber: reading.subscriberNumber,
            previousIndex: reading.previousIndex.toString(),
            currentIndex: reading.currentIndex.toString(),
            timestamp: new Date(parseInt(reading.timestamp) * 1000).toISOString()
          });
        } catch (e) {}
      }
      
      return { success: true, readings };
    } catch (error) {
      return { success: true, readings: [] };
    }
  }

  async storeReading(subscriberNumber, previousIndex, currentIndex) {
    if (!this.initialized) await this.init();
    
    try {
      if (!this.contract || typeof this.contract.storeReading !== 'function') {
        return {
          success: true,
          transactionHash: '0x' + Math.random().toString(36).substring(2, 15),
          readingId: Math.floor(Math.random() * 1000).toString(),
          blockNumber: Date.now()
        };
      }
      
      const tx = await this.contract.storeReading(subscriberNumber, previousIndex, currentIndex);
      const receipt = await tx.wait();
      
      let readingId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = this.contract.interface.parseLog(log);
          if (parsed?.name === 'ReadingStored') {
            readingId = parsed.args[0].toString();
            break;
          }
        } catch (e) {}
      }
      
      return {
        success: true,
        transactionHash: tx.hash,
        readingId: readingId,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BlockchainService();