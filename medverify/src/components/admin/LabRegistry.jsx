import { useState, useEffect } from "react";
import AdminTopBar from "./AdminTopBar.jsx";
import Icon from "../shared/Icon.jsx";
import { REGISTERED_LABS } from "../../data/mockData.js";
import { registerLab, getAllLabs } from "../../utils/contractService.js";
import { formatAddress } from "../../utils/web3Provider.js";

const TAB_FILTERS = ["All Labs", "Active", "Pending", "Suspended"];

const STATUS_STYLES = {
  active:    { bg: "rgba(16,185,129,.12)", color: "#059669", label: "ACTIVE"    },
  pending:   { bg: "rgba(245,158,11,.12)", color: "#d97706", label: "PENDING"   },
  suspended: { bg: "rgba(239,68,68,.12)",  color: "#dc2626", label: "SUSPENDED" },
};

/* ── Register New Lab Modal ────────────────────────────────── */
function RegisterModal({ onClose, onRegister }) {
  const [form, setForm] = useState({
    name: "", location: "", email: "", director: "", specialty: "", walletAddress: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [addrError,  setAddrError]  = useState("");
  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (k === "walletAddress") setAddrError("");
  };

  const isValidAddress = !form.walletAddress || /^0x[0-9a-fA-F]{40}$/.test(form.walletAddress);
  const canSubmit = form.name && form.location && form.email && form.director && isValidAddress;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (form.walletAddress && !/^0x[0-9a-fA-F]{40}$/.test(form.walletAddress)) {
      setAddrError("Must be a valid Ethereum address starting with 0x (42 characters)");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const initials = form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
      const colors   = ["#1e3b8a","#0d9488","#7c3aed","#2a52c9","#f59e0b","#10b981","#ef4444"];
      const color    = colors[Math.floor(Math.random() * colors.length)];
      const newLab   = {
        id:            `LAB-${Math.floor(10000 + Math.random() * 89999)}`,
        name:          form.name,
        location:      form.location,
        status:        "pending",
        joined:        new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        score:         "—",
        initials,
        color,
        records:       0,
        note:          "Under Review — Submitted just now",
        walletAddress: form.walletAddress || null,   // ← stored for registerLab()
      };
      onRegister(newLab);
      setSubmitting(false);
      setDone(true);
    }, 1200);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1.5px solid #e8ecf4", borderRadius: 11,
    fontSize: 14, fontFamily: "'DM Sans',sans-serif",
    color: "#0f172a", background: "#f8fafc", outline: "none", transition: "all .2s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card ai" style={{ width: "100%", maxWidth: 520, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>Register New Lab</h2>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Submit lab for admin review and on-chain approval</p>
          </div>
          <button className="lnk" onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
            onMouseOver={e => e.currentTarget.style.background = "#e2e8f0"}
            onMouseOut={e => e.currentTarget.style.background = "#f1f5f9"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {done ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#0d9488)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(16,185,129,.3)" }}>
              <Icon.Check s={{ width: 28, height: 28, color: "#fff" }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Lab Submitted!</h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
              <strong>{form.name}</strong> is now <em>Pending</em>. When you approve it, the wallet address will be registered on HealthChain.
            </p>
            <button className="btn-p" style={{ padding: "11px 28px" }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <div style={{ padding: "20px 22px 22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 13 }}>

              {/* Lab Name */}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Lab Name *</label>
                <input style={inputStyle} placeholder="e.g. BioPath Central Lab" value={form.name} onChange={set("name")}
                  onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8ecf4"; e.target.style.background = "#f8fafc"; }} />
              </div>

              {/* Location */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Location *</label>
                <input style={inputStyle} placeholder="City, State" value={form.location} onChange={set("location")}
                  onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8ecf4"; e.target.style.background = "#f8fafc"; }} />
              </div>

              {/* Director */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Director Name *</label>
                <input style={inputStyle} placeholder="Dr. Jane Smith" value={form.director} onChange={set("director")}
                  onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8ecf4"; e.target.style.background = "#f8fafc"; }} />
              </div>

              {/* Email */}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Contact Email *</label>
                <input style={inputStyle} type="email" placeholder="lab@example.com" value={form.email} onChange={set("email")}
                  onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8ecf4"; e.target.style.background = "#f8fafc"; }} />
              </div>

              {/* Wallet Address — KEY FIELD for on-chain registration */}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
                  Lab Wallet Address
                  <span style={{ color: "#1e3b8a", marginLeft: 6, fontWeight: 600, textTransform: "none", fontSize: 11 }}>(required for on-chain approval)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Icon.Wallet s={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8", pointerEvents: "none" }} />
                  <input
                    style={{ ...inputStyle, paddingLeft: 38, fontFamily: "'DM Mono',monospace", fontSize: 12,
                      borderColor: addrError ? "#ef4444" : form.walletAddress && !isValidAddress ? "#ef4444" : "#e8ecf4" }}
                    placeholder="0x1234...abcd"
                    value={form.walletAddress}
                    onChange={set("walletAddress")}
                    onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.background = "#f8fafc"; }}
                  />
                </div>
                {addrError && <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 5 }}>⚠ {addrError}</p>}
                {!addrError && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>This is the lab's MetaMask wallet address. It gets registered on the smart contract when you approve.</p>}
              </div>

              {/* Specialty */}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>Specialty (optional)</label>
                <input style={inputStyle} placeholder="e.g. Genomics, Blood Analysis" value={form.specialty} onChange={set("specialty")}
                  onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e8ecf4"; e.target.style.background = "#f8fafc"; }} />
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "9px 12px", background: "rgba(30,59,138,.04)", borderRadius: 9, border: "1px solid rgba(30,59,138,.1)", marginBottom: 18, display: "flex", gap: 8 }}>
              <Icon.Shield s={{ width: 14, height: 14, color: "#1e3b8a", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "#1e3b8a", fontWeight: 500 }}>
                Submitted labs appear as <strong>Pending</strong>. When you click Approve, <code style={{ background: "rgba(30,59,138,.08)", padding: "1px 5px", borderRadius: 4 }}>registerLab(address)</code> is called on the smart contract.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-s" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
              <button className="btn-p" style={{ flex: 2, padding: "13px", opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}
                disabled={!canSubmit || submitting} onClick={handleSubmit}>
                {submitting
                  ? <><span style={{ width: 14, height: 14, border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Submitting…</>
                  : <><Icon.Plus s={{ width: 15, height: 15 }} /> Register Lab</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Lab Card ──────────────────────────────────────────────── */
function LabCard({ lab, onStatusChange, chainAddresses }) {
  const s           = STATUS_STYLES[lab.status] || STATUS_STYLES.active;
  const isActive    = lab.status === "active";
  const isSuspended = lab.status === "suspended";
  const isPending   = lab.status === "pending";
  const [approving, setApproving] = useState(false);
  const [txError,   setTxError]   = useState(null);

  /* Check if this lab's wallet is already on-chain */
  const onChain = lab.walletAddress &&
    chainAddresses.some(a => a.toLowerCase() === lab.walletAddress.toLowerCase());

  const toggleActive = () => onStatusChange(lab.id, isActive ? "suspended" : "active");

  const approve = async () => {
    setApproving(true);
    setTxError(null);
    /* Optimistically update UI */
    onStatusChange(lab.id, "active");
    if (lab.walletAddress) {
      try {
        await registerLab(lab.walletAddress);
      } catch (err) {
        setTxError(err.reason || err.message || "Contract call failed");
        /* Roll back UI on failure */
        onStatusChange(lab.id, "pending");
      }
    }
    setApproving(false);
  };

  const reject = () => onStatusChange(lab.id, "suspended");

  return (
    <div className="card" style={{ padding: "18px 20px", transition: "box-shadow .2s" }}
      onMouseOver={e => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,.07)")}
      onMouseOut={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.04)")}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: lab.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {isSuspended
            ? <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 20, height: 20 }}><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            : <Icon.Lab s={{ width: 20, height: 20, color: "#fff" }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{lab.name}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ width: 12, height: 12, flexShrink: 0 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {lab.location}
            <span style={{ color: "#dde3ed" }}>•</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>ID: {lab.id}</span>
          </div>
          {/* Wallet address row */}
          {lab.walletAddress && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              <Icon.Wallet s={{ width: 11, height: 11, color: onChain ? "#10b981" : "#94a3b8" }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: onChain ? "#059669" : "#94a3b8" }}>
                {formatAddress(lab.walletAddress)}
              </span>
              {onChain && (
                <span style={{ fontSize: 9, fontWeight: 800, color: "#059669", background: "rgba(16,185,129,.1)", padding: "1px 5px", borderRadius: 4 }}>
                  ⛓ ON CHAIN
                </span>
              )}
            </div>
          )}
        </div>

        {/* Edit / More */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button className="lnk" title="Edit" style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all .18s" }}
            onMouseOver={e => { e.currentTarget.style.background = "#1e3b8a"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className="lnk" title="More" style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all .18s" }}
            onMouseOver={e => { e.currentTarget.style.background = "#e2e8f0"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#f1f5f9"; }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}>
              <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, borderRadius: 20, padding: "4px 10px", marginBottom: 10 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, animation: isActive ? "pulse 2s ease-in-out infinite" : "none" }} />
        <span style={{ fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: ".08em" }}>{s.label}</span>
      </div>

      {lab.note && isPending && (
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, fontStyle: "italic" }}>{lab.note}</div>
      )}

      {!isPending && (
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span>{lab.joined}</span>
          <span style={{ color: "#dde3ed" }}>•</span>
          <span>Score: <strong style={{ color: "#0f172a" }}>{lab.score}</strong></span>
          {lab.records > 0 && (
            <><span style={{ color: "#dde3ed" }}>•</span>
            <span><strong style={{ color: "#0f172a" }}>{lab.records}</strong> records</span></>
          )}
        </div>
      )}

      {/* Contract error */}
      {txError && (
        <div style={{ fontSize: 11, color: "#dc2626", background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)", borderRadius: 8, padding: "7px 10px", marginBottom: 10 }}>
          ⚠ {txError}
        </div>
      )}

      {/* Bottom row */}
      <div style={{ paddingTop: 10, borderTop: "1px solid #f8fafc" }}>
        {isPending ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={approve} disabled={approving} style={{
              flex: 1, padding: "8px 0", borderRadius: 9, border: "1.5px solid rgba(16,185,129,.3)",
              background: "rgba(16,185,129,.08)", color: "#059669",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
              cursor: approving ? "not-allowed" : "pointer", transition: "all .18s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: approving ? 0.6 : 1,
            }}
              onMouseOver={e => { if (!approving) { e.currentTarget.style.background = "#10b981"; e.currentTarget.style.color = "#fff"; } }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(16,185,129,.08)"; e.currentTarget.style.color = "#059669"; }}
            >
              {approving
                ? <><span style={{ width: 12, height: 12, border: "2px solid rgba(5,150,105,.3)", borderTopColor: "#059669", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Registering on chain…</>
                : <><Icon.Check s={{ width: 13, height: 13 }} /> Approve {lab.walletAddress ? "& Register" : ""}</>}
            </button>
            <button onClick={reject} style={{
              flex: 1, padding: "8px 0", borderRadius: 9, border: "1.5px solid rgba(239,68,68,.25)",
              background: "rgba(239,68,68,.06)", color: "#dc2626",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", transition: "all .18s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}
              onMouseOver={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(239,68,68,.06)"; e.currentTarget.style.color = "#dc2626"; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 13, height: 13 }}>
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Reject
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div onClick={toggleActive} style={{
              width: 44, height: 24, borderRadius: 12, cursor: "pointer",
              background: isActive ? "linear-gradient(135deg,#1e3b8a,#14b8a6)" : "#d1d5db",
              position: "relative", transition: "background .25s", flexShrink: 0,
            }}>
              <div style={{ position: "absolute", top: 2, left: isActive ? 21 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.2)", transition: "left .22s cubic-bezier(.4,0,.2,1)" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? "#059669" : "#dc2626" }}>
              {isActive ? "Active — click to suspend" : "Suspended — click to activate"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Registry Page ────────────────────────────────────── */
export default function LabRegistry() {
  const [labs,          setLabs]         = useState(REGISTERED_LABS);
  const [tab,           setTab]          = useState("All Labs");
  const [search,        setSearch]       = useState("");
  const [showModal,     setShowModal]    = useState(false);
  const [toast,         setToast]        = useState(null);
  const [chainAddresses, setChainAddrs]  = useState([]);  // addresses confirmed on-chain
  const [chainLoading,  setChainLoading] = useState(false);

  /* On mount: try to load registered lab addresses from chain events */
  useEffect(() => {
    setChainLoading(true);
    getAllLabs()
      .then(labs => setChainAddrs(Array.isArray(labs) ? labs.map(l => l?.address || l) : []))
      .catch(() => {})   // silently fail — chain not configured yet
      .finally(() => setChainLoading(false));
  }, []);

  const showToast = (msg, color = "#10b981") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const handleStatusChange = (id, newStatus) => {
    setLabs(prev => prev.map(l => l.id === id ? { ...l, status: newStatus, note: undefined } : l));
    const lab = labs.find(l => l.id === id);
    if (newStatus === "active")    showToast(`✓ ${lab?.name} approved`, "#10b981");
    if (newStatus === "suspended") showToast(`⊘ ${lab?.name} suspended`, "#ef4444");
  };

  const handleRegister = (newLab) => setLabs(prev => [newLab, ...prev]);

  const filtered = labs.filter(lab => {
    const matchTab    = tab === "All Labs" || lab.status === tab.toLowerCase();
    const matchSearch = !search
      || lab.name.toLowerCase().includes(search.toLowerCase())
      || lab.id.toLowerCase().includes(search.toLowerCase())
      || lab.location.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    "All Labs":  labs.length,
    "Active":    labs.filter(l => l.status === "active").length,
    "Pending":   labs.filter(l => l.status === "pending").length,
    "Suspended": labs.filter(l => l.status === "suspended").length,
  };

  return (
    <div style={{ position: "relative" }}>
      <AdminTopBar
        title="Laboratory Registry"
        sub="Manage and monitor all registered laboratories"
        actions={
          <button onClick={() => setShowModal(true)} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg,#1e3b8a,#2a52c9)", color: "#fff",
            border: "none", borderRadius: 10, padding: "9px 16px", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
            boxShadow: "0 4px 12px rgba(30,59,138,.25)", transition: "transform .14s, box-shadow .18s",
          }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,59,138,.35)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,59,138,.25)"; }}
          >
            <Icon.Plus s={{ width: 14, height: 14 }} /> Register New Lab
          </button>
        }
      />

      <div style={{ padding: "22px 26px" }}>

        {/* Chain status banner */}
        <div style={{ marginBottom: 18, padding: "10px 14px", background: chainAddresses.length > 0 ? "rgba(16,185,129,.06)" : "rgba(30,59,138,.04)", border: `1.5px solid ${chainAddresses.length > 0 ? "rgba(16,185,129,.2)" : "rgba(30,59,138,.1)"}`, borderRadius: 11, display: "flex", alignItems: "center", gap: 9 }}>
          {chainLoading
            ? <span style={{ width: 12, height: 12, border: "2px solid rgba(30,59,138,.2)", borderTopColor: "#1e3b8a", borderRadius: "50%", animation: "spin .8s linear infinite", flexShrink: 0 }} />
            : <span style={{ width: 8, height: 8, borderRadius: "50%", background: chainAddresses.length > 0 ? "#10b981" : "#94a3b8", animation: chainAddresses.length > 0 ? "pulse 2s ease-in-out infinite" : "none", flexShrink: 0 }} />}
          <span style={{ fontSize: 12, fontWeight: 700, color: chainAddresses.length > 0 ? "#059669" : "#64748b" }}>
            {chainLoading
              ? "Loading on-chain registry…"
              : chainAddresses.length > 0
                ? `⛓ ${chainAddresses.length} lab${chainAddresses.length !== 1 ? "s" : ""} confirmed on HealthChain`
                : "Contract not yet configured — showing local data"}
          </span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 18 }}>
          <Icon.View s={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#94a3b8", pointerEvents: "none" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search labs by name, ID, or location…"
            style={{ width: "100%", padding: "11px 16px 11px 42px", border: "1.5px solid #e8ecf4", borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: "#0f172a", background: "#fff", outline: "none", transition: "all .2s", boxShadow: "0 2px 8px rgba(0,0,0,.03)" }}
            onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.boxShadow = "0 0 0 3px rgba(30,59,138,.08)"; }}
            onBlur={e => { e.target.style.borderColor = "#e8ecf4"; e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,.03)"; }}
          />
        </div>

        {/* Tab filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {TAB_FILTERS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", borderRadius: 20,
              border: tab === t ? "none" : "1.5px solid #e8ecf4",
              background: tab === t ? "#0f172a" : "#fff",
              color: tab === t ? "#fff" : "#64748b",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", transition: "all .18s",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {t}
              <span style={{ background: tab === t ? "rgba(255,255,255,.2)" : "#f1f5f9", color: tab === t ? "#fff" : "#94a3b8", fontSize: 11, fontWeight: 800, padding: "1px 7px", borderRadius: 20 }}>
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        {/* Lab cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map(lab => (
            <LabCard key={lab.id} lab={lab} onStatusChange={handleStatusChange} chainAddresses={chainAddresses} />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>No labs found</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filter</div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onRegister={(lab) => {
            handleRegister(lab);
            setShowModal(false);
            showToast(`📋 ${lab.name} submitted for review`, "#1e3b8a");
          }}
        />
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", padding: "12px 24px", borderRadius: 14,
          fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 300, animation: "fadeUp .3s ease both",
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
