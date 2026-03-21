/**
 * contractService.js
 * ─────────────────────────────────────────────────────────────────
 * All smart contract interactions for MedVerify.
 * Uses DYNAMIC ethers import so the app never white-screens if
 * ethers is not installed yet.
 *
 * SCREEN → CONTRACT METHOD MAP:
 * ┌─────────────────┬─────────────────────────────────────────────┐
 * │ Lab Registry    │ registerLab(), removeLab(), getAllLabs()      │
 * │ Lab Upload      │ registerRecord()                             │
 * │ Verify Page     │ verifyRecord(), getRecord()                  │
 * │ Audit Trail     │ queryFilter(events), subscribeToEvents()     │
 * │ Patient Records │ getPatientRecords()                          │
 * │ Admin Revoke    │ revokeRecord()                               │
 * │ Lab Update      │ supersede()                                  │
 * │ Users / Auth    │ getUserRole()                                │
 * └─────────────────┴─────────────────────────────────────────────┘
 */

import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contractABI.js";
import { connectWallet, getReadProvider } from "./web3Provider.js";

/* ── Load ethers dynamically ────────────────────────────────── */
async function loadEthers() {
  try {
    return await import("ethers");
  } catch {
    throw new Error(
      "ethers.js is not installed. Open your terminal in the medverify folder and run: npm install"
    );
  }
}

/* ── Internal helpers ───────────────────────────────────────── */
async function getSignerContract() {
  const { Contract } = await loadEthers();
  const { signer } = await connectWallet();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

async function getReaderContract() {
  const { Contract } = await loadEthers();
  const provider = await getReadProvider();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

function hexToBytes32(hexString) {
  const clean = hexString.replace(/^0x/, "").padStart(64, "0").slice(0, 64);
  return `0x${clean}`;
}

/* ══════════════════════════════════════════════════════════════
   1. LAB REGISTRY SCREEN
   registerLab()     → Admin "Approve" button
   removeLab()       → Admin "Suspend" toggle
   isRegisteredLab() → Real-time active/inactive badge
   getAllLabs()       → Populate full registry list
══════════════════════════════════════════════════════════════ */

export async function registerLab(labWalletAddress) {
  const { ethers } = await loadEthers();
  if (!ethers.isAddress(labWalletAddress))
    throw new Error(`Invalid address: ${labWalletAddress}`);
  const contract = await getSignerContract();
  const gas = await contract.registerLab.estimateGas(labWalletAddress);
  const tx  = await contract.registerLab(labWalletAddress, {
    gasLimit: (gas * BigInt(120)) / BigInt(100),
  });
  const receipt = await tx.wait(1);
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

export async function removeLab(labWalletAddress) {
  const { ethers } = await loadEthers();
  if (!ethers.isAddress(labWalletAddress))
    throw new Error(`Invalid address: ${labWalletAddress}`);
  const contract = await getSignerContract();
  const gas = await contract.removeLab.estimateGas(labWalletAddress);
  const tx  = await contract.removeLab(labWalletAddress, {
    gasLimit: (gas * BigInt(120)) / BigInt(100),
  });
  const receipt = await tx.wait(1);
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

export async function isRegisteredLab(labWalletAddress) {
  const contract = await getReaderContract();
  return contract.isRegisteredLab(labWalletAddress);
}

export async function getAllLabs() {
  const contract = await getReaderContract();
  return contract.getAllLabs();
}

/* ══════════════════════════════════════════════════════════════
   2. LAB UPLOAD SCREEN
   registerRecord() → "Submit to Blockchain" button
══════════════════════════════════════════════════════════════ */

export async function registerRecord({ fileHash, metadataHash, patientIdHash, recordType, expiresAt = 0 }) {
  const contract = await getSignerContract();
  const fh = hexToBytes32(fileHash);
  const mh = hexToBytes32(metadataHash);
  const ph = hexToBytes32(patientIdHash);
  const gas = await contract.registerRecord.estimateGas(fh, mh, ph, recordType, expiresAt);
  const tx  = await contract.registerRecord(fh, mh, ph, recordType, expiresAt, {
    gasLimit: (gas * BigInt(120)) / BigInt(100),
  });
  const receipt = await tx.wait(1);
  return {
    txHash:      receipt.hash,
    blockNumber: receipt.blockNumber,
    status:      receipt.status === 1 ? "confirmed" : "failed",
  };
}

/* ══════════════════════════════════════════════════════════════
   3. VERIFICATION SCREEN

   verifyRecord()  → Core rules [1][2][3] — PUBLIC, anyone calls
   getRecord()     → Same rules, read-only, no gas, no event
   fullVerify()    → All 6 rules — VERIFIER_ROLE only

   VerificationResult shape (returned by all three):
   {
     isValid,           // true only when all applicable rules pass
     failureCode,       // 0=valid 1=notFound 2=revoked 3=superseded
                        // 4=labSuspended 5=expired 6=metaMismatch
     failureReason,     // human-readable string
     registeredBy,      // lab address
     timestamp,         // Date object
     metadataHash,      // stored hash
     recordType,        // e.g. "Blood Test"
     status,            // 0=Active 1=Revoked 2=Superseded
     supersededBy,      // new hash if superseded
     issuerStillActive, // is lab still approved? (populated in all calls)
     isExpired,         // has expiry passed?
   }
══════════════════════════════════════════════════════════════ */

/** Normalise raw struct result from contract into clean JS object */
function normalizeVerificationResult(r) {
  return {
    isValid:           r.isValid,
    failureCode:       Number(r.failureCode),
    failureReason:     r.failureReason,
    registeredBy:      r.registeredBy,
    timestamp:         r.timestamp > 0n ? new Date(Number(r.timestamp) * 1000) : null,
    metadataHash:      r.metadataHash,
    recordType:        r.recordType,
    status:            Number(r.status),
    supersededBy:      r.supersededBy,
    issuerStillActive: r.issuerStillActive,
    isExpired:         r.isExpired,
  };
}

/**
 * Core verification — Rules 1+2+3 — anyone can call.
 * Emits RecordVerified event so Audit Trail captures every check.
 */
export async function verifyRecord(fileHash) {
  const contract = await getSignerContract();
  const fh = hexToBytes32(fileHash);
  /* staticCall first so we can read the result without waiting for mining */
  const raw = await contract.verifyRecord.staticCall(fh);
  /* Then send the real tx so the event is emitted on-chain */
  const gas = await contract.verifyRecord.estimateGas(fh);
  const tx  = await contract.verifyRecord(fh, {
    gasLimit: (gas * BigInt(120)) / BigInt(100),
  });
  await tx.wait(1);
  return normalizeVerificationResult(raw);
}

/**
 * Read-only core check — no gas, no event.
 * Use for instant UI status checks without a transaction.
 */
export async function getRecord(fileHash) {
  const contract = await getReaderContract();
  const fh  = hexToBytes32(fileHash);
  const raw = await contract.getRecord(fh);
  return normalizeVerificationResult(raw);
}

/**
 * Full verification — Rules 1+2+3+4+5+6 — VERIFIER_ROLE only.
 * Also checks: issuer still active, not expired, metadata matches.
 * Use for insurance claims, hospital admission, legal proceedings.
 *
 * @param fileHash             SHA-256 of the document
 * @param expectedMetadataHash The metadata hash to cross-check (pass "" to skip rule 6)
 */
export async function fullVerify(fileHash, expectedMetadataHash = "") {
  const contract = await getSignerContract();
  const fh = hexToBytes32(fileHash);
  const mh = expectedMetadataHash ? hexToBytes32(expectedMetadataHash) : "0x" + "0".repeat(64);
  const raw = await contract.fullVerify.staticCall(fh, mh);
  const gas = await contract.fullVerify.estimateGas(fh, mh);
  const tx  = await contract.fullVerify(fh, mh, {
    gasLimit: (gas * BigInt(120)) / BigInt(100),
  });
  await tx.wait(1);
  return normalizeVerificationResult(raw);
}

/* ══════════════════════════════════════════════════════════════
   4. AUDIT TRAIL SCREEN
   fetchAuditEvents()  → load past events (all 4 types in parallel)
   subscribeToEvents() → live updates as new events arrive
══════════════════════════════════════════════════════════════ */

export async function fetchAuditEvents({ fromBlock = 0, toBlock = "latest" } = {}) {
  const contract = await getReaderContract();
  const [registered, verified, revoked, superseded] = await Promise.all([
    contract.queryFilter(contract.filters.RecordRegistered(), fromBlock, toBlock),
    contract.queryFilter(contract.filters.RecordVerified(),   fromBlock, toBlock),
    contract.queryFilter(contract.filters.RecordRevoked(),    fromBlock, toBlock),
    contract.queryFilter(contract.filters.RecordSuperseded(), fromBlock, toBlock),
  ]);
  const normalize = (events, action) =>
    events.map(e => ({
      txHash:      e.transactionHash,
      blockNumber: e.blockNumber,
      action,
      fileHash:    e.args.fileHash    || e.args.oldFileHash || "",
      labAddress:  e.args.registeredBy || e.args.verifiedBy || e.args.revokedBy || e.args.updatedBy || "",
      patientId:   e.args.patientId   || "—",
      recordType:  e.args.recordType  || "—",
      timestamp:   new Date(Number(e.args.timestamp) * 1000),
    }));
  return [
    ...normalize(registered,  "RECORD_REGISTERED"),
    ...normalize(verified,    "RECORD_VERIFIED"),
    ...normalize(revoked,     "RECORD_REVOKED"),
    ...normalize(superseded,  "RECORD_SUPERSEDED"),
  ].sort((a, b) => b.blockNumber - a.blockNumber);
}

export async function subscribeToEvents(onEvent) {
  const contract = await getReaderContract();
  const makeHandler = (action) => (...args) => {
    const e = args[args.length - 1];
    onEvent({
      txHash:      e.transactionHash,
      blockNumber: e.blockNumber,
      action,
      fileHash:    args[0]?.toString() || "",
      labAddress:  args[1]?.toString() || "",
      timestamp:   new Date(),
    });
  };
  const h1 = makeHandler("RECORD_REGISTERED");
  const h2 = makeHandler("RECORD_VERIFIED");
  const h3 = makeHandler("RECORD_REVOKED");
  const h4 = makeHandler("RECORD_SUPERSEDED");
  contract.on("RecordRegistered", h1);
  contract.on("RecordVerified",   h2);
  contract.on("RecordRevoked",    h3);
  contract.on("RecordSuperseded", h4);
  return () => {
    contract.off("RecordRegistered", h1);
    contract.off("RecordVerified",   h2);
    contract.off("RecordRevoked",    h3);
    contract.off("RecordSuperseded", h4);
  };
}

/* ══════════════════════════════════════════════════════════════
   5. PATIENT RECORDS SCREEN
══════════════════════════════════════════════════════════════ */

export async function getPatientRecords(patientId) {
  const contract = await getReaderContract();
  const hashes = await contract.getPatientRecords(patientId);
  return hashes.map(h => h.toString());
}

export async function loadPatientRecordsWithDetails(patientId) {
  const hashes  = await getPatientRecords(patientId);
  const details = await Promise.all(hashes.map(getRecord));
  return details.map((d, i) => ({ ...d, fileHash: hashes[i] }));
}

/* ══════════════════════════════════════════════════════════════
   6. ADMIN — REVOKE & SUPERSEDE
══════════════════════════════════════════════════════════════ */

export async function revokeRecord(fileHash, reason = "Revoked by admin") {
  const contract = await getSignerContract();
  const fh  = hexToBytes32(fileHash);
  const gas = await contract.revokeRecord.estimateGas(fh, reason);
  const tx  = await contract.revokeRecord(fh, reason, {
    gasLimit: (gas * BigInt(120)) / BigInt(100),
  });
  const receipt = await tx.wait(1);
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

export async function supersede({ oldFileHash, newFileHash, newMetadataHash, patientIdHash, recordType, expiresAt = 0 }) {
  const contract = await getSignerContract();
  const ofh = hexToBytes32(oldFileHash);
  const nfh = hexToBytes32(newFileHash);
  const nmh = hexToBytes32(newMetadataHash);
  const ph  = hexToBytes32(patientIdHash);
  const gas = await contract.supersede.estimateGas(ofh, nfh, nmh, ph, recordType, expiresAt);
  const tx  = await contract.supersede(ofh, nfh, nmh, ph, recordType, expiresAt, {
    gasLimit: (gas * BigInt(120)) / BigInt(100),
  });
  const receipt = await tx.wait(1);
  return { txHash: receipt.hash, blockNumber: receipt.blockNumber };
}

/* ══════════════════════════════════════════════════════════════
   7. USERS — ROLE DETECTION
══════════════════════════════════════════════════════════════ */

export async function getUserRole(walletAddress) {
  const contract = await getReaderContract();
  const { ethers } = await loadEthers();
  /* Check roles in priority order */
  const [isAdmin, isLab, isVerifier] = await Promise.all([
    contract.hasRole(await contract.DEFAULT_ADMIN_ROLE(), walletAddress),
    contract.hasRole(await contract.LAB_ROLE(),           walletAddress),
    contract.hasRole(await contract.VERIFIER_ROLE(),      walletAddress),
  ]);
  if (isAdmin)    return "admin";
  if (isLab)      return "laboratory";
  if (isVerifier) return "verifier";
  return "patient";
}
