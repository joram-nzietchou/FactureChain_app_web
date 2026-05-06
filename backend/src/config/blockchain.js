const { ethers } = require('ethers');
const contractABI = require('../abis/ReclamationSystem.json');
require('dotenv').config();

const getProvider = () => {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
  return new ethers.JsonRpcProvider(rpcUrl);
};

const getContract = () => {
  const provider = getProvider();
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  
  if (!contractAddress) throw new Error('CONTRACT_ADDRESS non défini');
  if (!privateKey) return null; // Mode lecture seule
  
  const signer = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, contractABI.abi, signer);
};

module.exports = { getProvider, getContract };