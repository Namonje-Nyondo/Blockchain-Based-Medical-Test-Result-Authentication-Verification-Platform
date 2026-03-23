import { useState, useRef } from "react";
import Icon from "../shared/Icon.jsx";
import TopBar from "../shared/TopBar.jsx";
import { hashMedicalFile, shortHash, copyToClipboard } from "../../utils/hashService.js";
import { registerRecord } from "../../utils/contractService.js";
import { useWallet } from "../../hooks/useWallet.js";

export default function LUpload() {
  const [drag,       setDrag]       = useState(false);
  const [file,       setFile]       = useState(null);
  const [hashing,    setHashing]    = useState(false);
  const [hashResult, setHashResult] = useState(null);
  const [done,       setDone]       = useState(false);
  const [loading,    setLoad]       = useState(false);
  const [txResult,   setTxResult]   = useState(null);   // { txHash, blockNumber }
  const [txError,    setTxError]    = useState(null);
  const [copied,     setCopied]     = useState(null);
  const ref = useRef();

  const { address, connected, connect, connecting, shortAddress } = useWallet();

  /* Step 1 + 2: pick file → real SHA-256 */
  const pick = async (f) => {
    if (!f) return;
    setFile(f);
    setHashResult(null);
    setDone(false);
    setTxResult(null);
    setTxError(null);
    setHashing(true);
    try {
      const result = await hashMedicalFile(f, { labId: "LAB-0042-HC", network: "HealthChain Mainnet" });
      setHashResult(result);
    } catch (err) {
      console.error("Lab hashing error:", err);
    } finally {
      setHashing(false);
    }
  };

  const handleCopy = async (type) => {
    const text = type === "file" ? hashResult?.fileHash : hashResult?.metadataHash;
    if (text) await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  };

  /* Step 3 + 4 + 5: hash metadata → call registerRecord on chain */
  const submit = async () => {
    setLoad(true);
    setTxError(null);
    try {
      /* Re-hash with full lab metadata */
      const final = await hashMedicalFile(file, {
        labId:    "LAB-0042-HC",
        issuedBy: "MedChain Lab",
        network:  "HealthChain Mainnet",
      });
      setHashResult(final);

      /* ── Call the smart contract ── */
      const receipt = await registerRecord({
        fileHash:     final.fileHash,
        metadataHash: final.metadataHash,
        patientId:    address || "PATIENT-UNKNOWN",   // wallet address IS the patient ID on-chain
        recordType:   "Lab Result",
      });

      setTxResult(receipt);
      setDone(true);
    } catch (err) {
      console.error("Contract call failed:", err);
      setTxError(
        err.reason ||
        err.message ||
        "Transaction failed. Check MetaMask and try again."
      );
    } finally {
      setLoad(false);
    }
  };

  return (
    <div>
      <TopBar title="Secure Upload" sub="Submit test results to the blockchain" role="laboratory" />
      <div style={{ padding: "22px 26px", maxWidth: 580 }}>
        <div className="card ai" style={{ padding: "26px" }}>

          {/* Drop zone */}
          <div className={`drop-zone ${drag ? "drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
            onClick={() => ref.current.click()}
            style={{ marginBottom: 20 }}>
            <input ref={ref} type="file" style={{ display: "none" }} onChange={e => pick(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.dcm" />
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: hashing ? "rgba(30,59,138,.08)" : file ? "rgba(16,185,129,.1)" : "rgba(30,59,138,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", transition: "background .3s" }}>
              {hashing
                ? <span style={{ width: 22, height: 22, border: "3px solid rgba(30,59,138,.2)", borderTopColor: "#1e3b8a", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                : file
                  ? <Icon.Check s={{ width: 24, height: 24, color: "#10b981" }} />
                  : <Icon.Upload s={{ width: 24, height: 24, color: "#1e3b8a" }} />}
            </div>
            {file
              ? <><div style={{ fontSize: 14, fontWeight: 700, color: hashing ? "#1e3b8a" : "#10b981", marginBottom: 3 }}>{file.name}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>{hashing ? "Computing SHA-256 hash…" : "Hash computed ✓ — ready to submit"}</div></>
              : <><div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Drag and drop test results</div><div style={{ fontSize: 12, color: "#94a3b8" }}>PDF, DICOM or JPG (Max 20MB)</div></>
            }
            <button className="btn-p" style={{ marginTop: 12, padding: "10px 20px", fontSize: 13 }} onClick={e => { e.stopPropagation(); ref.current.click(); }}>Browse Files</button>
          </div>

          {/* Hash display — real SHA-256 */}
          {hashing && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(30,59,138,.04)", border: "1.5px solid rgba(30,59,138,.1)", borderRadius: 11, padding: "11px 14px", marginBottom: 18 }}>
              <span style={{ width: 14, height: 14, border: "2.5px solid rgba(30,59,138,.2)", borderTopColor: "#1e3b8a", borderRadius: "50%", animation: "spin .8s linear infinite", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1e3b8a" }}>Computing SHA-256 via Web Crypto API…</span>
            </div>
          )}

          {hashResult && !hashing && (
            <div style={{ marginBottom: 18 }}>
              {/* File hash */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>SHA-256 File Hash</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="badge-v" style={{ fontSize: 10 }}>✦ Real</span>
                    <button className="lnk" onClick={() => handleCopy("file")} style={{ color: copied === "file" ? "#10b981" : "#94a3b8", transition: "color .2s" }}>
                      <Icon.Copy s={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
                <div style={{ background: "#f8fafc", border: "1.5px solid #e8ecf4", borderRadius: 10, padding: "10px 12px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#0f172a", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {hashResult.fileHash}
                </div>
              </div>

              {/* Metadata hash */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>SHA-256 Metadata Hash</div>
                  <button className="lnk" onClick={() => handleCopy("meta")} style={{ color: copied === "meta" ? "#10b981" : "#94a3b8", transition: "color .2s" }}>
                    <Icon.Copy s={{ width: 13, height: 13 }} />
                  </button>
                </div>
                <div style={{ background: "#f8fafc", border: "1.5px solid #e8ecf4", borderRadius: 10, padding: "10px 12px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#0f172a", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {hashResult.metadataHash}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, display: "flex", justifyContent: "space-between" }}>
                  <span>File: {(hashResult.fileSizeBytes / 1024).toFixed(2)} KB</span>
                  <span>Algorithm: SHA-256 (Web Crypto)</span>
                </div>
              </div>
            </div>
          )}

          {!hashResult && !hashing && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 7 }}>SHA-256 Document Hash</div>
              <div style={{ background: "#f8fafc", border: "1.5px solid #dde3ed", borderRadius: 11, padding: "11px 13px" }}>
                <span className="mono" style={{ color: "#94a3b8" }}>— awaiting file —</span>
              </div>
            </div>
          )}

          {/* Wallet connect strip */}
          <div style={{ marginBottom: 18, padding: "11px 14px", background: connected ? "rgba(16,185,129,.06)" : "rgba(245,158,11,.06)", border: `1.5px solid ${connected ? "rgba(16,185,129,.2)" : "rgba(245,158,11,.2)"}`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? "#10b981" : "#f59e0b", animation: connected ? "pulse 2s ease-in-out infinite" : "none" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: connected ? "#059669" : "#d97706" }}>
                {connected ? `Wallet: ${shortAddress}` : "Wallet not connected"}
              </span>
            </div>
            {!connected && (
              <button onClick={connect} disabled={connecting} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#f59e0b", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}
          </div>

          {/* Error message */}
          {txError && (
            <div style={{ marginBottom: 14, padding: "11px 14px", background: "rgba(239,68,68,.06)", border: "1.5px solid rgba(239,68,68,.2)", borderRadius: 11, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
              ⚠ {txError}
            </div>
          )}

          {/* Submit */}
          {!done
            ? <button className="btn-p" style={{ width: "100%", padding: "14px", opacity: (!hashResult || loading || hashing || !connected) ? 0.6 : 1 }} disabled={!hashResult || loading || hashing || !connected} onClick={submit}>
                {loading
                  ? <><span style={{ width: 15, height: 15, border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Anchoring to Blockchain…</>
                  : <><Icon.Shield s={{ width: 16, height: 16 }} /> Submit to Blockchain</>}
              </button>
            : <div style={{ background: "rgba(16,185,129,.07)", border: "1.5px solid rgba(16,185,129,.2)", borderRadius: 12, padding: "15px 17px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon.Check s={{ width: 15, height: 15, color: "#fff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>Successfully submitted!</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Record anchored on HealthChain. ✓ Confirmed.</div>
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: 9, padding: "10px 12px", fontSize: 11 }}>
                  <div style={{ marginBottom: 5 }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>Tx Hash: </span>
                    <span style={{ fontFamily: "'DM Mono',monospace", color: "#1e3b8a" }}>{txResult?.txHash ? shortHash(txResult.txHash) : "—"}</span>
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>Block: </span>
                    <span style={{ fontFamily: "'DM Mono',monospace", color: "#0f172a" }}>{txResult?.blockNumber || "—"}</span>
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>File Hash: </span>
                    <span style={{ fontFamily: "'DM Mono',monospace", color: "#0f172a" }}>{shortHash(hashResult?.fileHash || "")}</span>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>Metadata Hash: </span>
                    <span style={{ fontFamily: "'DM Mono',monospace", color: "#0f172a" }}>{shortHash(hashResult?.metadataHash || "")}</span>
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

