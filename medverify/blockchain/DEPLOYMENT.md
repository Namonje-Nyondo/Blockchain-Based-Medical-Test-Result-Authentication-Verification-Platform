# MedVerify Blockchain Deployment Guide

**Student 3 Responsibility: Deployment Workflows**

## Table of Contents
1. [Deployment Overview](#deployment-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Local Deployment (Hardhat)](#local-deployment-hardhat)
4. [Localhost Deployment (Persistent)](#localhost-deployment-persistent)
5. [Ganache Deployment](#ganache-deployment)
6. [Post-Deployment Tasks](#post-deployment-tasks)
7. [Deployment Verification](#deployment-verification)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Deployment Overview

### Deployment Architecture

```
┌─────────────────────────────────────┐
│   Smart Contract (MedVerifyRegistry) │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┬────────────┬──────────┐
        │                 │            │          │
        ▼                 ▼            ▼          ▼
    Hardhat         Localhost      Ganache    Testnet
   (In-Memory)    (Persistent)    (GUI)      (Sepolia)
   └─ Fast       └─ Debugging   └─ Visual  └─ Real Network
   └─ Testing    └─ Integration └─ Demo    └─ Future
```

### Deployment Process Flow

```
1. Compile Contracts
           ↓
2. Initialize Network
           ↓
3. Deploy Contract
           ↓
4. Verify Deployment
           ↓
5. Initialize Roles
           ↓
6. Save Configuration
           ↓
7. Notification
```

---

## Pre-Deployment Checklist

### Code Review Checklist
- [ ] All contracts compiled without errors
- [ ] All tests passing (`npm test`)
- [ ] Code coverage > 80%
- [ ] No compiler warnings
- [ ] Gas optimization applied
- [ ] Security audit completed (if applicable)

### Environment Checklist
- [ ] Node.js v18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] Contracts compiled (`npm run compile`)
- [ ] Network accessible (if using external network)
- [ ] Sufficient account balance
- [ ] Private keys/mnemonics secured

### Network Checklist
- [ ] Network configuration correct in `hardhat.config.ts`
- [ ] RPC endpoints functioning
- [ ] Chain ID correct for target network
- [ ] Account nonce tracked correctly
- [ ] Gas price appropriate for network

### Documentation Checklist
- [ ] Deployment plan documented
- [ ] Deployment addresses recorded
- [ ] Admin contact information available
- [ ] Emergency procedures documented

---

## Local Deployment (Hardhat)

### Use Case
- Rapid development and testing
- Continuous integration testing
- Ephemeral deployments (state reset)
- No persistent network state

### Deployment Steps

#### Step 1: Compile Contracts
```bash
npm run compile
```

**Expected Output:**
```
Compiling contracts...
✓ Contracts compiled
```

#### Step 2: Deploy (Automatic Network)
```bash
npm run deploy
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════
  MedVerifyRegistry Deployment on HARDHAT
═══════════════════════════════════════════════════════════

Deployer Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Network: hardhat
Deployer Balance: 10000.0 ETH

Compiling contracts...
✓ Contracts compiled

Deploying MedVerifyRegistry with admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

✓ MedVerifyRegistry deployed successfully!
Contract Address: 0x5fbdb2315678afccb333f8a9c6122f65d8fb9b59
Deployment Block: 1
Deployment Hash: 0x1234...

✓ Deployment verified

═══════════════════════════════════════════════════════════
  Deployment Summary
═══════════════════════════════════════════════════════════
Network: hardhat
Contract: MedVerifyRegistry
Address: 0x5fbdb2315678afccb333f8a9c6122f65d8fb9b59
Admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Block: 1
═══════════════════════════════════════════════════════════

✓ Deployment Complete!
```

#### Step 3: Extract Contract Address
```bash
# From output:
Contract Address: 0x5fbdb2315678afccb333f8a9c6122f65d8fb9b59
```

**Save this address!** It's needed for frontend integration.

### Advantages
- ✅ Instant deployment
- ✅ No external dependencies
- ✅ Deterministic behavior
- ✅ Full debugging capabilities

### Limitations
- ❌ Ephemeral (resets on restart)
- ❌ No real blockchain interaction
- ❌ In-memory only

---

## Localhost Deployment (Persistent)

### Use Case
- Integration testing
- Frontend development
- Multi-step testing scenarios
- MetaMask integration

### Prerequisites
```bash
npm install
npm run compile
```

### Deployment Steps

#### Step 1: Start Local Blockchain Node
```bash
npm run node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts (20 available), use them with the '--account' flag:

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812e339D9B73b0245ad59e7DF1d3e (10000 ETH)
Account #2: 0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297 (10000 ETH)
... (17 more accounts)

Ready! Listening at http://127.0.0.1:8545
```

**Keep this terminal running!**

#### Step 2: Deploy to Localhost (New Terminal)
```bash
npm run deploy:local
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════
  MedVerifyRegistry Deployment on LOCALHOST
═══════════════════════════════════════════════════════════

Deployer Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Network: localhost
Deployer Balance: 10000.0 ETH

✓ Deployment verified

Deployment config saved to: ./deployments/localhost-deployment.json

═══════════════════════════════════════════════════════════
  Deployment Summary
═══════════════════════════════════════════════════════════
Network: localhost
Contract: MedVerifyRegistry
Address: 0x8a791620dd6260079bf849dc5567adc3f2fdc318
Admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Block: 1
═══════════════════════════════════════════════════════════

Next Steps:
1. Export contract address: 0x8a791620dd6260079bf849dc5567adc3f2fdc318
2. Update frontend with contract address
3. Run 'npm run setup-roles' to initialize roles
```

#### Step 3: Initialize Roles (Third Terminal)
```bash
npm run setup-roles
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════
  Role Setup on LOCALHOST
═══════════════════════════════════════════════════════════

Admin Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Lab 1 Address: 0x70997970C51812e339D9B73b0245ad59e7DF1d3e
Lab 2 Address: 0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297
Verifier 1 Address: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
Verifier 2 Address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
Pauser Address: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea

Connecting to contract at: 0x8a791620dd6260079bf849dc5567adc3f2fdc318

Registering Labs...
  ✓ Registered lab: 0x70997970C51812e339D9B73b0245ad59e7DF1d3e
  ✓ Registered lab: 0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297

Registering Verifiers...
  ✓ Granted VERIFIER_ROLE to: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
  ✓ Granted VERIFIER_ROLE to: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65

Registering Pausers...
  ✓ Granted PAUSER_ROLE to: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea

═══════════════════════════════════════════════════════════
  Role Setup Summary
═══════════════════════════════════════════════════════════
Network: localhost
Contract: 0x8a791620dd6260079bf849dc5567adc3f2fdc318
Labs: 0x70997970C51812e339D9B73b0245ad59e7DF1d3e, 0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297
Verifiers: 0x90F79bf6EB2c4f870365E785982E1f101E93b906, 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
Pausers: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea

✓ Role Setup Complete!
```

#### Step 4: Configuration Files
Two files are created:

**`deployments/localhost-deployment.json`**
```json
{
  "adminAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "contractAddress": "0x8a791620dd6260079bf849dc5567adc3f2fdc318",
  "deploymentBlock": 1,
  "timestamp": 1704067200000
}
```

**`deployments/localhost-roles.json`**
```json
{
  "adminAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "labAddress": ["0x70997970...", "0x3C44CdDd..."],
  "verifierAddress": ["0x90F79bf6...", "0x15d34AAf..."],
  "pauserAddress": ["0x1CBd3b27..."],
  "setupBlock": 2
}
```

### Accounts Available

| # | Address | Role | Balance |
|---|---------|------|---------|
| 0 | 0xf39F... | Admin | 10000 ETH |
| 1 | 0x7099... | Lab 1 | 10000 ETH |
| 2 | 0x3C44... | Lab 2 | 10000 ETH |
| 3 | 0x90F7... | Verifier 1 | 10000 ETH |
| 4 | 0x15d3... | Verifier 2 | 10000 ETH |
| 5 | 0x1CBd... | Pauser | 10000 ETH |

### Advantages
- ✅ Persistent chain state
- ✅ Realistic blockchain behavior
- ✅ Multiple transactions in sequence
- ✅ Integration testing ready
- ✅ MetaMask compatible

### Accessing from Frontend
```javascript
const CONTRACT_ADDRESS = "0x8a791620dd6260079bf849dc5567adc3f2fdc318";
const RPC_URL = "http://127.0.0.1:8545";

// Configure Web3 provider
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
```

---

## Ganache Deployment

### Prerequisites

#### Install Ganache
```bash
npm install -g ganache-cli
```

#### Verify Installation
```bash
ganache-cli --version
```

### Deployment Steps

#### Step 1: Start Ganache
```bash
ganache-cli
```

**Expected Output:**
```
ganache-cli v7.9.0 (ganache-core: 7.9.0)

Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
(1) 0x70997970C51812e339D9B73b0245ad59e7DF1d3e
... (8 more accounts)

Private Keys
============
(0) 0x1234567890...

HD Wallet
=========
Mnemonic: test test test test test test test test test test test junk
Base HD Path: m/44'/60'/0'/0

listening on 127.0.0.1:8545
```

#### Step 2: Deploy to Ganache
```bash
npm run deploy:ganache
```

#### Step 3: Setup Roles
```bash
npm run setup-roles
```

### Ganache GUI (Optional)
```bash
npm install -g ganache
# Then launch Ganache application from your applications folder
# Create a new workspace pointing to your blockchain folder
```

### Advantages
- ✅ Visual interface available
- ✅ Built-in block explorer
- ✅ Transaction history visible
- ✅ Debugging tools available
- ✅ Good for demonstrations

---

## Post-Deployment Tasks

### 1. Update Frontend Configuration
Create or update `src/utils/contractConfig.js`:

```javascript
export const CONTRACT_CONFIG = {
  address: "0x8a791620dd6260079bf849dc5567adc3f2fdc318",
  network: "localhost",
  rpcUrl: "http://127.0.0.1:8545",
  chainId: 1337
};

export const ACCOUNTS = {
  admin: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  lab1: "0x70997970C51812e339D9B73b0245ad59e7DF1d3e",
  lab2: "0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297",
  verifier1: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  verifier2: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  pauser: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea"
};
```

### 2. Verify Contract Interaction
```bash
# Get contract instance
npx hardhat console --network localhost

# In console:
const registry = await ethers.getContractAt(
  "MedVerifyRegistry",
  "0x8a791620dd6260079bf849dc5567adc3f2fdc318"
);

// Verify deployment
await registry.getRecord("TEST-001").catch(e => console.log("Expected error:", e.reason));
```

### 3. Test Role Assignment
```javascript
const [admin, lab1, verifier1] = await ethers.getSigners();
const LAB_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LAB_ROLE"));

// Verify lab1 has LAB_ROLE
const hasRole = await registry.hasRole(LAB_ROLE, lab1.address);
console.log("Lab1 has LAB_ROLE:", hasRole); // Should be true
```

### 4. Verify Gas Reporting
```bash
npm test
cat gas-report.txt
```

### 5. Documentation Updates
Record in deployment log:
- [ ] Contract address
- [ ] Deployment block
- [ ] Admin address
- [ ] Lab addresses
- [ ] Verifier addresses
- [ ] Deployment timestamp
- [ ] Network used

---

## Deployment Verification

### Automated Verification
The deploy script automatically verifies:
```typescript
const code = await ethers.provider.getCode(contractAddress);
if (code === "0x") {
  throw new Error("Deployment verification failed");
}
```

### Manual Verification Checklist

#### Contract Existence
```bash
npx hardhat console --network localhost
const code = await ethers.provider.getCode("0x8a791620...");
console.log("Contract exists:", code !== "0x");
```

#### Admin Role Verification
```javascript
const DEFAULT_ADMIN_ROLE = 
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const isAdmin = await registry.hasRole(
  DEFAULT_ADMIN_ROLE,
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
);
console.log("Admin verified:", isAdmin);
```

#### Lab Registration Verification
```javascript
const LAB_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LAB_ROLE"));
const isLab = await registry.hasRole(LAB_ROLE, labAddress);
console.log("Lab registered:", isLab);
```

#### Record Registration Test
```javascript
const tx = await registry
  .connect(labSigner)
  .registerRecord(
    "TEST-001",
    ethers.keccak256(ethers.toUtf8Bytes("PATIENT-ID")),
    ethers.keccak256(ethers.toUtf8Bytes("DOCUMENT")),
    ethers.keccak256(ethers.toUtf8Bytes("METADATA"))
  );

await tx.wait();
const record = await registry.getRecord("TEST-001");
console.log("Record registered:", record.recordId === "TEST-001");
```

---

## Rollback Procedures

### Scenario: Failed Deployment

#### Option 1: Redeploy (Recommended)
```bash
# Delete existing config
rm deployments/localhost-deployment.json
rm deployments/localhost-roles.json

# Redeploy
npm run deploy:local
npm run setup-roles
```

#### Option 2: Restart Network
```bash
# Stop current node (Ctrl+C)
# Clear state (optional)
rm -rf cache/

# Restart
npm run node
npm run deploy:local
```

### Scenario: Incorrect Role Assignment

#### Fix Individual Role
```bash
npx hardhat console --network localhost

const LAB_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LAB_ROLE"));
const [admin] = await ethers.getSigners();
const registry = await ethers.getContractAt("MedVerifyRegistry", "0x...");

// Remove incorrect role
await registry.connect(admin).revokeRole(LAB_ROLE, "0xWrongAddress");

// Grant to correct address
await registry.connect(admin).registerLab("0xCorrectAddress");
```

### Scenario: Network Mismatch

#### Verify Network Connection
```bash
# Check current network
npx hardhat run scripts/verify-network.ts --network localhost

# Output should show:
// Connected to: 127.0.0.1:8545
// Chain ID: 1337
```

#### Switch Networks
```bash
npm run deploy:ganache  # Switch to ganache
npm run deploy:local    # Switch to localhost
npm run deploy          # Switch to hardhat
```

---

## Troubleshooting

### Issue: "Failed to connect to network"

**Cause:** Network node not running

**Solution:**
```bash
# Start the network
npm run node
# Wait for "Ready! Listening at..."
```

### Issue: "Insufficient balance"

**For Hardhat/Localhost:**
```bash
# Hardhat auto-funds accounts
# No action needed
```

**For Ganache:**
```bash
# Ganache provides 10 ETH per account
# Use a different account (#0-#9)
```

### Issue: "Contract already exists"

**Cause:** Deploying to address with existing contract

**Solution:**
```bash
# Restart network to clear state
npm run node  # Stop with Ctrl+C
npm run node  # Start fresh
npm run deploy:local
```

### Issue: "Unknown network 'localhost'"

**Cause:** Network configuration missing

**Solution:** Check `hardhat.config.ts` includes localhost:
```typescript
networks: {
  localhost: {
    url: "http://127.0.0.1:8545"
  }
}
```

### Issue: "Role setup fails"

**Cause:** Deployment not found before setup

**Solution:**
```bash
# Verify deployment config exists
ls deployments/
# Should show: localhost-deployment.json

# If missing, redeploy
npm run deploy:local

# Then run setup
npm run setup-roles
```

### Issue: "Gas estimation failed"

**Cause:** Contract state issue or insufficient gas

**Solution:**
```bash
# Increase gas limit
# Edit hardhat.config.ts:
networks: {
  localhost: {
    gas: 6000000,
    gasPrice: 20000000000
  }
}

npm run deploy:local
```

---

## Deployment Checklist

Use this checklist before each deployment:

### Pre-Deployment
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Contracts compiled without errors
- [ ] No compiler warnings
- [ ] Gas optimizations applied
- [ ] Security audit complete

### During Deployment
- [ ] Network running correctly
- [ ] Sufficient balance available
- [ ] Correct network selected
- [ ] Deployment script executing
- [ ] No errors in output
- [ ] Verify step successful

### Post-Deployment
- [ ] Contract address recorded
- [ ] Deployment block recorded
- [ ] Configuration files saved
- [ ] Roles initialized correctly
- [ ] Manual verification passed
- [ ] Frontend updated with address
- [ ] Team notified of deployment

---

## Deployment Log Template

```markdown
## Deployment Log - [DATE]

**Network:** localhost  
**Deployer:** 0x...  
**Contract Address:** 0x...  
**Deployment Block:** 1  
**Deployment Hash:** 0x...  

**Roles Assigned:**
- Admin: 0x...
- Lab 1: 0x...
- Lab 2: 0x...
- Verifier 1: 0x...
- Verifier 2: 0x...
- Pauser: 0x...

**Verification Status:** ✓ Passed
**Frontend Updated:** ✓ Yes
**Issues Encountered:** None

**Notes:**
- Fast and clean deployment
- All roles assigned successfully
- Ready for integration testing
```

---

## Next Steps

1. ✅ Run first deployment: `npm run deploy:local`
2. ✅ Initialize roles: `npm run setup-roles`
3. ✅ Update frontend configuration
4. ✅ Test contract interaction from frontend
5. ✅ Document in deployment log
6. ✅ Share deployment info with team

---

**Last Updated:** Semester 1 2026  
**Responsible:** Student 3 - Blockchain Infrastructure  
**Status:** Ready for Production Deployment
