const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Déploiement du contrat ReclamationSystem...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log(`📡 Déployé depuis: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH\n`);
  
  const ReclamationSystem = await ethers.getContractFactory("ReclamationSystem");
  const reclamationSystem = await ReclamationSystem.deploy();
  
  await reclamationSystem.waitForDeployment();
  const address = await reclamationSystem.getAddress();
  
  console.log(`\n✅ Contrat déployé à: ${address}`);
  
  // Sauvegarder l'adresse
  const contractInfo = {
    address: address,
    network: "localhost",
    chainId: 31337,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };
  
  // Sauvegarder pour le backend
  const backendPath = path.join(__dirname, "../../app_web/backend/contract-address.json");
  const localPath = path.join(__dirname, "../contract-address.json");
  
  fs.writeFileSync(localPath, JSON.stringify(contractInfo, null, 2));
  
  if (fs.existsSync(path.dirname(backendPath))) {
    fs.writeFileSync(backendPath, JSON.stringify(contractInfo, null, 2));
    console.log(`📁 Adresse sauvegardée pour le backend`);
  }
  
  console.log(`\n🔗 Explorer: http://localhost:8545`);
  console.log(`📋 Adresse du contrat: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});