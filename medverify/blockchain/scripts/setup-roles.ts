import hre from "hardhat";
import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────
//  Role Setup Configuration
// ─────────────────────────────────────────────────────────────

interface RoleSetup {
  adminAddress: string;
  labAddress: string[];
  verifierAddress: string[];
  pauserAddress: string[];
  setupTimestamp: number;
  setupBlock: number;
}

const ROLE_SETUP: RoleSetup = {
  adminAddress: "", // Will be set to deployer
  labAddress: [], // Will be populated based on command line args or defaults
  verifierAddress: [], // Will be populated based on command line args or defaults
  pauserAddress: [], // Will be populated based on command line args or defaults
  setupTimestamp: 0,
  setupBlock: 0
};

// ─────────────────────────────────────────────────────────────
//  Role Constants
// ─────────────────────────────────────────────────────────────
const LAB_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("LAB_ROLE"));
const VERIFIER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("VERIFIER_ROLE"));
const PAUSER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("PAUSER_ROLE"));

// ─────────────────────────────────────────────────────────────
//  Main Setup Function
// ─────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const { ethers, network } = hre;

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  Role Setup on ${network.name.toUpperCase()}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  // Get signers
  const signers = await ethers.getSigners();
  const [admin, lab1, lab2, verifier1, verifier2, pauser] = signers;

  console.log(`Admin Address: ${admin.address}`);
  console.log(`Lab 1 Address: ${lab1.address}`);
  console.log(`Lab 2 Address: ${lab2.address}`);
  console.log(`Verifier 1 Address: ${verifier1.address}`);
  console.log(`Verifier 2 Address: ${verifier2.address}`);
  console.log(`Pauser Address: ${pauser.address}\n`);

  // Load deployment configuration
  const deploymentConfigPath = path.join(
    __dirname,
    `../deployments/${network.name}-deployment.json`
  );

  if (!fs.existsSync(deploymentConfigPath)) {
    throw new Error(
      `Deployment config not found! Run 'npm run deploy' first on ${network.name}`
    );
  }

  const deploymentConfig = JSON.parse(fs.readFileSync(deploymentConfigPath, "utf8"));
  const contractAddress = deploymentConfig.contractAddress;

  if (!contractAddress) {
    throw new Error("Invalid deployment configuration: contractAddress missing");
  }

  console.log(`Connecting to contract at: ${contractAddress}\n`);

  // Get contract instance
  const registry = await ethers.getContractAt("MedVerifyRegistry", contractAddress);

  // ─────────────────────────────────────────────────────────
  //  Register Labs
  // ─────────────────────────────────────────────────────────
  console.log("Registering Labs...");
  const labAddresses = [lab1.address, lab2.address];

  for (const labAddr of labAddresses) {
    const isLab = await registry.hasRole(LAB_ROLE, labAddr);
    if (isLab) {
      console.log(`  ✓ ${labAddr} already has LAB_ROLE`);
    } else {
      const tx = await registry.connect(admin).registerLab(labAddr);
      await tx.wait();
      console.log(`  ✓ Registered lab: ${labAddr}`);
    }
  }
  console.log("");

  // ─────────────────────────────────────────────────────────
  //  Register Verifiers
  // ─────────────────────────────────────────────────────────
  console.log("Registering Verifiers...");
  const verifierAddresses = [verifier1.address, verifier2.address];

  for (const verifierAddr of verifierAddresses) {
    const isVerifier = await registry.hasRole(VERIFIER_ROLE, verifierAddr);
    if (isVerifier) {
      console.log(`  ✓ ${verifierAddr} already has VERIFIER_ROLE`);
    } else {
      const tx = await registry.connect(admin).grantRole(VERIFIER_ROLE, verifierAddr);
      await tx.wait();
      console.log(`  ✓ Granted VERIFIER_ROLE to: ${verifierAddr}`);
    }
  }
  console.log("");

  // ─────────────────────────────────────────────────────────
  //  Register Pausers
  // ─────────────────────────────────────────────────────────
  console.log("Registering Pausers...");
  const pauserAddresses = [pauser.address];

  for (const pauserAddr of pauserAddresses) {
    const isPauser = await registry.hasRole(PAUSER_ROLE, pauserAddr);
    if (isPauser) {
      console.log(`  ✓ ${pauserAddr} already has PAUSER_ROLE`);
    } else {
      const tx = await registry.connect(admin).grantRole(PAUSER_ROLE, pauserAddr);
      await tx.wait();
      console.log(`  ✓ Granted PAUSER_ROLE to: ${pauserAddr}`);
    }
  }
  console.log("");

  // ─────────────────────────────────────────────────────────
  //  Verify Roles
  // ─────────────────────────────────────────────────────────
  console.log("Verifying Roles...");

  for (const labAddr of labAddresses) {
    const isLab = await registry.hasRole(LAB_ROLE, labAddr);
    console.log(`  ${labAddr}: LAB_ROLE = ${isLab ? "✓" : "✗"}`);
  }

  for (const verifierAddr of verifierAddresses) {
    const isVerifier = await registry.hasRole(VERIFIER_ROLE, verifierAddr);
    console.log(`  ${verifierAddr}: VERIFIER_ROLE = ${isVerifier ? "✓" : "✗"}`);
  }

  for (const pauserAddr of pauserAddresses) {
    const isPauser = await registry.hasRole(PAUSER_ROLE, pauserAddr);
    console.log(`  ${pauserAddr}: PAUSER_ROLE = ${isPauser ? "✓" : "✗"}`);
  }
  console.log("");

  // ─────────────────────────────────────────────────────────
  //  Save Role Setup Configuration
  // ─────────────────────────────────────────────────────────
  const blockNumber = await ethers.provider.getBlockNumber();

  const roleSetupConfig: RoleSetup = {
    adminAddress: admin.address,
    labAddress: labAddresses,
    verifierAddress: verifierAddresses,
    pauserAddress: pauserAddresses,
    setupTimestamp: Date.now(),
    setupBlock: blockNumber
  };

  const rolesConfigFile = path.join(__dirname, `../deployments/${network.name}-roles.json`);
  fs.writeFileSync(rolesConfigFile, JSON.stringify(roleSetupConfig, null, 2));
  console.log(`Role setup config saved to: ${rolesConfigFile}\n`);

  // ─────────────────────────────────────────────────────────
  //  Summary
  // ─────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Role Setup Summary");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Network: ${network.name}`);
  console.log(`Contract: ${contractAddress}`);
  console.log(`\nRoles Assigned:`);
  console.log(`  Admin: ${admin.address}`);
  console.log(`  Labs: ${labAddresses.join(", ")}`);
  console.log(`  Verifiers: ${verifierAddresses.join(", ")}`);
  console.log(`  Pausers: ${pauserAddresses.join(", ")}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("✓ Role Setup Complete!");
}

// ─────────────────────────────────────────────────────────────
//  Error Handling
// ─────────────────────────────────────────────────────────────
main().catch((error: Error) => {
  console.error("\n✗ Role setup failed:");
  console.error(error);
  process.exitCode = 1;
});
