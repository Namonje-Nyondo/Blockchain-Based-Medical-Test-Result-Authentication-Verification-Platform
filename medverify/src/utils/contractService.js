import { ethers } from "ethers";
import contractArtifact from "../../blockchain/artifacts/contracts/MedVerifyRegistry.sol/MedVerifyRegistry.json";

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const RPC_URL = "http://127.0.0.1:8545";

function toBytes32(value) {
    const clean = String(value).replace(/^0x/, "");
    return `0x${clean.padStart(64, "0").slice(0, 64)}`;
}

export async function connectWallet() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    return { browserProvider, signer, address };
}

export async function getContract() {
    const { signer } = await connectWallet();
    return new ethers.Contract(
        CONTRACT_ADDRESS,
        contractArtifact.abi,
        signer
    );
}

export function getReadOnlyContract() {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Contract(
        CONTRACT_ADDRESS,
        contractArtifact.abi,
        rpcProvider
    );
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
    const contract = await getContract();
    
    // recordId stays as string (no conversion)
    const recordId = params.fileHash;
    
    // Convert the others to bytes32
    const patientIdHash = ethers.id(params.patientId);
    const documentHash = ethers.id(params.fileHash);
    const metadataHash = ethers.id(params.metadataHash);
    
    console.log("📝 Registering record:", {
        recordId: recordId.substring(0, 20) + "...",
        patientIdHash,
        documentHash: documentHash.substring(0, 20) + "...",
        metadataHash: metadataHash.substring(0, 20) + "..."
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
}export async function verifyRecord(params) {
    const contract = await getContract();
    
    let recordId, submittedDocumentHash;
    
    if (params && typeof params === 'object') {
        recordId = params.recordId || params.fileHash;
        submittedDocumentHash = params.submittedDocumentHash || params.documentHash || params.fileHash;
    } else if (typeof params === 'string') {
        recordId = params;
        // The submittedDocumentHash needs to be converted to bytes32
        submittedDocumentHash = params;
    } else {
        throw new Error("Invalid parameters for verifyRecord");
    }
    
    console.log("🔍 Verifying record:", { 
        recordId: recordId.substring(0, 20) + "...",
        submittedDocumentHash: submittedDocumentHash.substring(0, 20) + "..."
    });
    
    // Call the contract's verifyRecord
    // recordId stays as string, submittedDocumentHash is converted to bytes32
    const result = await contract.verifyRecord(
        recordId,
        ethers.id(submittedDocumentHash)  // Convert to bytes32!
    );
    
    // Return the verification result in the format the UI expects
    return {
        isValid: result[0],           // boolean - whether record is valid
        registeredBy: result[1],      // address - who registered it
        timestamp: new Date(Number(result[2]) * 1000),  // date
        metadataHash: result[3],      // bytes32
        recordType: result[4],        // string
        status: Number(result[5])     // number - 0=pending, 1=verified, 2=revoked
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
        contract.filters.RecordRegistered(),
        fromBlock,
        toBlock
    );

    return events
        .map((event) => ({
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            recordId: event.args.recordId,
            patientIdHash: event.args.patientIdHash,
            documentHash: event.args.documentHash,
            metadataHash: event.args.metadataHash,
            issuer: event.args.issuer,
            timestamp: new Date(Number(event.args.timestamp) * 1000),
        }))
        .sort((a, b) => b.blockNumber - a.blockNumber);
}

export function subscribeToRecordRegistered(onEvent) {
    const contract = getReadOnlyContract();

    const handler = (
        recordId,
        documentHash,
        issuer,
        patientIdHash,
        metadataHash,
        timestamp,
        event
    ) => {
        onEvent({
            txHash: event.log?.transactionHash || event.transactionHash,
            blockNumber: event.log?.blockNumber || event.blockNumber,
            recordId,
            patientIdHash,
            documentHash,
            metadataHash,
            issuer,
            timestamp: new Date(Number(timestamp) * 1000),
        });
    };

    contract.on("RecordRegistered", handler);

    return () => {
        contract.off("RecordRegistered", handler);
    };
}

// ============================================================
// ADDITIONAL FUNCTIONS NEEDED BY THE APP
// ============================================================

export async function getUserRole(walletAddress) {
    const contract = getReadOnlyContract();
    
    try {
        const owner = await contract.owner();
        const isLab = await contract.isRegisteredLab(walletAddress);
        
        if (walletAddress.toLowerCase() === owner.toLowerCase()) return "admin";
        if (isLab) return "laboratory";
        return "patient";
    } catch (error) {
        console.error("Error getting user role:", error);
        return "patient";
    }
}

export async function getPatientRecords(patientIdHash) {
    const contract = getReadOnlyContract();
    return await contract.getPatientRecords(toBytes32(patientIdHash));
}

export async function getAllLabs() {
    const contract = getReadOnlyContract();
    return await contract.getAllLabs();
}

export async function isRegisteredLab(labAddress) {
    const contract = getReadOnlyContract();
    return await contract.isRegisteredLab(labAddress);
}

export async function removeLab(labAddress) {
    const contract = await getContract();
    const tx = await contract.removeLab(labAddress);
    const receipt = await tx.wait();
    return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "confirmed" : "failed",
    };
}

export async function fetchAuditEvents({ fromBlock = 0, toBlock = "latest" } = {}) {
    const contract = getReadOnlyContract();
    
    try {
        const [registered, verified, revoked] = await Promise.all([
            contract.queryFilter(contract.filters.RecordRegistered(), fromBlock, toBlock),
            contract.queryFilter(contract.filters.RecordVerified(), fromBlock, toBlock),
            contract.queryFilter(contract.filters.RecordRevoked(), fromBlock, toBlock)
        ]);
        
        const normalize = (events, action) => events.map(e => ({
            txHash: e.transactionHash,
            blockNumber: e.blockNumber,
            action,
            recordId: e.args.recordId || "",
            issuer: e.args.issuer || "",
            timestamp: e.args.timestamp ? new Date(Number(e.args.timestamp) * 1000) : new Date()
        }));
        
        return [
            ...normalize(registered, "RECORD_REGISTERED"),
            ...normalize(verified, "RECORD_VERIFIED"),
            ...normalize(revoked, "RECORD_REVOKED")
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
            timestamp: new Date()
        });
    };
    
    contract.on("RecordRegistered", makeHandler("RECORD_REGISTERED"));
    contract.on("RecordVerified", makeHandler("RECORD_VERIFIED"));
    contract.on("RecordRevoked", makeHandler("RECORD_REVOKED"));
    
    // Return cleanup function
    return () => {
        contract.removeAllListeners();
    };
}