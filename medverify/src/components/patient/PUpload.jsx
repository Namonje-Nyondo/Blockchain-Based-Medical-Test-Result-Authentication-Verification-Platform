import { useState, useRef } from "react";
import Icon from "../shared/Icon.jsx";
import TopBar from "../shared/TopBar.jsx";
import StepIndicator from "../shared/StepIndicator.jsx";
import { RECORD_TYPES } from "../../data/mockData.js";
import { hashMedicalFile, hashPatientId, generateRecordId, shortHash, copyToClipboard } from "../../utils/hashService.js";

export default function PUpload({ onComplete, onCancel }) {
  const [step, setStep]             = useState(0);
  const [drag, setDrag]             = useState(false);
  const [file, setFile]             = useState(null);
  const [hashing, setHashing]       = useState(false);
  const [hashResult, setHashResult] = useState(null);
  const [copyDone, setCopyDone]     = useState(false);
  const [recType, setRecType]       = useState("");
  const [title, setTitle]           = useState("");
  const [doctor, setDoctor]         = useState("");
  const [institution, setInst]      = useState("");
  const [date, setDate]             = useState("");
  const [notes, setNotes]           = useState("");
  const [submitting, setSubmit]     = useState(false);
  const [done, setDone]             = useState(false);
  const fileRef = useRef();

  /* ── Step 1 & 2: Pick file → compute real SHA-256 of bytes ── */
  const pickFile = async (f) => {
    if (!f) return;
    setFile(f);
    setHashResult(null);
    setHashing(true);
    try {
      const result = await hashMedicalFile(f, {});
      setHashResult(result);
    } catch (err) {
      console.error("Hashing failed:", err);
    } finally {
      setHashing(false);
    }
  };

  /* ── Step 4 + 5: Final submit with canonical metadata ── */
  const handleSubmit = async () => {
    setSubmit(true);
    try {
      const selectedType = RECORD_TYPES.find(t => t.id === recType);

      /* Hash the patient title as patientRef — no raw ID on-chain */
      const patientRef = await hashPatientId(title || "unknown-patient");

      const finalResult = await hashMedicalFile(file, {
        recordId:         generateRecordId(),
        patientRef,                               // hashed — canonical field
        testType:         selectedType?.label || "Other",
        sampleDate:       date || new Date().toISOString().slice(0, 10),
        resultIssuedDate: date || new Date().toISOString().slice(0, 10),
        labWallet:        doctor || "0x0000000000000000000000000000000000000000",
        network:          "HealthChain Mainnet",
      });
      setHashResult(finalResult);
      await new Promise(r => setTimeout(r, 1800));
      setDone(true);
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmit(false);
    }
  };

  const handleCopyHash = async (hash) => {
    await copyToClipboard(hash);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1800);
  };

  const handleFinish = () => {
    const selectedType = RECORD_TYPES.find(t => t.id === recType);
    onComplete({
      id:     Date.now(),
      title:  title || file?.name || "Untitled Record",
      status: "pending",
      date:   date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      hash:   shortHash(hashResult?.fileHash || ""),
      type:   selectedType?.label || "Other",
    });
  };

  const canProceedStep0 = !!file && !hashing && !!hashResult;
  const canProceedStep1 = recType && title && date;

  /* ── Success screen ─────────────────────── */
  if (done) {
    return (
      <div>
        <TopBar title="Upload Record" sub="Secure blockchain submission" role="patient" />
        <div style={{ padding: "40px 26px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <div className="ai" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", width: 96, height: 96 }}>
              <svg viewBox="0 0 96 96" style={{ width: 96, height: 96 }}>
                <circle cx="48" cy="48" r="44" fill="none" stroke="#e8ecf4" strokeWidth="4" />
                <circle cx="48" cy="48" r="44" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="276" strokeDashoffset="0" style={{ transform: "rotate(-90deg)", transformOrigin: "48px 48px" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#0d9488)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(16,185,129,.35)" }}>
                  <Icon.Check s={{ width: 26, height: 26, color: "#fff" }} />
                </div>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>Record Submitted!</h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, maxWidth: 360, margin: "0 auto" }}>
                Your record has been hashed and anchored to the HealthChain blockchain. A lab must countersign before it's fully verified.
              </p>
            </div>
            <div className="card" style={{ width: "100%", padding: "16px 18px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Blockchain Receipt</div>
              {[
                ["Document",       title || file?.name],
                ["Type",           RECORD_TYPES.find(t => t.id === recType)?.label || "Other"],
                ["File Hash",      shortHash(hashResult?.fileHash || "")],
                ["Metadata Hash",  shortHash(hashResult?.metadataHash || "")],
                ["Status",         "Pending Verification"],
                ["Network",        "HealthChain Mainnet"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: k === "Status" ? "#d97706" : "#0f172a", fontFamily: k.includes("Hash") ? "'DM Mono',monospace" : "inherit" }}>{v}</span>
                </div>
              ))}
            </div>
            <button className="btn-p" style={{ width: "100%", padding: "14px" }} onClick={handleFinish}>
              <Icon.Records s={{ width: 17, height: 17 }} /> View in My Records
            </button>
            <button className="lnk" onClick={onCancel} style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Upload Record" sub="Secure blockchain submission" role="patient" />
      <div style={{ padding: "24px 26px", maxWidth: 580, margin: "0 auto" }}>
        <button className="lnk" onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
          <Icon.ArrowL s={{ width: 14, height: 14 }} /> Back to Dashboard
        </button>

        <StepIndicator step={step} />

        {/* Step 0 — File */}
        {step === 0 && (
          <div className="card ai" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Select your file</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 22 }}>Supported: PDF, JPG, PNG, DICOM (max 20 MB)</p>
            <div className={`drop-zone ${drag ? "drag" : ""}`} style={{ marginBottom: 22, padding: "36px 24px" }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current.click()}>
              <input ref={fileRef} type="file" style={{ display: "none" }} accept=".pdf,.jpg,.jpeg,.png,.dcm" onChange={e => pickFile(e.target.files[0])} />
              {file ? (
                <>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: hashing ? "rgba(30,59,138,.08)" : "rgba(16,185,129,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    {hashing
                      ? <span style={{ width: 26, height: 26, border: "3px solid rgba(30,59,138,.2)", borderTopColor: "#1e3b8a", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                      : <Icon.Check s={{ width: 28, height: 28, color: "#10b981" }} />}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>
                    {(file.size / 1024).toFixed(1)} KB · {hashing ? "Computing SHA-256…" : "Hash verified ✓"}
                  </div>
                  <button className="btn-s" style={{ padding: "8px 16px", fontSize: 13 }} onClick={e => { e.stopPropagation(); setFile(null); setHashResult(null); }}>Change File</button>
                </>
              ) : (
                <>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(30,59,138,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <Icon.Upload s={{ width: 28, height: 28, color: "#1e3b8a" }} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Drag & drop your file here</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>or click to browse your device</div>
                  <button className="btn-p" style={{ padding: "10px 22px", fontSize: 13 }} onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>Browse Files</button>
                </>
              )}
            </div>

            {/* Hash display — shows real SHA-256 once computed */}
            {hashResult && !hashing && (
              <div style={{ background: "#f8fafc", border: "1.5px solid #e8ecf4", borderRadius: 12, padding: "14px 16px", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em" }}>SHA-256 File Hash</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="badge-v" style={{ fontSize: 10 }}>✦ Real Hash</span>
                    <button className="lnk" onClick={() => handleCopyHash(hashResult.fileHash)} title="Copy full hash" style={{ color: copyDone ? "#10b981" : "#94a3b8", transition: "color .2s" }}>
                      <Icon.Copy s={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
                {/* Full hash — monospace, wrappable */}
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#0f172a", wordBreak: "break-all", lineHeight: 1.6, background: "#fff", border: "1px solid #e8ecf4", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
                  {hashResult.fileHash}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                  <span>Size: {(hashResult.fileSizeBytes / 1024).toFixed(2)} KB</span>
                  <span>Algorithm: SHA-256 (Web Crypto API)</span>
                </div>
              </div>
            )}

            {/* Hashing spinner */}
            {hashing && (
              <div style={{ background: "rgba(30,59,138,.04)", border: "1.5px solid rgba(30,59,138,.1)", borderRadius: 12, padding: "14px 16px", marginBottom: 22, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 16, height: 16, border: "2.5px solid rgba(30,59,138,.2)", borderTopColor: "#1e3b8a", borderRadius: "50%", animation: "spin .8s linear infinite", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3b8a" }}>Computing SHA-256…</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Reading file bytes via Web Crypto API</div>
                </div>
              </div>
            )}
            <button className="btn-p" style={{ width: "100%", padding: "14px" }} disabled={!canProceedStep0} onClick={() => setStep(1)}>
              Continue <Icon.ArrowR s={{ width: 15, height: 15 }} />
            </button>
          </div>
        )}

        {/* Step 1 — Details */}
        {step === 1 && (
          <div className="card ai" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Record Details</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 22 }}>Fill in the metadata so this record can be verified on-chain.</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10 }}>Record Type *</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
                {RECORD_TYPES.map(t => (
                  <button key={t.id} onClick={() => setRecType(t.id)} style={{ padding: "11px 8px", borderRadius: 11, border: `1.5px solid ${recType === t.id ? "#1e3b8a" : "#dde3ed"}`, background: recType === t.id ? "rgba(30,59,138,.06)" : "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all .18s" }}>
                    <span style={{ fontSize: 20 }}>{t.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: recType === t.id ? "#1e3b8a" : "#64748b" }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {[["Record Title *", title, setTitle, "e.g. Annual Blood Test Results"], ["Record Date *", date, setDate, ""]].map(([lbl, val, setter, ph], i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>{lbl}</label>
                <input className="inp inp-bare" type={lbl.includes("Date") ? "date" : "text"} placeholder={ph} value={val} onChange={e => setter(e.target.value)} />
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {[["Issuing Doctor", doctor, setDoctor, "Dr. Smith"], ["Institution", institution, setInst, "City Hospital"]].map(([lbl, val, setter, ph]) => (
                <div key={lbl}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>{lbl}</label>
                  <input className="inp inp-bare" placeholder={ph} value={val} onChange={e => setter(e.target.value)} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>Notes (optional)</label>
              <textarea className="inp inp-bare" placeholder="Any additional notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ resize: "vertical", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-s" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(0)}><Icon.ArrowL s={{ width: 14, height: 14 }} /> Back</button>
              <button className="btn-p" style={{ flex: 2, padding: "14px" }} disabled={!canProceedStep1} onClick={() => setStep(2)}>Review <Icon.ArrowR s={{ width: 15, height: 15 }} /></button>
            </div>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="card ai" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Review & Submit</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 22 }}>Verify all details before anchoring this record to the blockchain.</p>

            <div style={{ background: "rgba(30,59,138,.04)", border: "1px solid rgba(30,59,138,.1)", borderRadius: 12, padding: "14px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(30,59,138,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon.File s={{ width: 20, height: 20, color: "#1e3b8a" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file?.name}</div>
                <div className="mono" style={{ marginTop: 2, fontSize: 11, wordBreak: "break-all" }}>
                  {shortHash(hashResult?.fileHash || "")}
                </div>
              </div>
              <span className="badge-v">Hashed</span>
            </div>

            <div className="card" style={{ marginBottom: 20, overflow: "hidden" }}>
              {[
                ["Record Title",   title],
                ["Type",           `${RECORD_TYPES.find(t => t.id === recType)?.icon} ${RECORD_TYPES.find(t => t.id === recType)?.label}`],
                ["Issuing Doctor", doctor || "—"],
                ["Institution",    institution || "—"],
                ["Date",           date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"],
                ["File Hash",      shortHash(hashResult?.fileHash || "—")],
                ["Network",        "HealthChain Mainnet"],
                ["Post-submit",    "⏳ Pending Lab Verification"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: k === "Post-submit" ? "#d97706" : "#0f172a", maxWidth: "55%", textAlign: "right", fontFamily: k === "File Hash" ? "'DM Mono',monospace" : "inherit" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(20,184,166,.05)", border: "1px solid rgba(20,184,166,.15)", borderRadius: 10, padding: "11px 14px", marginBottom: 22, display: "flex", gap: 10 }}>
              <Icon.Shield s={{ width: 16, height: 16, color: "#0d9488", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "#0d9488", lineHeight: 1.55, fontWeight: 500 }}>
                This record will be encrypted and stored on the HealthChain network in compliance with HIPAA & 256-bit AES standards.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-s" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(1)}><Icon.ArrowL s={{ width: 14, height: 14 }} /> Back</button>
              <button className="btn-p" style={{ flex: 2, padding: "14px" }} onClick={handleSubmit} disabled={submitting}>
                {submitting
                  ? <><span style={{ width: 15, height: 15, border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Anchoring to Chain...</>
                  : <><Icon.Shield s={{ width: 16, height: 16 }} /> Submit to Blockchain</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
