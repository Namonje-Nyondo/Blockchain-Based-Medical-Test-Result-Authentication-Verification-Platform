import hre from "hardhat";
import { Contract, AddressLike } from "ethers";
import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────
//  Deployment Configuration
// ─────────────────────────────────────────────────────────────
interface DeploymentConfig {
  adminAddress: string;
  contractAddress?: string;
  deploymentBlock?: number;
  timestamp?: number;
}

// ─────────────────────────────────────────────────────────────
//  Main Deployment Function
// ─────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const { ethers, network } = hre;

  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  MedVerifyRegistry Deployment on ${network.name.toUpperCase()}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Network: ${network.name}`);

  // Get deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} ETH\n`);

  // Verify sufficient balance
  if (balance === 0n) {
    throw new Error(
      `Deployer has no balance! Fund ${deployer.address} before deploying.`
    );
  }

  // ─────────────────────────────────────────────────────────
  //  Get Contract Factory & Deploy
  // ─────────────────────────────────────────────────────────
  console.log("Compiling contracts...");
  const Registry = await ethers.getContractFactory("MedVerifyRegistry");
  console.log("✓ Contracts compiled\n");

  console.log(`Deploying MedVerifyRegistry with admin: ${deployer.address}`);
  console.log("Please wait...\n");

  const registry = await Registry.deploy(deployer.address);
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  const deploymentTx = registry.deploymentTransaction();
  const deploymentBlock = deploymentTx?.blockNumber || 0;

  console.log("✓ MedVerifyRegistry deployed successfully!");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Deployment Block: ${deploymentBlock}`);
  console.log(`Deployment Hash: ${deploymentTx?.hash}\n`);

  // ─────────────────────────────────────────────────────────
  //  Verify Deployment
  // ─────────────────────────────────────────────────────────
  console.log("Verifying deployment...");
  const code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error("Deployment verification failed: No code at contract address");
  }
  console.log("✓ Deployment verified\n");

  // ─────────────────────────────────────────────────────────
  //  Save Deployment Configuration
  // ─────────────────────────────────────────────────────────
  const deploymentConfig: DeploymentConfig = {
    adminAddress: deployer.address,
    contractAddress: contractAddress,
    deploymentBlock: deploymentBlock,
    timestamp: Date.now()
  };

  const configDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configFile = path.join(configDir, `${network.name}-deployment.json`);
  fs.writeFileSync(configFile, JSON.stringify(deploymentConfig, null, 2));
  console.log(`Deployment config saved to: ${configFile}\n`);

  // ─────────────────────────────────────────────────────────
  //  Display Deployment Summary
  // ─────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Deployment Summary");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Network: ${network.name}`);
  console.log(`Contract: MedVerifyRegistry`);
  console.log(`Address: ${contractAddress}`);
  console.log(`Admin: ${deployer.address}`);
  console.log(`Block: ${deploymentBlock}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("✓ Deployment Complete!");
  console.log("\nNext Steps:");
  console.log(`1. Export contract address: ${contractAddress}`);
  console.log(`2. Update frontend with contract address`);
  console.log(`3. Run 'npm run setup-roles' to initialize roles\n`);

  return;
}

// ─────────────────────────────────────────────────────────────
//  Error Handling
// ─────────────────────────────────────────────────────────────
main().catch((error: Error) => {
  console.error("\n✗ Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});