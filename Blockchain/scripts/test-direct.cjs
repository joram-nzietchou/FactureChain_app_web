const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Adresse du contrat déployé
  const reclamation = await hre.ethers.getContractAt("ReclamationSystem", contractAddress);

  console.log(" Envoi d'une réclamation de test (45 000 FCFA)...");
  
  const tx = await reclamation.creerReclamation("ipfs://preuve-facture-eneo-001", 45000);
  
  console.log(" Validation blockchain en cours...");
  await tx.wait();
  
  console.log("✅ Succès ! Réclamation enregistrée.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
