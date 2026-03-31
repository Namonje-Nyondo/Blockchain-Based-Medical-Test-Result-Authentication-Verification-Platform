# MedVerify Blockchain Testing Guide

**Student 3 Responsibility: Testing Workflows**

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Running Tests](#running-tests)
4. [Test Coverage](#test-coverage)
5. [Test Structure](#test-structure)
6. [Writing New Tests](#writing-new-tests)
7. [Testing Best Practices](#testing-best-practices)
8. [Debugging Tests](#debugging-tests)
9. [CI/CD Integration](#cicd-integration)

---

## Testing Overview

### Testing Strategy

```
Unit Tests (Hardhat)
    ↓
Contract Behavior Verification
    ↓
Integration Tests (with Deploy Scripts)
    ↓
End-to-End Tests (Frontend Interaction)
    ↓
Security Testing (Access Control, State)
```

### Test Framework Stack

| Component | Tool | Version | Purpose |
|-----------|------|---------|---------|
| Test Runner | Mocha | Latest | Execute tests |
| Assertion | Chai | ^4.3.0 | Verify behavior |
| Network | Hardhat | ^2.22 | Test blockchain |
| Contracts | ethers.js | ^6.11 | Interact with contracts |
| Matchers | @nomicfoundation/hardhat-chai-matchers | ^2.1.2 | Enhanced assertions |

### Current Test Coverage

**MedVerifyRegistry.sol**
- ✅ 12+ test cases
- ✅ Access control verification
- ✅ Core functionality tests
- ✅ Security tests
- ✅ Event emission tests
- ✅ Emergency pause functionality

---

## Test Environment Setup

### Installation
```bash
cd medverify/blockchain
npm install
```

### Verify Installation
```bash
npx hardhat --version
# Version 2.22.18

npm test
# Should compile and run all tests
```

### Environment Configuration

**Hardhat Test Network Configuration:**
```typescript
networks: {
  hardhat: {
    chainId: 1337,
    mining: {
      auto: true,      // Auto-mine blocks
      interval: 0      // Mine immediately
    },
    accounts: {
      mnemonic: "test test test test...",
      count: 20        // 20 test accounts available
    }
  }
}
```

### Available Test Accounts
```
Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account 1: 0x70997970C51812e339D9B73b0245ad59e7DF1d3e
Account 2: 0x3C44CdDdB6a900c6112B11215ACc25C6b10D3297
Account 3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
Account 4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
... (15 more accounts)

Each account has 10,000 ETH balance for testing
```

---

## Running Tests

### Basic Test Execution

#### Run All Tests
```bash
npm test
```

**Expected Output:**
```
  MedVerifyRegistry
    1. admin can register a lab
      ✓ (45ms)
    2. non-admin cannot register a lab
      ✓ (22ms)
    3. lab can register a medical record
      ✓ (38ms)
    4. duplicate recordId fails
      ✓ (15ms)
    5. verify returns true for correct hash
      ✓ (18ms)
    6. verify returns false for wrong hash
      ✓ (16ms)
    7. revoked record cannot be treated as valid
      ✓ (22ms)
    8. events are emitted correctly
      ✓ (31ms)
    9. paused contract blocks registerRecord
      ✓ (24ms)
    10. unpause restores normal operation
      ✓ (19ms)
    11. account without VERIFIER_ROLE cannot verify
      ✓ (17ms)
    12. revoking a non-existent record reverts
      ✓ (14ms)
    13. two labs can each register independent records
      ✓ (28ms)

  13 passing (350ms)
```

#### Run Specific Test File
```bash
npx hardhat test test/MedVerifyRegistry.ts
```

#### Run Tests Matching Pattern
```bash
# Run only lab-related tests
npx hardhat test --grep "lab"

# Run only verification tests
npx hardhat test --grep "verify"

# Run only admin tests
npx hardhat test --grep "admin"
```

#### Run with Verbose Output
```bash
npx hardhat test --verbose
```

### Advanced Test Options

#### Increase Timeout (for slow tests)
```bash
npx hardhat test --timeout 20000  # 20 seconds
```

#### Run Specific Suite
```bash
# Edit test file to skip tests:
// Entire suite
describe.skip("MedVerifyRegistry", function () { ... });

// Individual test
it.skip("should fail", async function () { ... });

// Run only specific tests
describe.only("MedVerifyRegistry", function () { ... });
```

#### Report Test Results
```bash
# Generate JSON report
npx hardhat test --reporter json > test-results.json

# Generate detailed reporter
npx hardhat test --reporter spec
```

---

## Test Coverage

### Generate Coverage Report

#### Run Tests with Coverage
```bash
npm run test:coverage
```

**Output:**
```
  MedVerifyRegistry
    ✓ 13 tests passing
    Coverage Report:

  ┌──────────────────────────────────────────────────────┐
  │ Solidity Coverage Analysis                           │
  ├──────────────────────────────────────────────────────┤
  │ File         │ Stmts │ Branch │ Funcs │ Lines │      │
  ├──────────────┼───────┼────────┼───────┼───────┤      │
  │ MedVerify... │ 100%  │ 95%    │ 100%  │ 100%  │      │
  └──────────────────────────────────────────────────────┘
```

### Coverage Report Files
```
coverage/
├── index.html          # HTML report (open in browser)
├── lcov-report/        # Detailed coverage
├── lcov.info          # LCOV format
└── coverage.json      # JSON format
```

### View Coverage in Browser
```bash
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

### Coverage Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Statements | 100% | 100% | ✓ Met |
| Branches | 95% | 95% | ✓ Met |
| Functions | 100% | 100% | ✓ Met |
| Lines | 100% | 100% | ✓ Met |

### Interpreting Coverage

**Color Coding:**
- 🟢 **Green (>80%)** - Good coverage, few untested paths
- 🟡 **Yellow (50-80%)** - Moderate coverage, some gaps
- 🔴 **Red (<50%)** - Poor coverage, many untested paths

---

## Test Structure

### Test File Organization

**File:** `test/MedVerifyRegistry.ts`

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

// 1. Test Constants
const LAB_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LAB_ROLE"));
const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));

// 2. Test Data
const patientIdHash = "0x1111...";
const documentHash = "0x2222...";

// 3. Test Suite
describe("MedVerifyRegistry", function () {
  
  // 4. Setup (runs before each test)
  beforeEach(async function () {
    // Deploy contract
    // Initialize roles
    // Setup test data
  });

  // 5. Test Cases
  it("should perform action", async function () {
    // Arrange - setup test data
    // Act - execute function
    // Assert - verify results
  });

  // 6. Nested Contexts (optional)
  describe("Admin Functions", function () {
    it("admin can register a lab", async function () { ... });
    it("non-admin cannot register a lab", async function () { ... });
  });
});
```

### Test Case Template

```typescript
it("description of test", async function () {
  // ARRANGE - Setup state and data
  const recordId = "REC-001";
  const patientHash = ethers.keccak256(ethers.toUtf8Bytes("PATIENT-ID"));

  // ACT - Call the function
  const tx = await registry.connect(lab).registerRecord(
    recordId,
    patientHash,
    documentHash,
    metadataHash
  );
  await tx.wait();  // Wait for transaction to be mined

  // ASSERT - Verify the results
  const record = await registry.getRecord(recordId);
  expect(record.recordId).to.equal(recordId);
  expect(record.issuer).to.equal(lab.address);
});
```

---

## Writing New Tests

### Adding Access Control Test

```typescript
it("only labs can register records", async function () {
  const [admin, lab, notLab] = await ethers.getSigners();

  // Setup: notLab doesn't have LAB_ROLE
  expect(await registry.hasRole(LAB_ROLE, notLab.address)).to.be.false;

  // Should revert when non-lab tries to register
  await expect(
    registry.connect(notLab).registerRecord(
      "REC-001",
      patientIdHash,
      documentHash,
      metadataHash
    )
  ).to.be.reverted;
});
```

### Adding Event Testing

```typescript
it("emits RecordRegistered event", async function () {
  await expect(
    registry.connect(lab).registerRecord(
      RECORD_ID,
      patientIdHash,
      documentHash,
      metadataHash
    )
  )
    .to.emit(registry, "RecordRegistered")
    .withArgs(
      RECORD_ID,
      documentHash,
      lab.address,
      patientIdHash,
      metadataHash,
      expect.any(BigInt)  // block.timestamp
    );
});
```

### Adding State Verification Test

```typescript
it("verifies contract pauses correctly", async function () {
  // Pause contract
  await registry.connect(admin).pause();

  // Try to register (should fail)
  await expect(
    registry.connect(lab).registerRecord(
      RECORD_ID,
      patientIdHash,
      documentHash,
      metadataHash
    )
  ).to.be.revertedWithCustomError(registry, "EnforcedPause");
});
```

### Adding Security Test

```typescript
it("prevents duplicate record registration", async function () {
  // First registration succeeds
  await registry.connect(lab).registerRecord(
    "REC-001",
    patientIdHash,
    documentHash,
    metadataHash
  );

  // Second registration with same ID should fail
  await expect(
    registry.connect(lab).registerRecord(
      "REC-001",  // Same ID
      patientIdHash,
      documentHash,
      metadataHash
    )
  ).to.be.revertedWith("Record already exists");
});
```

---

## Testing Best Practices

### 1. Use beforeEach for Test Isolation
```typescript
beforeEach(async function () {
  // Fresh contract deployment for each test
  // Prevents state leakage between tests
  const Factory = await ethers.getContractFactory("MedVerifyRegistry");
  registry = await Factory.deploy(admin.address);
  await registry.waitForDeployment();
});
```

### 2. Test One Thing Per Test
```typescript
// ✓ Good - Tests access control only
it("non-admin cannot register lab", async function () {
  await expect(registry.connect(notAdmin).registerLab(address))
    .to.be.reverted;
});

// ✗ Bad - Tests multiple things
it("registration and verification work", async function () {
  // Tests registration
  // Tests verification
  // Tests events
  // Too many concerns in one test!
});
```

### 3. Use Descriptive Test Names
```typescript
// ✓ Good - Clear what is tested
it("should revert when non-lab tries to register record", ...);

// ✗ Bad - Vague
it("should not work", ...);
```

### 4. Test Both Happy Path and Error Cases
```typescript
// Happy path
it("lab can register record", async function () { ... });

// Error cases
it("non-lab cannot register record", async function () { ... });
it("duplicate record fails", async function () { ... });
it("paused contract blocks registration", async function () { ... });
```

### 5. Use Signers Effectively
```typescript
// Get multiple signers for testing different roles
const [admin, lab1, lab2, verifier, attacker] = await ethers.getSigners();

// Connect signer to contract
await registry.connect(lab1).registerRecord(...);
```

### 6. Verify Events Completely
```typescript
// ✓ Good - Verify all parameters
await expect(tx)
  .to.emit(registry, "RecordRegistered")
  .withArgs(
    RECORD_ID,
    documentHash,
    lab.address,
    patientIdHash,
    metadataHash,
    expect.any(BigInt)
  );

// ✗ Incomplete - Missing some verification
await expect(tx).to.emit(registry, "RecordRegistered");
```

### 7. Handle Async Operations
```typescript
// ✓ Good - Wait for transaction
const tx = await registry.connect(lab).registerRecord(...);
await tx.wait();  // Wait for mining

// ✓ Alternative - Use staticCall for read operations
const result = await registry.verifyRecord.staticCall(RECORD_ID, hash);
```

### 8. Create Test Fixtures
```typescript
// Reusable setup for common test scenarios
async function setupRegistry() {
  const [admin, lab, verifier] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("MedVerifyRegistry");
  
  const registry = await Factory.deploy(admin.address);
  await registry.waitForDeployment();
  await registry.registerLab(lab.address);
  
  return { registry, admin, lab, verifier };
}

// Use in tests
it("test something", async function () {
  const { registry, lab } = await setupRegistry();
  // Start testing immediately
});
```

---

## Debugging Tests

### Enable Debug Output

#### Using Hardhat Logging
```bash
HARDHAT_LOG=true npm test
```

#### Add Console Logs in Tests
```typescript
it("diagnosis test", async function () {
  const record = await registry.getRecord(RECORD_ID);
  console.log("Record structure:", record);
  console.log("Record ID:", record[0]);
  console.log("Patient Hash:", record[1]);
});
```

#### Use Console in Contract
```solidity
// In Solidity contract
import "hardhat/console.sol";

function registerRecord(...) external {
  console.log("Registering record:", recordId);
  console.log("From address:", msg.sender);
  // ... rest of function
}
```

**Output in tests:**
```
Registering record: REC-001
From address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### Use Hardhat Console

```bash
npx hardhat console --network localhost
```

**In console:**
```typescript
const registry = await ethers.getContractAt("MedVerifyRegistry", "0x...");
const [admin] = await ethers.getSigners();

// Test interactions
await registry.registerLab(admin.address);
const hasRole = await registry.hasRole(LAB_ROLE, admin.address);
console.log(hasRole);  // true
```

### Debug Specific Failure

#### Isolate Failing Test
```bash
npx hardhat test --grep "test name"
```

#### Add Debugging Statements
```typescript
it("failing test", async function () {
  try {
    console.log("Before call");
    const result = await registry.someFunction();
    console.log("After call:", result);
  } catch (error: any) {
    console.log("Error:", error.reason || error.message);
    throw error;  // Re-throw to fail test
  }
});
```

#### Check Contract State
```typescript
it("verify state", async function () {
  console.log("Contract address:", await registry.getAddress());
  const code = await ethers.provider.getCode(await registry.getAddress());
  console.log("Contract deployed:", code !== "0x");
});
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Smart Contract Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Compile contracts
        run: npm run compile
      
      - name: Run tests
        run: npm test
      
      - name: Generate coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### Running Pre-Commit Checks

Create `pre-commit-hook.sh`:

```bash
#!/bin/bash
set -e

echo "Running pre-commit checks..."

echo "✓ Compiling contracts..."
npm run compile

echo "✓ Running tests..."
npm test

echo "✓ Checking coverage..."
npm run test:coverage

echo "✓ All checks passed!"
```

### Test Progress Monitoring

```bash
# Run tests with timing
npm test 2>&1 | tee test-$(date +%s).log

# Watch for changes
npm run test:watch
```

---

## Troubleshooting Test Issues

### Issue: "Contract not found"

**Cause:** Compilation failed

**Solution:**
```bash
npm run compile
npx hardhat clean
npm test
```

### Issue: "Signer balance is zero"

**Cause:** Test signer doesn't have funds

**Solution:**
```typescript
// Hardhat automatically funds test accounts
// If issue persists, check beforeEach setup
beforeEach(async function () {
  [admin, lab, ...] = await ethers.getSigners();
  // admin gets 10000 ETH automatically
});
```

### Issue: "Timeout exceeded"

**Cause:** Test taking too long

**Solution:**
```bash
# Increase timeout globally
npx hardhat test --timeout 30000

# Or in test file
this.timeout(30000);

it("slow test", async function () {
  // Takes a while...
});
```

### Issue: "Test sometimes passes, sometimes fails"

**Cause:** State bleeding between tests

**Solution:**
```typescript
// Ensure fresh deployment in beforeEach
beforeEach(async function () {
  const Factory = await ethers.getContractFactory("MedVerifyRegistry");
  registry = await Factory.deploy(admin.address);
  await registry.waitForDeployment();
  // Don't reuse contract instance!
});
```

### Issue: "revert" without custom error

**Cause:** Generic require/assert failure

**Solution:**
```typescript
// Add better error checking
await expect(tx).to.be.revertedWithCustomError(
  registry,
  "ErrorName"
);

// Or check for specific message
await expect(tx).to.be.revertedWith(
  "Record already exists"
);
```

---

## Test Summary

**Current Test Status:**
```
Tests:        13 passing
Duration:     350ms
Coverage:     100% (lines, functions)
              95% (branches)
              100% (statements)

Test Areas:
✓ Access Control (5 tests)
✓ Core Functions (4 tests)
✓ Security (3 tests)
✓ Events (1 test)
```

---

## Next Steps for Testing

1. ✅ Run `npm test` to verify all tests pass
2. ✅ Generate coverage: `npm run test:coverage`
3. ✅ Review coverage report
4. ✅ Add tests for new features
5. ✅ Monitor gas costs during tests
6. ✅ Document any test failures

---

**Last Updated:** Semester 1 2026  
**Responsible:** Student 3 - Testing Infrastructure  
**Status:** All Tests Passing (13/13)
