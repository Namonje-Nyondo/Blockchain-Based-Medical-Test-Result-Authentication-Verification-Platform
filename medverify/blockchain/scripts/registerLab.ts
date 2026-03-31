import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const [admin, lab] = await ethers.getSigners();

  console.log("Admin address:", admin.address);
  console.log("Lab address:  ", lab.address);

  const contract = await ethers.getContractAt(
    "MedVerifyRegistry",
    CONTRACT_ADDRESS
  ) as any;

  const tx = await contract.connect(admin).registerLab(lab.address);
  await tx.wait();

  console.log("✅ Lab registered:", lab.address);
  console.log("TX hash:", tx.hash);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});