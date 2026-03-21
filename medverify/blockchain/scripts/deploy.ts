import hre from "hardhat";

async function main(): Promise<void> {
  const { ethers } = hre as any;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Registry = await ethers.getContractFactory("MedVerifyRegistry");
  const registry = await Registry.deploy(deployer.address);

  await registry.waitForDeployment();
  console.log("MedVerifyRegistry deployed to:", await registry.getAddress());
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});