import { ethers } from "hardhat";

async function main() {
 const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [admin, lab] = await ethers.getSigners();
  const contract = await ethers.getContractAt("MedVerifyRegistry", CONTRACT_ADDRESS);

  const LAB_ROLE = await contract.LAB_ROLE();
  const hasRole = await contract.hasRole(LAB_ROLE, lab.address);

  console.log("Lab address:", lab.address);
  console.log("Has LAB_ROLE:", hasRole);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});