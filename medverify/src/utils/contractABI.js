/**
 * contractABI.js
 * ─────────────────────────────────────────────────────────────────
 * ABI for MedVerify.sol — AccessControl + Pausable + Verification Rules.
 *
 * After compiling with Hardhat, replace this ABI with the output from:
 *   artifacts/contracts/MedVerify.sol/MedVerify.json → "abi" field
 *
 * Then paste your deployed address into CONTRACT_ADDRESS below.
 * ─────────────────────────────────────────────────────────────────
 */

export const CONTRACT_ABI = [

  /* ── Role constants ─────────────────────────────────────────── */
  { "type": "function", "name": "DEFAULT_ADMIN_ROLE",
    "stateMutability": "view", "inputs": [], "outputs": [{ "type": "bytes32" }] },
  { "type": "function", "name": "LAB_ROLE",
    "stateMutability": "view", "inputs": [], "outputs": [{ "type": "bytes32" }] },
  { "type": "function", "name": "VERIFIER_ROLE",
    "stateMutability": "view", "inputs": [], "outputs": [{ "type": "bytes32" }] },
  { "type": "function", "name": "PAUSER_ROLE",
    "stateMutability": "view", "inputs": [], "outputs": [{ "type": "bytes32" }] },

  /* ── AccessControl ───────────────────────────────────────────── */
  { "type": "function", "name": "hasRole",
    "stateMutability": "view",
    "inputs": [{ "name": "role", "type": "bytes32" }, { "name": "account", "type": "address" }],
    "outputs": [{ "type": "bool" }] },
  { "type": "function", "name": "grantRole",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "role", "type": "bytes32" }, { "name": "account", "type": "address" }],
    "outputs": [] },
  { "type": "function", "name": "revokeRole",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "role", "type": "bytes32" }, { "name": "account", "type": "address" }],
    "outputs": [] },

  /* ── Pausable ────────────────────────────────────────────────── */
  { "type": "function", "name": "pause",   "stateMutability": "nonpayable", "inputs": [], "outputs": [] },
  { "type": "function", "name": "unpause", "stateMutability": "nonpayable", "inputs": [], "outputs": [] },
  { "type": "function", "name": "paused",  "stateMutability": "view",       "inputs": [], "outputs": [{ "type": "bool" }] },

  /* ── Lab Registry ────────────────────────────────────────────── */
  { "type": "function", "name": "registerLab",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "lab", "type": "address" }], "outputs": [] },
  { "type": "function", "name": "removeLab",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "lab", "type": "address" }], "outputs": [] },
  { "type": "function", "name": "isRegisteredLab",
    "stateMutability": "view",
    "inputs": [{ "name": "lab", "type": "address" }],
    "outputs": [{ "type": "bool" }] },
  { "type": "function", "name": "getAllLabs",
    "stateMutability": "view", "inputs": [],
    "outputs": [{ "type": "address[]" }] },

  /* ── Record Registration ─────────────────────────────────────── */
  /* NOTE: now includes expiresAt (0 = no expiry)                   */
  { "type": "function", "name": "registerRecord",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "fileHash",      "type": "bytes32" },
      { "name": "metadataHash",  "type": "bytes32" },
      { "name": "patientIdHash", "type": "bytes32" },
      { "name": "recordType",    "type": "string"  },
      { "name": "expiresAt",     "type": "uint256" }
    ], "outputs": [] },

  /* ── Verification — Core Rules (PUBLIC) ─────────────────────── */
  /*   Returns VerificationResult struct.                            */
  /*   isValid = true only when rules 1+2+3 all pass.               */
  { "type": "function", "name": "verifyRecord",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "fileHash", "type": "bytes32" }],
    "outputs": [{
      "name": "result",
      "type": "tuple",
      "components": [
        { "name": "isValid",           "type": "bool"    },
        { "name": "failureCode",       "type": "uint8"   },
        { "name": "failureReason",     "type": "string"  },
        { "name": "registeredBy",      "type": "address" },
        { "name": "timestamp",         "type": "uint256" },
        { "name": "metadataHash",      "type": "bytes32" },
        { "name": "recordType",        "type": "string"  },
        { "name": "status",            "type": "uint8"   },
        { "name": "supersededBy",      "type": "bytes32" },
        { "name": "issuerStillActive", "type": "bool"    },
        { "name": "isExpired",         "type": "bool"    }
      ]
    }] },

  /* ── getRecord — read-only, no gas, no event ─────────────────── */
  { "type": "function", "name": "getRecord",
    "stateMutability": "view",
    "inputs": [{ "name": "fileHash", "type": "bytes32" }],
    "outputs": [{
      "name": "result",
      "type": "tuple",
      "components": [
        { "name": "isValid",           "type": "bool"    },
        { "name": "failureCode",       "type": "uint8"   },
        { "name": "failureReason",     "type": "string"  },
        { "name": "registeredBy",      "type": "address" },
        { "name": "timestamp",         "type": "uint256" },
        { "name": "metadataHash",      "type": "bytes32" },
        { "name": "recordType",        "type": "string"  },
        { "name": "status",            "type": "uint8"   },
        { "name": "supersededBy",      "type": "bytes32" },
        { "name": "issuerStillActive", "type": "bool"    },
        { "name": "isExpired",         "type": "bool"    }
      ]
    }] },

  /* ── fullVerify — Extended Rules (VERIFIER_ROLE only) ─────────── */
  /*   Rules 1+2+3 + issuer active + not expired + metadata matches  */
  { "type": "function", "name": "fullVerify",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "fileHash",             "type": "bytes32" },
      { "name": "expectedMetadataHash", "type": "bytes32" }
    ],
    "outputs": [{
      "name": "result",
      "type": "tuple",
      "components": [
        { "name": "isValid",           "type": "bool"    },
        { "name": "failureCode",       "type": "uint8"   },
        { "name": "failureReason",     "type": "string"  },
        { "name": "registeredBy",      "type": "address" },
        { "name": "timestamp",         "type": "uint256" },
        { "name": "metadataHash",      "type": "bytes32" },
        { "name": "recordType",        "type": "string"  },
        { "name": "status",            "type": "uint8"   },
        { "name": "supersededBy",      "type": "bytes32" },
        { "name": "issuerStillActive", "type": "bool"    },
        { "name": "isExpired",         "type": "bool"    }
      ]
    }] },

  /* ── Revoke & Supersede ──────────────────────────────────────── */
  { "type": "function", "name": "revokeRecord",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "fileHash", "type": "bytes32" },
      { "name": "reason",   "type": "string"  }
    ], "outputs": [] },

  { "type": "function", "name": "supersede",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "oldFileHash",     "type": "bytes32" },
      { "name": "newFileHash",     "type": "bytes32" },
      { "name": "newMetadataHash", "type": "bytes32" },
      { "name": "patientIdHash",   "type": "bytes32" },
      { "name": "recordType",      "type": "string"  },
      { "name": "expiresAt",       "type": "uint256" }
    ], "outputs": [] },

  /* ── Patient History ─────────────────────────────────────────── */
  { "type": "function", "name": "getPatientRecords",
    "stateMutability": "view",
    "inputs": [{ "name": "patientIdHash", "type": "bytes32" }],
    "outputs": [{ "type": "bytes32[]" }] },

  /* ── Events ──────────────────────────────────────────────────── */
  { "type": "event", "name": "LabRegistered",
    "inputs": [
      { "name": "labAddress", "type": "address", "indexed": true  },
      { "name": "grantedBy",  "type": "address", "indexed": true  },
      { "name": "timestamp",  "type": "uint256", "indexed": false }
    ] },
  { "type": "event", "name": "LabRemoved",
    "inputs": [
      { "name": "labAddress", "type": "address", "indexed": true  },
      { "name": "removedBy",  "type": "address", "indexed": true  },
      { "name": "timestamp",  "type": "uint256", "indexed": false }
    ] },
  { "type": "event", "name": "RecordRegistered",
    "inputs": [
      { "name": "fileHash",      "type": "bytes32", "indexed": true  },
      { "name": "metadataHash",  "type": "bytes32", "indexed": false },
      { "name": "registeredBy",  "type": "address", "indexed": true  },
      { "name": "patientIdHash", "type": "bytes32", "indexed": true  },
      { "name": "recordType",    "type": "string",  "indexed": false },
      { "name": "timestamp",     "type": "uint256", "indexed": false },
      { "name": "expiresAt",     "type": "uint256", "indexed": false }
    ] },
  { "type": "event", "name": "RecordVerified",
    "inputs": [
      { "name": "fileHash",    "type": "bytes32", "indexed": true  },
      { "name": "verifiedBy",  "type": "address", "indexed": true  },
      { "name": "isValid",     "type": "bool",    "indexed": false },
      { "name": "failureCode", "type": "uint8",   "indexed": false },
      { "name": "timestamp",   "type": "uint256", "indexed": false }
    ] },
  { "type": "event", "name": "RecordRevoked",
    "inputs": [
      { "name": "fileHash",  "type": "bytes32", "indexed": true  },
      { "name": "revokedBy", "type": "address", "indexed": true  },
      { "name": "reason",    "type": "string",  "indexed": false },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ] },
  { "type": "event", "name": "RecordSuperseded",
    "inputs": [
      { "name": "oldHash",   "type": "bytes32", "indexed": true  },
      { "name": "newHash",   "type": "bytes32", "indexed": true  },
      { "name": "updatedBy", "type": "address", "indexed": true  },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ] },
  { "type": "event", "name": "ContractPaused",
    "inputs": [
      { "name": "by",        "type": "address", "indexed": true  },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ] },
  { "type": "event", "name": "ContractUnpaused",
    "inputs": [
      { "name": "by",        "type": "address", "indexed": true  },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ] }
];

/* ── Paste your deployed contract address here ──────────────── */
export const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";

/* ── Network config ─────────────────────────────────────────── */
export const NETWORK_CONFIG = {
  chainId:    "0xaa36a7",           // Sepolia Testnet
  chainName:  "Sepolia Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls:    ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

/* ── Failure code reference ─────────────────────────────────── *
 * Use these in your UI to show the right error message.         *
 *   0  = Valid                                                  *
 *   1  = Record does not exist                                  *
 *   2  = Record has been revoked                                *
 *   3  = Record has been superseded                             *
 *   4  = Issuer lab no longer approved  (fullVerify only)       *
 *   5  = Record has expired             (fullVerify only)       *
 *   6  = Metadata hash mismatch         (fullVerify only)       *
 * ─────────────────────────────────────────────────────────────*/
export const FAILURE_MESSAGES = {
  0: "Valid — all checks passed",
  1: "Record does not exist on this blockchain",
  2: "Record has been revoked by the issuing lab or admin",
  3: "Record has been superseded — a newer version exists",
  4: "Issuing lab is no longer an approved provider",
  5: "Record has expired",
  6: "Metadata hash does not match — document may have been altered",
};
