// @ts-nocheck
import { ethers } from "ethers";
import contractArtifact from "../../blockchain/artifacts/contracts/MedVerifyRegistry.sol/MedVerifyRegistry.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://127.0.0.1:8545";

function hexToBytes32(hexHash) {
    const clean = hexHash.replace(/^0x/, "");
    return "0x" + clean.padStart(64, "0").slice(0, 64);
}

export async function connectWallet() {
    if (!window.ethereum) throw new Error("MetaMask is not installed");
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();
    return { browserProvider, signer, address };
}

export async function getContract() {
    const { signer } = await connectWallet();
    return new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, signer);
}

export function getReadOnlyContract() {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, rpcProvider);
}

export async function registerLab(labAddress) {
    const contract = await getContract();
    const tx = await contract.registerLab(labAddress);
    const receipt = await tx.wait();
    return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "confirmed" : "failed",
    };
}

export async function registerRecord(params) {
    const { signer, address } = await connectWallet();
    console.log("🔑 Submitting from wallet:", address);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, signer);

    const recordId = params.fileHash.substring(0, 32);
    const patientIdHash = ethers.id(params.patientId || "unknown");
    const documentHash = hexToBytes32(params.fileHash);
    const metadataHash = hexToBytes32(params.metadataHash);

    console.log("📝 Registering record:", {
        recordId,
        patientIdHash,
        documentHash: documentHash.substring(0, 20) + "...",
        metadataHash: metadataHash.substring(0, 20) + "...",
    });

    const tx = await contract.registerRecord(
        recordId,
        patientIdHash,
        documentHash,
        metadataHash
    );

    const receipt = await tx.wait();
    console.log("✅ Record registered! TX:", receipt.hash);

    return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "confirmed" : "failed",
    };
}

export async function verifyRecord(fileHashHex) {
    const contract = getReadOnlyContract();

    const recordId = fileHashHex.replace(/^0x/, "").substring(0, 32);
    const submittedDocumentHash = hexToBytes32(fileHashHex);

    console.log("🔍 Verifying record:", { recordId, submittedDocumentHash });

    const result = await contract.getRecord(recordId);

    const exists = result[7];
    const storedDocumentHash = result[2];
    const status = Number(result[6]);
    const issuer = result[4];
    const issuedAt = result[5];

    const isValid =
        exists &&
        status === 0 &&
        storedDocumentHash.toLowerCase() === submittedDocumentHash.toLowerCase();

    console.log("🔍 Verification result:", { exists, status, isValid });

    return {
        isValid,
        registeredBy: issuer,
        timestamp: issuedAt > 0 ? Number(issuedAt) : null,
        metadataHash: result[3],
        status,
    };
}

export async function getRecord(recordId) {
    const contract = getReadOnlyContract();
    const result = await contract.getRecord(recordId);
    return {
        recordId: result[0],
        patientIdHash: result[1],
        documentHash: result[2],
        metadataHash: result[3],
        issuer: result[4],
        timestamp: result[5] > 0n ? new Date(Number(result[5]) * 1000) : null,
        status: Number(result[6]),
        exists: result[7],
    };
}

export async function revokeRecord(recordId) {
    const contract = await getContract();
    const tx = await contract.revokeRecord(recordId);
    const receipt = await tx.wait();
    return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "confirmed" : "failed",
    };
}

export async function fetchRecordRegisteredEvents(fromBlock = 0, toBlock = "latest") {
    const contract = getReadOnlyContract();
    const events = await contract.queryFilter(
        contract.filters.RecordRegistered(), fromBlock, toBlock
    );
    return events
        .map(e => ({
            txHash: e.transactionHash,
            blockNumber: e.blockNumber,
            recordId: e.args.recordId,
            patientIdHash: e.args.patientIdHash,
            documentHash: e.args.documentHash,
            metadataHash: e.args.metadataHash,
            issuer: e.args.issuer,
            timestamp: new Date(Number(e.args.timestamp) * 1000),
        }))
        .sort((a, b) => b.blockNumber - a.blockNumber);
}

export function subscribeToRecordRegistered(onEvent) {
    const contract = getReadOnlyContract();
    const handler = (recordId, documentHash, issuer, patientIdHash, metadataHash, timestamp, event) => {
        onEvent({
            txHash: event.log?.transactionHash || event.transactionHash,
            blockNumber: event.log?.blockNumber || event.blockNumber,
            recordId, patientIdHash, documentHash, metadataHash, issuer,
            timestamp: new Date(Number(timestamp) * 1000),
        });
    };
    contract.on("RecordRegistered", handler);
    return () => contract.off("RecordRegistered", handler);
}

export async function fetchAuditEvents({ fromBlock = 0, toBlock = "latest" } = {}) {
    const contract = getReadOnlyContract();
    try {
        const [registered, verified, revoked] = await Promise.all([
            contract.queryFilter(contract.filters.RecordRegistered(), fromBlock, toBlock),
            contract.queryFilter(contract.filters.RecordVerified(), fromBlock, toBlock),
            contract.queryFilter(contract.filters.RecordRevoked(), fromBlock, toBlock),
        ]);
        const normalize = (events, action) => events.map(e => ({
            txHash: e.transactionHash,
            blockNumber: e.blockNumber,
            action,
            recordId: e.args.recordId || "",
            issuer: e.args.issuer || "",
            timestamp: e.args.timestamp ? new Date(Number(e.args.timestamp) * 1000) : new Date(),
        }));
        return [
            ...normalize(registered, "RECORD_REGISTERED"),
            ...normalize(verified, "RECORD_VERIFIED"),
            ...normalize(revoked, "RECORD_REVOKED"),
        ].sort((a, b) => b.blockNumber - a.blockNumber);
    } catch (error) {
        console.error("Error fetching audit events:", error);
        return [];
    }
}

export async function subscribeToEvents(onEvent) {
    const contract = getReadOnlyContract();
    const makeHandler = (action) => (...args) => {
        const e = args[args.length - 1];
        onEvent({
            txHash: e.transactionHash,
            blockNumber: e.blockNumber,
            action,
            recordId: args[0]?.toString() || "",
            issuer: args[1]?.toString() || "",
            timestamp: new Date(),
        });
    };
    contract.on("RecordRegistered", makeHandler("RECORD_REGISTERED"));
    contract.on("RecordVerified", makeHandler("RECORD_VERIFIED"));
    contract.on("RecordRevoked", makeHandler("RECORD_REVOKED"));
    return () => contract.removeAllListeners();
}

export async function getUserRole(walletAddress) {
    const contract = getReadOnlyContract();
    try {
        const LAB_ROLE = await contract.LAB_ROLE();
        const isLab = await contract.hasRole(LAB_ROLE, walletAddress);
        const ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
        const isAdmin = await contract.hasRole(ADMIN_ROLE, walletAddress);
        if (isAdmin) return "admin";
        if (isLab) return "laboratory";
        return "patient";
    } catch (error) {
        console.error("Error getting user role:", error);
        return "patient";
    }
}

export async function getAllLabs() {
    const contract = getReadOnlyContract();
    const events = await contract.queryFilter(contract.filters.LabRegistered());
    return [...new Set(events.map(e => e.args.lab))];
}

export async function isRegisteredLab(labAddress) {
    const contract = getReadOnlyContract();
    const LAB_ROLE = await contract.LAB_ROLE();
    return await contract.hasRole(LAB_ROLE, labAddress);
}

export async function removeLab(labAddress) {
    const contract = await getContract();
    const LAB_ROLE = await contract.LAB_ROLE();
    const tx = await contract.revokeRole(LAB_ROLE, labAddress);
    const receipt = await tx.wait();
    return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "confirmed" : "failed",
    };
}