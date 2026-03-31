/**
 * contractABI.js
 * ─────────────────────────────────────────────────────────────────
 * Replace CONTRACT_ADDRESS with your deployed contract address.
 * The ABI below matches contracts/MedVerify.sol exactly.
 */

export const CONTRACT_ABI = [
    /* ── Access Control ─── */
    {
        "type": "function",
        "name": "LAB_ROLE",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [{ "type": "bytes32" }]
    },
    {
        "type": "function",
        "name": "VERIFIER_ROLE",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [{ "type": "bytes32" }]
    },

    /* ── Lab Registry ─── */
    {
        "type": "function",
        "name": "registerLab",
        "stateMutability": "nonpayable",
        "inputs": [{ "name": "lab", "type": "address" }],
        "outputs": []
    },

    /* ── Lab Upload ─── */
    {
        "type": "function",
        "name": "registerRecord",
        "stateMutability": "nonpayable",
        "inputs": [
            { "name": "recordId", "type": "string" },
            { "name": "patientIdHash", "type": "bytes32" },
            { "name": "documentHash", "type": "bytes32" },
            { "name": "metadataHash", "type": "bytes32" }
        ],
        "outputs": []
    },

    /* ── Verification — view so patients don't pay gas ─── */
    {
        "type": "function",
        "name": "getRecord",
        "stateMutability": "view",
        "inputs": [{ "name": "recordId", "type": "string" }],
        "outputs": [
            { "name": "recordId", "type": "string" },
            { "name": "patientIdHash", "type": "bytes32" },
            { "name": "documentHash", "type": "bytes32" },
            { "name": "metadataHash", "type": "bytes32" },
            { "name": "issuer", "type": "address" },
            { "name": "issuedAt", "type": "uint256" },
            { "name": "status", "type": "uint8" },
            { "name": "exists", "type": "bool" }
        ]
    },

    /* ── Revoke ─── */
    {
        "type": "function",
        "name": "revokeRecord",
        "stateMutability": "nonpayable",
        "inputs": [{ "name": "recordId", "type": "string" }],
        "outputs": []
    },

    /* ── Events ─── */
    {
        "type": "event",
        "name": "RecordRegistered",
        "inputs": [
            { "name": "recordId", "type": "string", "indexed": true },
            { "name": "documentHash", "type": "bytes32", "indexed": true },
            { "name": "issuer", "type": "address", "indexed": true },
            { "name": "patientIdHash", "type": "bytes32", "indexed": false },
            { "name": "metadataHash", "type": "bytes32", "indexed": false },
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