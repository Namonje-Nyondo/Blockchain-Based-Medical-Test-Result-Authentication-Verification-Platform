import { useState, useRef } from "react";
import Icon from "../shared/Icon.jsx";
import { hashMedicalFile, shortHash } from "../../utils/hashService.js";
import { verifyRecord } from "../../utils/contractService.js";
import { useWallet } from "../../hooks/useWallet.js";
import { formatAddress } from "../../utils/web3Provider.js";

/* ── Copy icon button ─────────────────────────────────────── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="lnk"
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{ color: copied ? "#10b981" : "#94a3b8", padding: 3, transition: "color .2s" }}
      title="Copy"
    >
      {copied
        ? <Icon.Check s={{ width: 14, height: 14 }} />
        : <Icon.Copy  s={{ width: 14, height: 14 }} />}
    </button>
  );
}

/* ── Main component ───────────────────────────────────────── */
export default function VerifyPage({ onNavigate, embedded = false }) {
  const [tab,        setTab]      = useState("upload");
  const [drag,       setDrag]     = useState(false);
  const [file,       setFile]     = useState(null);
  const [hashInput,  setHashInput]= useState("");
  const [running,    setRunning]  = useState(false);
  const [progress,   setProgress] = useState(0);
  const [result,     setResult]   = useState(null);
  const [fileHash,   setFileHash] = useState("");   // computed from uploaded file
  const fileRef = useRef();

  const { connected, connect, connecting, shortAddress } = useWallet();

  const pickFile = (f) => { if (!f) return; setFile(f); setResult(null); setFileHash(""); };

  const canRun = tab === "upload" ? !!file : hashInput.trim().length > 8;

  /* Real blockchain verification with progress animation */
  const runVerification = async () => {
    setRunning(true);
    setProgress(0);
    setResult(null);

    /* Animate progress bar while we work */
    const progressSteps = [15, 30, 50, 65, 80];
    let stepIdx = 0;
    const ticker = setInterval(() => {
      if (stepIdx < progressSteps.length) {
        setProgress(progressSteps[stepIdx++]);
      }
    }, 350);

    try {
      let hashToVerify = hashInput.trim();

      /* If upload tab: hash the file first */
      if (tab === "upload" && file) {
        setProgress(20);
        const hashResult = await hashMedicalFile(file, {});
        hashToVerify = hashResult.fileHash;
        setFileHash(hashToVerify);
        setProgress(50);
      }

      /* Call the smart contract */
      setProgress(70);
      const chainResult = await verifyRecord(hashToVerify);
      setProgress(100);

      clearInterval(ticker);
      await new Promise(r => setTimeout(r, 300));
      setRunning(false);

      if (chainResult.isValid) {
        setResult({
          authentic: true,
          title:     "Authentic Medical Record",
          subtitle:  "Record Hash Validated on HealthChain",
          issuer:    chainResult.registeredBy,
          timestamp: chainResult.timestamp?.toLocaleString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit", timeZoneName: "short",
          }),
          blocks:    "—",
          hash:      shortHash(hashToVerify),
          fullHash:  hashToVerify,
          network:   "HealthChain Mainnet",
          recordType:        chainResult.recordType,
          issuerStillActive: chainResult.issuerStillActive,
          isExpired:         chainResult.isExpired,
        });
      } else {
        setResult({
          authentic: false,
          title:     "Verification Failed",
          subtitle:  chainResult.failureReason || "No matching record found on the blockchain",
          failureCode: chainResult.failureCode,
        });
      }
    } catch (err) {
      clearInterval(ticker);
      setRunning(false);
      setProgress(0);
      setResult({
        authentic: false,
        title:     "Verification Error",
        subtitle:  err.reason || err.message || "Could not connect to blockchain.",
      });
    }
  };

  const reset = () => {
    setFile(null);
    setHashInput("");
    setResult(null);
    setProgress(0);
    setFileHash("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fb", fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── Top Nav — hidden when embedded inside a dashboard ── */}
      {!embedded && (
        <nav style={{ background: "#fff", borderBottom: "1px solid #e8ecf4", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 10px rgba(0,0,0,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => onNavigate("landing")}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#1e3b8a,#2a52c9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.Shield s={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
              Med<span style={{ color: "#1e3b8a" }}>Verify</span>
            </span>
          </div>
          <button
            onClick={() => onNavigate("login")}
            style={{ background: "linear-gradient(135deg,#1e3b8a,#2a52c9)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(30,59,138,.25)" }}
          >
            <Icon.Wallet s={{ width: 14, height: 14 }} /> Connect
          </button>
        </nav>
      )}

      {/* ── Page body ───────────────────────────────────── */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "36px 20px 60px" }}>

        {/* Back link — hidden when embedded inside dashboard */}
        {!embedded && (
          <button className="lnk" onClick={() => onNavigate("landing")} style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            <Icon.ArrowL s={{ width: 14, height: 14 }} /> Back to Home
          </button>
        )}

        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.025em", marginBottom: 8 }}>
            Verify Medical Record
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65 }}>
            Instantly validate the authenticity of medical documents using decentralized blockchain consensus.
          </p>
        </div>

        {/* ── Input Card ─────────────────────────────────── */}
        <div className="card" style={{ padding: "24px", marginBottom: 20 }}>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 0, background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 22 }}>
            {[{ id: "upload", label: "Upload File", icon: <Icon.Upload s={{ width: 14, height: 14 }} /> }, { id: "hash", label: "Paste Hash", icon: <Icon.QR s={{ width: 14, height: 14 }} /> }].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setResult(null); }}
                style={{
                  flex: 1, padding: "9px 12px", borderRadius: 9,
                  border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: tab === t.id ? "#fff" : "transparent",
                  color:      tab === t.id ? "#1e3b8a" : "#64748b",
                  boxShadow:  tab === t.id ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                  transition: "all .18s",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Upload tab */}
          {tab === "upload" && (
            <div
              className={`drop-zone ${drag ? "drag" : ""}`}
              style={{ marginBottom: 20, padding: "40px 20px" }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current.click()}
            >
              <input ref={fileRef} type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png" onChange={e => pickFile(e.target.files[0])} />
              {file ? (
                <>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(16,185,129,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Icon.Check s={{ width: 26, height: 26, color: "#10b981" }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>{(file.size / 1024).toFixed(1)} KB · Ready to verify</div>
                  <button className="btn-s" style={{ padding: "7px 14px", fontSize: 12 }} onClick={e => { e.stopPropagation(); reset(); }}>
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(30,59,138,.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Icon.Upload s={{ width: 26, height: 26, color: "#1e3b8a" }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Drag &amp; drop document</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>PDF, JPEG, or PNG (Max 10Mb)</div>
                </>
              )}
            </div>
          )}

          {/* Hash tab */}
          {tab === "hash" && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
                Document Hash (SHA-256)
              </label>
              <textarea
                value={hashInput}
                onChange={e => { setHashInput(e.target.value); setResult(null); }}
                placeholder="Paste the SHA-256 document hash here…&#10;e.g. 2b4c4789bfc1c1d4af9f4c898df0b242"
                rows={3}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #dde3ed", borderRadius: 11, fontSize: 13, fontFamily: "'DM Mono',monospace", color: "#0f172a", background: "#f8fafc", outline: "none", resize: "none", transition: "all .2s", lineHeight: 1.6 }}
                onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 3px rgba(30,59,138,.08)"; }}
                onBlur={e => { e.target.style.borderColor = "#dde3ed"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
              />
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                💡 Tip: type "fail" in the hash to simulate a failed verification
              </p>
            </div>
          )}

          {/* Progress bar */}
          {running && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1e3b8a" }}>Querying blockchain nodes…</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1e3b8a" }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background: "#e8ecf4", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#1e3b8a,#14b8a6)", borderRadius: 99, transition: "width .35s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                {["Hashing document", "Querying nodes", "Verifying signature", "Confirming blocks"].map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: progress >= (i + 1) * 25 ? "#10b981" : "#dde3ed", transition: "background .3s" }} />
                    <span style={{ fontSize: 11, color: progress >= (i + 1) * 25 ? "#059669" : "#94a3b8", fontWeight: 600 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Run button */}
          <button
            className="btn-p"
            style={{ width: "100%", padding: "14px", opacity: canRun && !running ? 1 : 0.5 }}
            disabled={!canRun || running}
            onClick={runVerification}
          >
            {running
              ? <><span style={{ width: 15, height: 15, border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Verifying on Blockchain…</>
              : <><Icon.Shield s={{ width: 17, height: 17 }} /> Run Verification</>
            }
          </button>
        </div>

        {/* ── Result Card ────────────────────────────────── */}
        {result && (
          <div className="card ai" style={{ overflow: "hidden" }}>
            {/* Result header */}
            <div style={{
              padding: "20px 22px",
              background: result.authentic
                ? "linear-gradient(135deg,rgba(16,185,129,.07),rgba(20,184,166,.07))"
                : "rgba(239,68,68,.05)",
              borderBottom: `1px solid ${result.authentic ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.12)"}`,
              display: "flex", alignItems: "flex-start", gap: 14,
            }}>
              {/* Icon */}
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: result.authentic ? "#10b981" : "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: result.authentic ? "0 6px 18px rgba(16,185,129,.35)" : "0 6px 18px rgba(239,68,68,.3)" }}>
                {result.authentic
                  ? <Icon.Check  s={{ width: 22, height: 22, color: "#fff" }} />
                  : <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 22, height: 22 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", marginBottom: 3 }}>
                  {result.title}
                </div>
                <div style={{ fontSize: 13, color: result.authentic ? "#059669" : "#dc2626", fontWeight: 600 }}>
                  {result.subtitle}
                </div>
              </div>
              {/* Reset button */}
              <button className="lnk" onClick={reset} style={{ color: "#94a3b8", padding: 4, flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                </svg>
              </button>
            </div>

            {/* Result details — only shown for authentic */}
            {result.authentic && (
              <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 0 }}>

                {/* Issuer */}
                <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Issuer Lab Address</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(20,184,166,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon.Lab s={{ width: 14, height: 14, color: "#0d9488" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "#0f172a", fontWeight: 500, flex: 1 }}>{result.issuer}</span>
                    <CopyBtn text={result.issuer} />
                  </div>
                </div>

                {/* Timestamp */}
                <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Timestamp</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(30,59,138,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1e3b8a" strokeWidth="2" style={{ width: 14, height: 14 }}>
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{result.timestamp}</span>
                  </div>
                </div>

                {/* Document hash */}
                <div style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Document Hash</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(30,59,138,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon.QR s={{ width: 14, height: 14, color: "#1e3b8a" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "#0f172a", fontWeight: 500, flex: 1 }}>{result.hash}</span>
                    <CopyBtn text={result.hash} />
                  </div>
                </div>

                {/* Block confirmations + View on Ethereum */}
                <div style={{ padding: "14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ background: "rgba(20,184,166,.1)", borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#14b8a6", animation: "pulse 1.8s ease-in-out infinite", display: "inline-block" }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488" }}>{result.blocks} Block Confirmations</span>
                    </div>
                  </div>
                  <button style={{
                    background: "none", border: "1.5px solid #1e3b8a", borderRadius: 9,
                    padding: "7px 14px", cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: "#1e3b8a",
                    display: "flex", alignItems: "center", gap: 5, transition: "all .18s",
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = "#1e3b8a"; e.currentTarget.style.color = "#fff"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#1e3b8a"; }}
                  >
                    <Icon.Chain s={{ width: 13, height: 13 }} /> View on Ethereum
                  </button>
                </div>
              </div>
            )}

            {/* Failed CTA */}
            {!result.authentic && (
              <div style={{ padding: "20px 22px" }}>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
                  The document you submitted could not be matched to any record on the HealthChain blockchain. It may be unregistered, tampered, or from an unsupported network.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-s" style={{ flex: 1, justifyContent: "center" }} onClick={reset}>Try Again</button>
                  <button className="btn-p" style={{ flex: 1, padding: "12px" }} onClick={() => onNavigate("login")}>
                    <Icon.Shield s={{ width: 15, height: 15 }} /> Report Issue
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Info strip ──────────────────────────────────── */}
        {!result && !running && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            {[
              { icon: "🔒", label: "HIPAA Compliant" },
              { icon: "⛓",  label: "Ethereum Network" },
              { icon: "⚡",  label: "Under 2 seconds" },
            ].map(x => (
              <div key={x.label} style={{ flex: 1, minWidth: 130, background: "#fff", border: "1px solid #e8ecf4", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{x.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{x.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
