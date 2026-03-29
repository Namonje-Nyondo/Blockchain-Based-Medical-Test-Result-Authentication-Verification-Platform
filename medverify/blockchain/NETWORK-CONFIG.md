# MedVerify Blockchain Network Configuration

**Student 3 Responsibility: Infrastructure Network Setup**

## Quick Network Reference

| Network | URL | Chain ID | State | Gas Price | Use Case | Start Time |
|---------|-----|----------|-------|-----------|----------|-----------|
| **hardhat** | In-Memory | 1337 | Ephemeral | 0 gwei | ⚡ Fast testing | Instant |
| **localhost** | 127.0.0.1:8545 | 1337 | Persistent | 0 gwei | 🧪 Integration | `npm run node` |
| **ganache-cli** | 127.0.0.1:7545 | 5777 | Persistent | 2 gwei | 🖇️ Visual debug | `ganache-cli` |

---

## 1. Hardhat Network (In-Memory)

### What is It?
- Built into Hardhat
- Exists entirely in RAM
- Resets after process ends
- No network startup needed

### Configuration
```typescript
networks: {
  hardhat: {
    chainId: 1337,
    mining: {
      auto: true,      // Auto-mine blocks immediately
      interval: 0      // No delay between blocks
    },
    accounts: {
      mnemonic: "test test test test test test test test test test test junk",
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20        // 20 test accounts
    }
  }
}
```

### Account Generation
Every test instance gets 20 accounts:
```
Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account 1: 0x70997970C51812e339D9B73b0245ad59e7DF1d3e
Account 2: 0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297
... (17 more)

Balance: 10,000 ETH per account
Mnemonic: test test test test test test test test test test test junk
Derivation Path: m/44'/60'/0'/0
```

### Usage
```bash
# Default network for tests
npm test

# Explicit network selection
npx hardhat compile --network hardhat
npx hardhat run scripts/deploy.ts --network hardhat
```

### Characteristics
| Feature | Value |
|---------|-------|
| Startup Time | Instant |
| Block Time | Immediate |
| Persistence | No |
| Cost | Free |
| Reset | Automatic |
| State Leak | No |
| Best For | Unit tests, CI/CD |

### Advantages
✅ Fastest test execution  
✅ No external dependencies  
✅ Deterministic  
✅ Perfect for automated testing  
✅ No cleanup needed  

### Limitations
❌ No persistent state  
❌ Not suitable for integration testing  
❌ No GUI or explorer  
❌ Memory-limited  

---

## 2. Localhost Network (Persistent)

### What is It?
- Local Hardhat node on HTTP RPC
- Persistent blockchain state
- Realistic blockchain behavior
- Suitable for frontend integration

### Configuration
```typescript
networks: {
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 1337,
    accounts: {
      mnemonic: "test test test test test test test test test test test junk",
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20
    }
  }
}
```

### Node Management

#### Start Node
```bash
npm run node
# Output:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# Accounts (20 available), use them with the '--account' flag:
# Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH) ...
```

#### Stop Node
```bash
# Press Ctrl+C in the terminal running npm run node
```

#### Verify Node is Running
```bash
# From another terminal
curl http://127.0.0.1:8545 \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Expected response:
# {"jsonrpc":"2.0","result":"0x1a","id":1}
```

### Account Import to MetaMask

#### 1. Open MetaMask
- Click account icon → "Import Account"

#### 2. Paste Private Key
```
For Account #0: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded732d6d1c72b27a9d021
For Account #1: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
... (18 more)
```

#### 3. Set Custom RPC
- Network settings → Custom RPC
- URL: http://localhost:8545
- Chain ID: 1337

### Usage Examples

#### Deploy to Localhost
```bash
# Terminal 1: Start node
npm run node

# Terminal 2: Deploy
npm run deploy:local

# Terminal 3: Setup roles
npm run setup-roles
```

#### Interact via Console
```bash
npx hardhat console --network localhost

# In console:
> const registry = await ethers.getContractAt(
    "MedVerifyRegistry",
    "0x8a791620dd6260079bf849dc5567adc3f2fdc318"
  );

> const lab = (await ethers.getSigners())[1];
> await registry.connect(lab).registerRecord(
    "REC-001",
    ethers.keccak256(ethers.toUtf8Bytes("PATIENT")),
    ethers.keccak256(ethers.toUtf8Bytes("DOC")),
    ethers.keccak256(ethers.toUtf8Bytes("META"))
  );
```

#### Test Frontend Integration
```javascript
// src/utils/web3Provider.js
const CONTRACT_ADDRESS = "0x8a791620dd6260079bf849dc5567adc3f2fdc318";
const RPC_URL = "http://127.0.0.1:8545";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
```

### Characteristics
| Feature | Value |
|---------|-------|
| Startup Time | ~2 seconds |
| Block Time | Configurable (default: 2s) |
| Persistence | ✅ Yes |
| Cost | Free |
| Reset | Manual (stop/start) |
| State Leak | No |
| Best For | Integration testing, frontend dev |

### Account Detail
```
Mnemonic: test test test test test test test test test test test junk
Base Path: m/44'/60'/0'/0
Derivation: Each account increments path index

Examples:
Account 0: m/44'/60'/0'/0 → 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account 1: m/44'/60'/0'/1 → 0x70997970C51812e339D9B73b0245ad59e7DF1d3e
Account 2: m/44'/60'/0'/2 → 0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297
...
```

### Common Operations

#### Check Block Number
```bash
npx hardhat console --network localhost
> eth = await ethers.provider.getBlockNumber()
> console.log(eth)  // Current block
```

#### Get Account Balance
```bash
npx hardhat console --network localhost
> balance = await ethers.provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
> ethers.formatEther(balance)  // Convert to ETH
```

#### Send Transaction
```bash
npx hardhat console --network localhost
> [account1, account2] = await ethers.getSigners();
> tx = await account1.sendTransaction({
    to: account2.address,
    value: ethers.parseEther("1")
  });
> await tx.wait();
```

### Advantages
✅ Persistent chain state  
✅ Realistic blockchain simulation  
✅ Multi-step testing  
✅ Frontend integration ready  
✅ MetaMask compatible  
✅ No gas costs (test network)  

### Limitations
❌ Slower than Hardhat network  
❌ Requires separate process  
❌ No built-in explorer  
❌ External HTTP dependency  

---

## 3. Ganache Network

### What is It?
- Standalone local Ethereum network
- Available as CLI or Desktop app
- Rich debugging capabilities
- Visual block explorer

### Installation

#### Ganache CLI (Command Line)
```bash
npm install -g ganache-cli
ganache-cli --version  # Verify installation
```

#### Ganache Desktop App
1. Download from https://www.trufflesuite.com/ganache
2. Create new workspace
3. Configure to port 7545

### Configuration
```typescript
networks: {
  ganache: {
    url: "http://127.0.0.1:7545",
    chainId: 5777,
    accounts: {
      mnemonic: "test test test test test test test test test test test junk",
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 10
    }
  }
}
```

### Usage

#### Start Ganache CLI
```bash
ganache-cli

# Output:
# ganache-cli v7.9.0 (ganache-core: 7.9.0)
# Available Accounts
# ==================
# (0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# ... (9 more accounts)
# HD Wallet
# =========
# Mnemonic: test test test test test test test test test test test junk
# listening on 127.0.0.1:7545
```

#### Deploy to Ganache
```bash
npm run deploy:ganache
```

#### View in Block Explorer (Desktop)
- Open Ganache desktop app
- Switch to workspace port 7545
- View transactions and accounts

### Available Accounts
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account #1: 0x70997970...
Account #2: 0x3C44CdDd...
... (7 more)

All accounts have 100 ETH (configurable)
Mnemonic: test test test...
```

### Custom Ganache Configuration
```bash
ganache-cli \
  --host 127.0.0.1 \
  --port 7545 \
  --chainId 5777 \
  --accounts 10 \
  --mnemonic "test test test test test test test test test test test junk" \
  --blockTime 1
```

### Characteristics
| Feature | Value |
|---------|-------|
| Startup Time | 1-2 seconds |
| Block Time | Configurable |
| Persistence | ✅ Yes (if saved) |
| Cost | Free |
| Reset | Stop/start |
| State Leak | No |
| Visual Tools | ✅ Yes (App) |
| Best For | Demos, debugging |

### Advantages
✅ Visual interface (desktop app)  
✅ Built-in block explorer  
✅ Transaction history  
✅ Account state visibility  
✅ Good for demonstrations  

### Limitations
❌ Desktop app less tested  
❌ No advanced filtering  
❌ Heavier resource usage  
❌ Workspace configuration needed  

---

## Configuration Comparison

### Feature Matrix

```
┌───────────────────┬──────────┬───────────┬──────────┐
│ Feature           │ Hardhat  │ Localhost │ Ganache  │
├───────────────────┼──────────┼───────────┼──────────┤
│ Startup           │ Instant  │ 2s        │ 1-2s     │
│ Persistence       │ No       │ Yes       │ Yes      │
│ State Isolation   │ Perfect  │ Good      │ Good     │
│ Test Speed        │ Fastest  │ Moderate  │ Moderate │
│ Gas Cost          │ 0 gwei   │ 0 gwei    │ 2 gwei   │
│ Block Explorer    │ No       │ No        │ Yes      │
│ MetaMask Support  │ No       │ Yes       │ Yes      │
│ GUI Interface     │ No       │ No        │ Yes      │
│ Best For          │ Unit     │ Integration│ Demo   │
└───────────────────┴──────────┴───────────┴──────────┘
```

---

## Network Selection Guide

### Choose Hardhat When:
- 🏃 Running unit tests
- 🔄 CI/CD pipeline testing
- ⚡ Need fastest execution
- 🧹 Clean tests (no state carry-over)
- 📝 Test isolation is critical

```bash
npm test
```

### Choose Localhost When:
- 🧪 Integration testing
- 🌐 Frontend development
- 💼 Testing multi-step flows
- 🔗 MetaMask integration
- 🐛 Persistent debugging

```bash
npm run node          # Terminal 1
npm run deploy:local  # Terminal 2
npm run setup-roles   # Terminal 3
```

### Choose Ganache When:
- 👁️ Visualizing blockchain
- 📊 Analyzing transactions
- 🎤 Demonstrating features
- 🐛 Advanced debugging
- 📱 GUI preferences

```bash
ganache-cli
npm run deploy:ganache
```

---

## Multi-Network Workflow

### Typical Development Workflow

```
1. Development
   └─ Use Hardhat (npm test)
      Written once, run instantly
      
2. Integration Testing
   └─ Use Localhost (npm run deploy:local)
      Test contract with frontend
      
3. Demo/Presentation
   └─ Use Ganache (npm run deploy:ganache)
      Show visual interface
```

### Connection Strings

#### In Frontend Code
```javascript
// src/config.js

const NETWORKS = {
  hardhat: "http://127.0.0.1:8545",
  localhost: "http://127.0.0.1:8545",
  ganache: "http://127.0.0.1:7545"
};

const CONTRACT_ADDRESS = {
  hardhat: "0x5fbdb2315678afccb333f8a9c6122f65d8fb9b59",
  localhost: "0x8a791620dd6260079bf849dc5567adc3f2fdc318",
  ganache: "0xabcd..." // After deployment
};

// Usage
const currentNetwork = process.env.NETWORK || "localhost";
export const RPC_URL = NETWORKS[currentNetwork];
export const REGISTRY_ADDRESS = CONTRACT_ADDRESS[currentNetwork];
```

---

## Switching Networks

### Command Line
```bash
# Deploy to different network
npx hardhat run scripts/deploy.ts --network localhost
npx hardhat run scripts/deploy.ts --network ganache
npx hardhat test --network hardhat

# Check which network is being used
npx hardhat config
```

### Environment Variables
```bash
# Create .env file
NETWORK=localhost

# .env
HARDHAT_NETWORK=localhost
```

### Code-Based Selection
```typescript
// hardhat.config.ts
const DEFAULT_NETWORK = process.env.NETWORK || "hardhat";

const config: HardhatUserConfig = {
  defaultNetwork: DEFAULT_NETWORK,
  networks: {
    // ... network configs
  }
};
```

---

## Network Troubleshooting

### Localhost Connection Refused
```bash
# Verify node is running
curl http://127.0.0.1:8545

# If fails, start node
npm run node
```

### Ganache Port Already in Use
```bash
# Find process using port 7545
lsof -i :7545  # macOS/Linux
netstat -ano | findstr :7545  # Windows

# Kill process or use different port
ganache-cli --port 7546
```

### Account Nonce Mismatch
```bash
# Reset localhost state
npm run node  # Stop with Ctrl+C
npm run node  # Restart fresh
npm run deploy:local
```

### MetaMask Chain ID Mismatch
```
Expected: 1337
Actual: 5777

Solution: Update RPC configuration in MetaMask
```

---

## Performance Tuning

### Optimize Hardhat Tests
```typescript
// Disable gas reporting for faster tests
const config: HardhatUserConfig = {
  gasReporter: {
    enabled: false  // Disable during rapid development
  }
};
```

### Optimize Localhost Block Time
```bash
# Increase block time for stability
npm run node -- --blockTime 2
```

### Monitor Network Performance
```bash
# Check RPC call timing
npx hardhat console --network localhost
> await ethers.provider.getBlock("latest")
> // Measure request time
```

---

## Network-Specific ABI Handling

### Store Contract Addresses by Network
```json
{
  "contracts": {
    "MedVerifyRegistry": {
      "hardhat": "0x5fbdb2315678afccb333f8a9c6122f65d8fb9b59",
      "localhost": "0x8a791620dd6260079bf849dc5567adc3f2fdc318",
      "ganache": "0xabcd1234..."
    }
  }
}
```

### Load Correct Contract Instance
```typescript
async function getRegistry(network: string) {
  const address = ADDRESSES[network]?.MedVerifyRegistry;
  if (!address) throw new Error(`No address for ${network}`);
  
  return ethers.getContractAt("MedVerifyRegistry", address);
}
```

---

## Next Steps

1. ✅ Understand each network's purpose
2. ✅ Run tests on Hardhat (`npm test`)
3. ✅ Deploy to Localhost (`npm run deploy:local`)
4. ✅ Try Ganache for visualization
5. ✅ Update frontend with correct RPC URL
6. ✅ Document network configuration used

---

**Last Updated:** Semester 1 2026  
**Responsible:** Student 3 - Network Infrastructure  
**Status:** All Networks Configured and Tested
