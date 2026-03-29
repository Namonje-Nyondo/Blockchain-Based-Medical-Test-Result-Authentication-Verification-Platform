# MedVerify Blockchain Infrastructure Guide

**Student 3 Responsibility: Blockchain Development Tools & Infrastructure**

## Table of Contents
1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Quick Start](#quick-start)
4. [Project Structure](#project-structure)
5. [Environment Setup](#environment-setup)
6. [Hardhat Configuration](#hardhat-configuration)
7. [Available Networks](#available-networks)
8. [Common Commands](#common-commands)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This document provides a comprehensive guide for managing the MedVerify blockchain infrastructure using Hardhat. The infrastructure supports development, testing, and deployment on multiple blockchain networks.

### Key Features
- ✅ **Solidity Compilation** - Multiple compiler versions with optimization
- ✅ **Local Testing** - Hardhat, Ganache, and Localhost networks
- ✅ **Gas Reporting** - Monitor and optimize contract execution costs
- ✅ **TypeChain Integration** - Type-safe contract interaction in TypeScript
- ✅ **Automated Testing** - Comprehensive test suite with Chai assertions
- ✅ **Automated Deployment** - Scripted deployment with role initialization
- ✅ **Code Coverage** - Solidity code coverage analysis

---

## System Requirements

### Minimum Requirements
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Disk Space:** 500MB (including node_modules)

### Recommended Setup
- **Node.js:** v20.x or higher
- **CPU:** 4+ cores
- **RAM:** 8GB+
- **OS:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Installation Check
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

---

## Quick Start

### 1. Install Dependencies
```bash
cd medverify/blockchain
npm install
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Run Tests
```bash
npm test
```

### 4. Start Local Network
```bash
npm run node
# In another terminal:
npm run deploy:local
npm run setup-roles
```

---

## Project Structure

```
blockchain/
├── contracts/              # Smart contracts
│   └── MedVerifyRegistry.sol
├── scripts/                # Deployment and setup scripts
│   ├── deploy.ts          # Main deployment script
│   └── setup-roles.ts     # Role initialization
├── test/                   # Test files
│   └── MedVerifyRegistry.ts
├── artifacts/              # Compiled contracts (generated)
├── typechain-types/        # TypeChain types (generated)
├── cache/                  # Hardhat cache (generated)
├── deployments/            # Deployment configs (generated)
│   ├── hardhat-deployment.json
│   ├── localhost-deployment.json
│   └── localhost-roles.json
├── hardhat.config.ts       # Hardhat configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## Environment Setup

### Install All Dependencies
```bash
npm install
```

This installs:
- **hardhat** - Smart contract development framework
- **ethers.js v6** - Ethereum interaction library
- **chai & mocha** - Testing framework
- **hardhat-toolbox** - Essential tools bundle
- **@openzeppelin/contracts** - Standard contract libraries
- **typechain** - Type-safe contract bindings
- **hardhat-gas-reporter** - Gas cost analysis
- **solidity-coverage** - Code coverage tool

### TypeScript Configuration
The project uses TypeScript for type-safe development. Key configurations:
```json
{
  "target": "ES2020",
  "module": "commonjs",
  "lib": ["ES2020"],
  "declaration": true,
  "outDir": "./dist"
}
```

---

## Hardhat Configuration

### Compiler Configuration
The project supports multiple Solidity versions:

```typescript
solidity: {
  compilers: [
    {
      version: "0.8.24",      // Latest (MedVerifyRegistry)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200             // Balance between size and gas
        }
      }
    },
    {
      version: "0.8.20",       // For compatibility
      settings: { /* ... */ }
    }
  ]
}
```

### Optimizer Settings
- **Enabled:** True for production optimization
- **Runs:** 200 (assumes contract called 200 times)
  - Higher runs = smaller runtime, larger deployment
  - Lower runs = larger runtime, smaller deployment

### Network Configuration
Configured for three networks:

| Network | URL | Chain ID | Use Case |
|---------|-----|----------|----------|
| hardhat | In-memory | 1337 | Fast testing |
| localhost | http://127.0.0.1:8545 | 1337 | Local node |
| ganache | http://127.0.0.1:7545 | 5777 | Ganache GUI |

---

## Available Networks

### 1. Hardhat (In-Memory)
**Best for:** Fast development and testing

```bash
# Automatically used by npm test
npm test
```

**Characteristics:**
- No persistent state
- Instant compilation and deployment
- Deterministic behavior
- Perfect for CI/CD

### 2. Localhost (Local Node)
**Best for:** Integration testing with persistent state

```bash
# Terminal 1: Start the node
npm run node

# Terminal 2: Deploy to localhost
npm run deploy:local

# Terminal 3: Initialize roles
npm run setup-roles
```

**Characteristics:**
- Persistent chain state
- Mimics real blockchain behavior
- Useful for debugging
- Can use with MetaMask

### 3. Ganache (Ganache CLI)
**Best for:** GUI blockchain explorer

```bash
# Install Ganache (first time only)
npm install -g ganache-cli

# Terminal 1: Start Ganache
ganache-cli

# Terminal 2: Deploy to Ganache
npm run deploy:ganache
```

**Characteristics:**
- Visual interface available
- Built-in block explorer
- Desktop app available
- Good for demos

---

## Common Commands

### Compilation & Build
```bash
npm run compile        # Compile all contracts
npm run clean          # Clean artifacts and cache
npm run flatten        # Flatten contract for verification
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Deployment
```bash
npm run deploy         # Deploy to hardhat (default)
npm run deploy:local   # Deploy to localhost
npm run deploy:ganache # Deploy to ganache
npm run setup-roles    # Initialize roles (requires deployment)
```

### Network Management
```bash
npm run node           # Start local Hardhat node
npm run accounts       # Display all accounts
```

### Development
```bash
npm run typechain      # Generate TypeChain types
npm run docs           # Generate documentation (if installed)
```

---

## Deployment Workflow

### Step 1: Compile Contracts
```bash
npm run compile
```

**Output:**
```
Compiling contracts...  
✓ Contracts compiled
```

### Step 2: Start Local Network (Optional)
For localhost testing, start a persistent node:
```bash
npm run node
```

### Step 3: Deploy Contract
```bash
npm run deploy:local        # Deploy to localhost
# or
npm run deploy              # Deploy to hardhat (ephemeral)
```

**Output includes:**
- Deployer address
- Contract address
- Deployment block
- Deployment transaction hash

### Step 4: Initialize Roles
```bash
npm run setup-roles
```

**Initializes:**
- Lab accounts (lab1, lab2)
- Verifier accounts (verifier1, verifier2)
- Pauser accounts

### Step 5: Verify Deployment
Deployment automatically verifies:
- Contract code is deployed at address
- All roles are correctly assigned
- Configuration is saved to `deployments/` folder

---

## Testing Strategy

### Test Execution
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

Generates `coverage/` directory with:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### Test Types Included

1. **Access Control Tests**
   - Admin can register labs
   - Only admins can register labs
   - Only labs can register records

2. **Core Functionality Tests**
   - Record registration
   - Record verification
   - Record revocation

3. **Security Tests**
   - Duplicate prevention
   - Role-based access
   - State transitions

4. **Event Tests**
   - Event emission verification
   - Event parameter validation

5. **Emergency Tests**
   - Pause/unpause functionality
   - Paused state enforcement

---

## Gas Optimization

### Gas Reporter
The project includes automatic gas reporting:

```bash
npm test
```

**Output file:** `gas-report.txt`

```
·────────────────────────────────────────┤
│ MedVerifyRegistry Contract             │
├────────────────────────────────────────┤
│ Methods                                │
├──────────┬─────────────────────────────┤
│ register │ 45,234 gas (avg)            │
│ verify   │ 2,856 gas (avg)             │
├──────────┴─────────────────────────────┤
```

### Optimization Tips
1. **Batch Operations:** Combine multiple calls
2. **State Caching:** Read state variables once
3. **Use uint256:** Cheapest data type
4. **Eliminate Dead Code:** Remove unused functions
5. **Use Events:** Cheaper than state storage for indexed data

### Current Optimizer Settings
- **Compiler Version:** 0.8.24
- **Optimization Enabled:** Yes
- **Runs:** 200 (balanced)

---

## Troubleshooting

### Issue: "Cannot find module 'hardhat'"
**Solution:**
```bash
npm install
```

### Issue: "Error: ENOENT: no such file or directory, open 'deployments/localhost-deployment.json'"
**Solution:**
Run deployment first:
```bash
npm run deploy:local
```

### Issue: "Error: No code at contract address"
**Possible causes:**
1. Network address mismatch
2. Contract not yet mined
3. Wrong network selected

**Solution:**
```bash
npm run compile
npm run deploy
```

### Issue: "Error: connection refused" on localhost
**Solution:**
```bash
# Terminal 1: Start the node
npm run node

# Wait for "Started HTTP and WebSocket JSON-RPC server"
# Then in Terminal 2:
npm run deploy:local
```

### Issue: "Insufficient balance" error
**For localhost:**
```bash
npm run node
# Hardhat automatically funds accounts
```

**For Ganache:**
```bash
# Ganache provides 10 ETH per account by default
```

### Issue: Tests failing with timeout
**Solution:**
```bash
# Increase timeout in test file or increase memory
setTimeOptions({ timeout: 20000 });
```

### Issue: TypeChain types not generating
**Solution:**
```bash
npm run compile
npm run typechain
```

---

## Performance Tips

### Faster Testing
```bash
# Run specific test file
npx hardhat test test/MedVerifyRegistry.ts

# Run tests matching pattern
npx hardhat test --grep "register"
```

### Faster Compilation
```bash
# Only compile changed files
npm run compile
# Hardhat caches unchanged contracts
```

### Monitor Network Performance
```bash
# See transaction details
npm run node
# Watch output for block times and gas usage
```

---

## Security Considerations

### For Development Only
⚠️ **Configuration uses test mnemonic:**
```
test test test test test test test test test test test junk
```

### Production Considerations
- Never use test mnemonic in production
- Use environment variables for real mnemonics
- Implement private key management
- Use hardware wallets for deployment
- Verify all contracts on blockchain explorer

---

## Next Steps for Student 3

1. ✅ Understand the infrastructure setup
2. ✅ Run `npm install` and verify all dependencies
3. ✅ Run `npm test` to verify contract functionality
4. ✅ Run `npm run deploy:local` and `npm run setup-roles`
5. ✅ Analyze gas reports in `gas-report.txt`
6. ✅ Document any network issues encountered
7. ⚠️ Prepare infrastructure documentation for presentation

---

## Additional Resources

### Official Documentation
- [Hardhat Docs](https://hardhat.org/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)

### Useful Tools
- [Remix IDE](https://remix.ethereum.org/) - Online contract editor
- [eth-gas-reporter](https://github.com/cgewecke/eth-gas-reporter) - Gas analysis
- [Solidity Coverage](https://github.com/sc-forks/solidity-coverage) - Coverage reports

---

## Support

For infrastructure-related issues, consult:
1. This guide (INFRASTRUCTURE.md)
2. DEPLOYMENT.md for deployment-specific issues
3. TESTING.md for testing issues
4. Hardhat documentation for framework issues

---

**Last Updated:** Semester 1 2026  
**Responsible:** Student 3 - Blockchain Infrastructure  
**Status:** Ready for Production Deployment
