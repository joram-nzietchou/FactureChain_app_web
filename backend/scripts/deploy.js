const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Déploiement du contrat ReclamationSystem...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log(`📡 Déployé depuis: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} MATIC\n`);
  
  // Déployer
  console.log("📝 Déploiement en cours...");
  const ReclamationSystem = await ethers.getContractFactory("ReclamationSystem");
  const reclamationSystem = await ReclamationSystem.deploy();
  
  await reclamationSystem.waitForDeployment();
  const address = await reclamationSystem.getAddress();
  
  console.log(`\n✅ Contrat déployé à: ${address}`);
  
  // Sauvegarder l'adresse
  const network = await ethers.provider.getNetwork();
  const contractInfo = {
    address: address,
    network: network.chainId === 80002 ? "amoy" : "localhost",
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    explorerUrl: network.chainId === 80002 
      ? `https://amoy.polygonscan.com/address/${address}`
      : `http://localhost:8545`
  };
  
  // Sauvegarder pour le backend
  const backendPath = path.join(__dirname, "../../app_web/backend/contract-address.json");
  fs.writeFileSync("contract-address.json", JSON.stringify(contractInfo, null, 2));
  
  if (fs.existsSync(path.dirname(backendPath))) {
    fs.writeFileSync(backendPath, JSON.stringify(contractInfo, null, 2));
    console.log(`📁 Adresse sauvegardée pour le backend`);
  }
  
  console.log(`\n🔗 Explorer: ${contractInfo.explorerUrl}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});