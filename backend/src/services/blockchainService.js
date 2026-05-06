const { ethers } = require('ethers');
const contractABI = require('../abis/ReclamationSystem.json');
require('dotenv').config();

class BlockchainService {
  constructor() {
    this.contract = null;
    this.provider = null;
    this.signer = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return true;

    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
      const contractAddress = process.env.CONTRACT_ADDRESS;
      const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

      if (!contractAddress) throw new Error('CONTRACT_ADDRESS non défini');
      if (!privateKey) throw new Error('PRIVATE_KEY non définie');

      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.signer = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, contractABI.abi, this.signer);
      
      const balance = await this.provider.getBalance(this.signer.address);
      console.log(`✅ Blockchain initialisée - Contrat: ${contractAddress}`);
      console.log(`   Signer: ${this.signer.address}`);
      console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Erreur blockchain:', error.message);
      return false;
    }
  }

  // ============ MÉTHODES POUR LE DASHBOARD ============
  
  async getProchainId() {
    if (!this.initialized) await this.init();
    try {
      if (!this.contract) return { success: false, error: 'Contrat non disponible', id: "0" };
      const id = await this.contract.prochainId();
      return { success: true, id: id.toString() };
    } catch (error) {
      return { success: false, error: error.message, id: "0" };
    }
  }

  // ============ MÉTHODES POUR LES RELEVÉS (smart contract simplifié) ============
  
  async storeReading(subscriberNumber, previousIndex, currentIndex) {
    if (!this.initialized) await this.init();
    
    try {
      console.log(`📝 Enregistrement relevé sur blockchain...`);
      console.log(`   Abonné: ${subscriberNumber}`);
      console.log(`   Index: ${previousIndex} → ${currentIndex}`);
      
      const tx = await this.contract.storeReading(
        subscriberNumber,
        previousIndex,
        currentIndex
      );
      
      console.log(`📡 Transaction envoyée: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ Confirmée au block ${receipt.blockNumber}`);
      
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
      console.error('❌ Erreur:', error.message);
      return { success: false, error: error.message };
    }
  }

  // ⚠️ Méthode pour l'historique blockchain - Nom corrigé
  async getSubscriberReadings(subscriberNumber) {
    if (!this.initialized) await this.init();
    
    try {
      if (!this.contract) {
        return { success: false, error: 'Contrat non disponible', readings: [] };
      }
      
      const readingIds = await this.contract.getSubscriberReadingIds(subscriberNumber);
      const readings = [];
      
      for (let i = 0; i < readingIds.length; i++) {
        const reading = await this.contract.getReading(readingIds[i]);
        readings.push({
          id: reading.id.toString(),
          owner: reading.owner,
          subscriberNumber: reading.subscriberNumber,
          previousIndex: reading.previousIndex.toString(),
          currentIndex: reading.currentIndex.toString(),
          timestamp: new Date(parseInt(reading.timestamp) * 1000).toISOString()
        });
      }
      
      return { success: true, readings };
    } catch (error) {
      console.error('Erreur getSubscriberReadings:', error.message);
      return { success: false, error: error.message, readings: [] };
    }
  }

  // Alias pour compatibilité
  async getReadings(subscriberNumber) {
    return this.getSubscriberReadings(subscriberNumber);
  }
}

module.exports = new BlockchainService();