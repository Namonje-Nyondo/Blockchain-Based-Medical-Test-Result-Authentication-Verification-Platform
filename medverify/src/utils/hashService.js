/**
 * hashService.js
 * ─────────────────────────────────────────────────────────────────
 * Real SHA-256 hashing using the browser's built-in Web Crypto API.
 * No external libraries required.
 *
 * METADATA STANDARD (v1)
 * ──────────────────────
 * Fields are ALWAYS written in this exact order before hashing.
 * Never change the order — doing so produces a different hash.
 *
 * {
 *   "schemaVersion":    1,
 *   "recordId":         "REC-0001",
 *   "patientRef":       "SHA-256 of patient ID — never the raw ID",
 *   "testType":         "Malaria PCR",
 *   "sampleDate":       "2026-03-09",
 *   "resultIssuedDate": "2026-03-09",
 *   "labWallet":        "0x123...",
 *   "fileHash":         "SHA-256 of the raw file bytes",
 *   "fileType":         "application/pdf",
 *   "network":          "HealthChain Mainnet"
 * }
 *
 * The JSON is serialised with CANONICAL_FIELDS order and
 * NO extra whitespace, so the hash is identical on every device.
 * ─────────────────────────────────────────────────────────────────
 */

/* ── Canonical field order ──────────────────────────────────────
 * This array defines the ONLY valid key order for metadata JSON.
 * Every field must appear in exactly this sequence.
 * Adding a new field?  Append it at the END and bump schemaVersion.
 * ─────────────────────────────────────────────────────────────── */
const CANONICAL_FIELDS = [
  "schemaVersion",
  "recordId",
  "patientRef",
  "testType",
  "sampleDate",
  "resultIssuedDate",
  "labWallet",
  "fileHash",
  "fileType",
  "network",
];

/* ── Low-level helpers ──────────────────────────────────────── */

/** ArrayBuffer → lowercase hex string */
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/** SHA-256 of an ArrayBuffer → 64-char hex */
async function sha256Buffer(arrayBuffer) {
  const digest = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
  return bufferToHex(digest);
}

/** SHA-256 of a UTF-8 string → 64-char hex */
async function sha256String(str) {
  const bytes  = new TextEncoder().encode(str);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return bufferToHex(digest);
}

/** Read a File → ArrayBuffer */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
}

/* ── Canonical serialiser ───────────────────────────────────────
 * Builds a JSON string with fields in CANONICAL_FIELDS order and
 * no extra whitespace. This guarantees the same bytes on every
 * device, browser, and JS engine — so the hash is always identical.
 * ─────────────────────────────────────────────────────────────── */
function canonicalJSON(obj) {
  const ordered = {};
  for (const key of CANONICAL_FIELDS) {
    if (key in obj) ordered[key] = obj[key];
  }
  // Extra safety: warn if any unknown keys were passed
  for (const key of Object.keys(obj)) {
    if (!CANONICAL_FIELDS.includes(key)) {
      console.warn(`[hashService] Unknown metadata field ignored: "${key}"`);
    }
  }
  return JSON.stringify(ordered); // no spaces — deterministic bytes
}

/* ── Record ID generator ────────────────────────────────────── */
/**
 * Generate a record ID from a timestamp + random suffix.
 * Format: "REC-20260309-A3F7"
 * Override this with a server-issued ID in production.
 */
export function generateRecordId(date = new Date()) {
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `REC-${datePart}-${randPart}`;
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT: hashMedicalFile(file, meta)
   ─────────────────────────────────────────────────────────────
   Implements the full 5-step hashing pipeline:
     1. Read file bytes
     2. SHA-256(file bytes)        → fileHash
     3. Build canonical metadata   → metadataJSON
     4. SHA-256(metadataJSON)      → metadataHash
     5. Return both hashes + JSON  → ready for smart contract

   @param {File}   file   The File object from <input type="file">
   @param {Object} meta   Record metadata — shape:
     {
       recordId:         string  e.g. "REC-20260309-A3F7"    (auto-generated if omitted)
       patientRef:       string  SHA-256 of patient ID        (use hashPatientId() first)
       testType:         string  e.g. "Malaria PCR"
       sampleDate:       string  ISO date "2026-03-09"
       resultIssuedDate: string  ISO date "2026-03-09"
       labWallet:        string  e.g. "0x71C7...976F"
       network:          string  e.g. "HealthChain Mainnet"   (default filled in)
     }

   @returns {Promise<{
     fileHash:      string,   64-char hex SHA-256 of raw file bytes
     metadataHash:  string,   64-char hex SHA-256 of canonical metadata JSON
     metadataJSON:  string,   the exact JSON string that was hashed
     metadata:      object,   the parsed metadata object
     fileSizeBytes: number,
     fileName:      string,
     fileType:      string,
     computedAt:    string,   ISO timestamp
   }>}
══════════════════════════════════════════════════════════════ */
export async function hashMedicalFile(file, meta = {}) {

  /* ── Step 1: Read file bytes ── */
  const arrayBuffer = await readFileAsArrayBuffer(file);

  /* ── Step 2: Hash the file bytes ── */
  const fileHash = await sha256Buffer(arrayBuffer);

  /* ── Step 3: Build canonical metadata ──────────────────────
   * Field order follows CANONICAL_FIELDS exactly.
   * patientRef must already be hashed — never store the raw ID.
   * ────────────────────────────────────────────────────────── */
  const now = new Date();

  const metadata = {
    schemaVersion:    1,
    recordId:         meta.recordId         || generateRecordId(now),
    patientRef:       meta.patientRef        || meta.patientIdHash || "UNKNOWN",
    testType:         meta.testType          || meta.recordType    || "Unknown",
    sampleDate:       meta.sampleDate        || meta.issuedAt      || now.toISOString().slice(0, 10),
    resultIssuedDate: meta.resultIssuedDate  || now.toISOString().slice(0, 10),
    labWallet:        meta.labWallet         || meta.labId         || "0x0000000000000000000000000000000000000000",
    fileHash,                                  // SHA-256 of file bytes — embedded for cross-reference
    fileType:         file.type              || "application/octet-stream",
    network:          meta.network           || "HealthChain Mainnet",
  };

  /* ── Step 4: Canonical JSON → SHA-256 ── */
  const metadataJSON = canonicalJSON(metadata);
  const metadataHash = await sha256String(metadataJSON);

  /* ── Step 5: Return both hashes ── */
  return {
    fileHash,
    metadataHash,
    metadataJSON,
    metadata,
    fileSizeBytes: file.size,
    fileName:      file.name,
    fileType:      file.type,
    computedAt:    now.toISOString(),
  };
}

/* ── Patient ID hashing ─────────────────────────────────────────
 * Hash a patient identifier BEFORE it reaches the contract.
 * The raw ID never leaves the browser.
 *
 * Usage:
 *   const patientRef = await hashPatientId("HC-R829-X01");
 *   await hashMedicalFile(file, { patientRef, ... });
 * ─────────────────────────────────────────────────────────────── */
export async function hashPatientId(patientId) {
  if (!patientId || !patientId.trim()) throw new Error("patientId cannot be empty");
  return sha256String(patientId.trim().toLowerCase());
}

/* ── Display utilities ────────────────────────────────────────── */

/** Shorten a 64-char hex hash for UI display: "2b4c47...0b242f" */
export function shortHash(fullHash, chars = 6) {
  if (!fullHash || fullHash.length < chars * 2 + 3) return fullHash || "";
  return `${fullHash.slice(0, chars)}...${fullHash.slice(-chars)}`;
}

/** Async clipboard copy — returns true on success */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
