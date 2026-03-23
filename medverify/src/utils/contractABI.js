/**
 * contractABI.js
 * ─────────────────────────────────────────────────────────────────
 * Replace CONTRACT_ADDRESS with your deployed contract address.
 * The ABI below matches contracts/MedVerify.sol exactly.
 */

export const CONTRACT_ABI = [
    /* ── State variables ─── */
    { "type": "function", "name": "owner", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "address" }] },

    /* ── Lab Registry ─── */
    { "type": "function", "name": "registerLab", "stateMutability": "nonpayable", "inputs": [{ "name": "lab", "type": "address" }], "outputs": [] },
    { "type": "function", "name": "removeLab", "stateMutability": "nonpayable", "inputs": [{ "name": "lab", "type": "address" }], "outputs": [] },
    { "type": "function", "name": "isRegisteredLab", "stateMutability": "view", "inputs": [{ "name": "lab", "type": "address" }], "outputs": [{ "type": "bool" }] },
    { "type": "function", "name": "getAllLabs", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "address[]" }] },
    { "type": "function", "name": "registeredLabs", "stateMutability": "view", "inputs": [{ "type": "address" }], "outputs": [{ "type": "bool" }] },

    /* ── Lab Upload ─── */
    {
        "type": "function",
        "name": "registerRecord",
        "stateMutability": "nonpayable",
        "inputs": [
            { "name": "fileHash", "type": "bytes32" },
            { "name": "metadataHash", "type": "bytes32" },
            { "name": "patientId", "type": "string" },
            { "name": "recordType", "type": "string" }
        ],
        "outputs": []
    },

    /* ── Verification ─── */
    {
        "type": "function",
        "name": "verifyRecord",
        "stateMutability": "nonpayable",
        "inputs": [{ "name": "fileHash", "type": "bytes32" }],
        "outputs": [
            { "name": "isValid", "type": "bool" },
            { "name": "registeredBy", "type": "address" },
            { "name": "timestamp", "type": "uint256" },
            { "name": "metadataHash", "type": "bytes32" },
            { "name": "recordType", "type": "string" },
            { "name": "status", "type": "uint8" }
        ]
    },
    {
        "type": "function",
        "name": "getRecord",
        "stateMutability": "view",
        "inputs": [{ "name": "fileHash", "type": "bytes32" }],
        "outputs": [
            { "name": "exists", "type": "bool" },
            { "name": "registeredBy", "type": "address" },
            { "name": "timestamp", "type": "uint256" },
            { "name": "metadataHash", "type": "bytes32" },
            { "name": "recordType", "type": "string" },
            { "name": "status", "type": "uint8" }
        ]
    },

    /* ── Patient Records ─── */
    {
        "type": "function",
        "name": "getPatientRecords",
        "stateMutability": "view",
        "inputs": [{ "name": "patientId", "type": "string" }],
        "outputs": [{ "type": "bytes32[]" }]
    },

    /* ── Revoke & Supersede ─── */
    {
        "type": "function",
        "name": "revokeRecord",
        "stateMutability": "nonpayable",
        "inputs": [{ "name": "fileHash", "type": "bytes32" }, { "name": "reason", "type": "string" }],
        "outputs": []
    },
    {
        "type": "function",
        "name": "supersede",
        "stateMutability": "nonpayable",
        "inputs": [
            { "name": "oldFileHash", "type": "bytes32" },
            { "name": "newFileHash", "type": "bytes32" },
            { "name": "newMetadataHash", "type": "bytes32" },
            { "name": "patientId", "type": "string" },
            { "name": "recordType", "type": "string" }
        ],
        "outputs": []
    },

    /* ── Ownership ─── */
    {
        "type": "function",
        "name": "transferOwnership",
        "stateMutability": "nonpayable",
        "inputs": [{ "name": "newOwner", "type": "address" }],
        "outputs": []
    },

    /* ── Events ─── */
    {
        "type": "event",
        "name": "LabRegistered",
        "inputs": [
            { "name": "labAddress", "type": "address", "indexed": true },
            { "name": "registeredBy", "type": "address", "indexed": true },
            { "name": "timestamp", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "LabRemoved",
        "inputs": [
            { "name": "labAddress", "type": "address", "indexed": true },
            { "name": "removedBy", "type": "address", "indexed": true },
            { "name": "timestamp", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "RecordRegistered",
        "inputs": [
            { "name": "fileHash", "type": "bytes32", "indexed": true },
            { "name": "metadataHash", "type": "bytes32", "indexed": false },
            { "name": "registeredBy", "type": "address", "indexed": true },
            { "name": "patientId", "type": "string", "indexed": false },
            { "name": "recordType", "type": "string", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "RecordVerified",
        "inputs": [
            { "name": "fileHash", "type": "bytes32", "indexed": true },
            { "name": "verifiedBy", "type": "address", "indexed": true },
            { "name": "isValid", "type": "bool", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "RecordRevoked",
        "inputs": [
            { "name": "fileHash", "type": "bytes32", "indexed": true },
            { "name": "revokedBy", "type": "address", "indexed": true },
            { "name": "reason", "type": "string", "indexed": false },
            { "name": "timestamp", "type": "uint256", "indexed": false }
        ]
    },
    {
        "type": "event",
        "name": "RecordSuperseded",
        "inputs": [
            { "name": "oldFileHash", "type": "bytes32", "indexed": true },
            { "name": "newFileHash", "type": "bytes32", "indexed": true },
            { "name": "updatedBy", "type": "address", "indexed": true },
            { "name": "timestamp", "type": "uint256", "indexed": false }
        ]
    }
];

/**
 * CONTRACT_ADDRESS
 * ────────────────
 * Paste your deployed address here after running:
 *   npx hardhat run scripts/deploy.js --network sepolia
 */
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const NETWORK_CONFIG = {
    chainId: "0x539", // 1337 in hex
    chainName: "Hardhat Local",
    rpcUrls: ["http://localhost:8545"],
    nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18
    }
};