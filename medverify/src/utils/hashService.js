/**
 * hashService.js
 * ─────────────────────────────────────────────────────────────
 * Real SHA-256 hashing using the browser's built-in Web Crypto API.
 * No external libraries required.
 *
 * Full hashing flow (matches smart-contract expectations):
 *   1. Read file bytes  →  ArrayBuffer
 *   2. SHA-256(file bytes)       → fileHash
 *   3. Build metadata JSON       → metadataJSON
 *   4. SHA-256(metadataJSON)     → metadataHash
 *   5. Both hashes are ready to send to the smart contract
 * ─────────────────────────────────────────────────────────────
 */

/* ── Low-level helpers ─────────────────────────────────────── */

/**
 * Convert an ArrayBuffer of bytes into a lowercase hex string.
 * e.g. [0x2b, 0x4c] → "2b4c"
 */
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Compute SHA-256 of any ArrayBuffer.
 * Returns a full 64-character lowercase hex string.
 *
 * Uses window.crypto.subtle (available in all modern browsers
 * and in Vite/React dev server over localhost).
 */
async function sha256Buffer(arrayBuffer) {
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
  return bufferToHex(hashBuffer);
}

/**
 * Compute SHA-256 of a plain string (UTF-8 encoded).
 * Used for hashing the metadata JSON.
 */
async function sha256String(str) {
  const encoder    = new TextEncoder();
  const data       = encoder.encode(str);          // Uint8Array (UTF-8)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}

/* ── Step 1 — Read file as ArrayBuffer ─────────────────────── */

/**
 * Read a File object and return its raw bytes as an ArrayBuffer.
 * Wraps the FileReader API in a Promise.
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
}

/* ── Step 2 + 3 + 4 — Full hashing pipeline ──────────────── */

/**
 * hashMedicalFile(file, meta)
 * ───────────────────────────
 * Main export. Call this when a user uploads a lab file.
 *
 * @param {File}   file  - The File object from an <input type="file">
 * @param {Object} meta  - Metadata about the record, e.g.:
 *   {
 *     patientId:    "HC-R829-X01",
 *     labId:        "LAB-29304",
 *     recordType:   "Blood Test",
 *     title:        "Annual Blood Test Results",
 *     issuedBy:     "Dr. Smith",
 *     institution:  "City Hospital",
 *     issuedAt:     "2024-10-24",      // ISO date string
 *     network:      "HealthChain Mainnet",
 *   }
 *
 * @returns {Promise<HashResult>}
 *   {
 *     fileHash:        string,   // SHA-256 of the raw file bytes (hex)
 *     metadataHash:    string,   // SHA-256 of the JSON metadata  (hex)
 *     metadataJSON:    string,   // The raw JSON string that was hashed
 *     fileSizeBytes:   number,
 *     fileName:        string,
 *     fileType:        string,
 *     computedAt:      string,   // ISO timestamp
 *   }
 */
export async function hashMedicalFile(file, meta = {}) {
  /* ── Step 1: Read file bytes ── */
  const arrayBuffer = await readFileAsArrayBuffer(file);

  /* ── Step 2: Hash the file bytes ── */
  const fileHash = await sha256Buffer(arrayBuffer);

  /* ── Step 3: Build metadata JSON ── */
  const metadata = {
    fileName:    file.name,
    fileSize:    file.size,
    fileType:    file.type || "application/octet-stream",
    fileHash,                          // embed the file hash inside metadata too
    recordType:  meta.recordType  || "Unknown",
    title:       meta.title       || file.name,
    patientId:   meta.patientId   || "unknown",
    labId:       meta.labId       || "unknown",
    issuedBy:    meta.issuedBy    || "unknown",
    institution: meta.institution || "unknown",
    issuedAt:    meta.issuedAt    || new Date().toISOString().split("T")[0],
    network:     meta.network     || "HealthChain Mainnet",
    computedAt:  new Date().toISOString(),
  };
  const metadataJSON = JSON.stringify(metadata, null, 2);

  /* ── Step 4: Hash the metadata JSON ── */
  const metadataHash = await sha256String(metadataJSON);

  /* ── Step 5: Return both hashes (ready for smart contract) ── */
  return {
    fileHash,
    metadataHash,
    metadataJSON,
    fileSizeBytes: file.size,
    fileName:      file.name,
    fileType:      file.type,
    computedAt:    metadata.computedAt,
  };
}

/* ── Utility: format a full hash for display ──────────────── */

/**
 * Shorten a 64-char hex hash for UI display.
 * "2b4c4789...0b242" style.
 * @param {string} fullHash  - 64-char hex string
 * @param {number} chars     - chars to show at each end (default 6)
 */
export function shortHash(fullHash, chars = 6) {
  if (!fullHash || fullHash.length < chars * 2 + 3) return fullHash;
  return `${fullHash.slice(0, chars)}...${fullHash.slice(-chars)}`;
}

/**
 * Copy a string to the clipboard.
 * Returns true on success, false on failure.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
