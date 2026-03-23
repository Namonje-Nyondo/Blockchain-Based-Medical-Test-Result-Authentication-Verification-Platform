import { useState, useEffect } from "react";
import AdminTopBar from "./AdminTopBar.jsx";
import Icon from "../shared/Icon.jsx";
import { AUDIT_TRANSACTIONS } from "../../data/mockData.js";
import { fetchAuditEvents, subscribeToEvents } from "../../utils/contractService.js";
import { shortHash } from "../../utils/hashService.js";
import { formatAddress } from "../../utils/web3Provider.js";

const STATUS_COLORS = {
  confirmed: { bg: "rgba(16,185,129,.1)",  color: "#059669", label: "Confirmed" },
  pending:   { bg: "rgba(245,158,11,.1)",  color: "#d97706", label: "Pending"   },
  failed:    { bg: "rgba(239,68,68,.1)",   color: "#dc2626", label: "Failed"    },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.confirmed;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function LabAvatar({ initials, color }) {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 8, background: color || "#1e3b8a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{initials}</span>
    </div>
  );
}

const LAB_COLORS = {
  NL: "#1e3b8a", CD: "#2a52c9", PH: "#10b981",
  UL: "#7c3aed", BC: "#0d9488", QG: "#f59e0b", ND: "#ef4444",
};

/* Normalize a chain event to the same shape as mock data rows */
function normalizeChainEvent(e) {
  const labCode = formatAddress(e.labAddress).slice(0, 2).toUpperCase() || "??";
  return {
    hash:    shortHash(e.fileHash || e.txHash || "", 4),
    lab:     formatAddress(e.labAddress),
    labCode,
    action:  e.action,
    status:  "confirmed",
    time:    e.timestamp?.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) || "—",
    block:   e.blockNumber?.toString() || "—",
  };
}

export default function AuditTrail() {
  const [search, setSearch]           = useState("");
  const [dateRange, setDateRange]     = useState("Oct 01 - Oct 31, 2023");
  const [statusFilter, setStatus]     = useState("All");
  const [refreshing, setRefresh]      = useState(false);
  const [page, setPage]               = useState(1);
  const [chainEvents, setChainEvents] = useState(null);  // null = not yet loaded
  const [chainError, setChainError]   = useState(null);
  const [usingChain, setUsingChain]   = useState(false);
  const PER_PAGE = 10;

  /* Try loading real chain events; fall back to mock data gracefully */
  const loadFromChain = async () => {
    setRefresh(true);
    setChainError(null);
    try {
      const events = await fetchAuditEvents({ fromBlock: 0 });
      setChainEvents(events.map(normalizeChainEvent));
      setUsingChain(true);
    } catch (err) {
      setChainError(err.message || "Could not connect to contract.");
      setUsingChain(false);
    } finally {
      setRefresh(false);
    }
  };

  /* Subscribe to live events once chain is connected */
  useEffect(() => {
    if (!usingChain) return;
    const unsubscribe = subscribeToEvents((event) => {
      setChainEvents(prev => [normalizeChainEvent({ ...event, action: event.event || "EVENT" }), ...(prev || [])]);
    });
    return unsubscribe;
  }, [usingChain]);

  /* Use chain data if available, fall back to mock */
  const TOTAL = usingChain ? (chainEvents?.length || 0) : 2482;
  const transactions = usingChain ? (chainEvents || []) : AUDIT_TRANSACTIONS;

  const filtered = transactions.filter(tx => {
    const matchSearch = !search || tx.hash.toLowerCase().includes(search.toLowerCase()) || tx.lab.toLowerCase().includes(search.toLowerCase()) || tx.action.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || tx.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const rows = ["Transaction Hash,Sender Lab,Action,Status,Time,Block"]
      .concat(filtered.map(tx => `${tx.hash},${tx.lab},${tx.action},${tx.status},${tx.time},${tx.block}`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "audit-trail.csv"; a.click();
  };

  return (
    <div>
      <AdminTopBar
        title="Audit Trail"
        sub="Detailed log of all MedVerify blockchain transactions"
        actions={
          <div style={{ display: "flex", gap: 9 }}>
            <button onClick={exportCSV} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", border: "1.5px solid #dde3ed",
              borderRadius: 10, padding: "8px 14px", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: "#475569",
              transition: "all .18s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#1e3b8a"; e.currentTarget.style.color = "#1e3b8a"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#dde3ed"; e.currentTarget.style.color = "#475569"; }}
            >
              <Icon.Upload s={{ width: 14, height: 14 }} /> Export CSV
            </button>
            <button onClick={loadFromChain} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: usingChain ? "linear-gradient(135deg,#10b981,#0d9488)" : "linear-gradient(135deg,#1e3b8a,#2a52c9)",
              border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
              boxShadow: "0 4px 12px rgba(30,59,138,.25)", transition: "all .18s",
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"
                style={{ width: 14, height: 14, animation: refreshing ? "spin .8s linear infinite" : "none" }}>
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              {refreshing ? "Loading…" : usingChain ? "Refresh Feed" : "Load from Chain"}
            </button>
          </div>
        }
      />

      <div style={{ padding: "22px 26px" }}>
        <div className="card" style={{ overflow: "hidden" }}>

          {/* Search + filters */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 280px", minWidth: 200 }}>
              <Icon.View s={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#94a3b8", pointerEvents: "none" }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by transaction hash, lab name…"
                style={{ width: "100%", padding: "9px 14px 9px 38px", border: "1.5px solid #e8ecf4", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: "#0f172a", background: "#f8fafc", outline: "none", transition: "all .2s" }}
                onFocus={e => { e.target.style.borderColor = "#1e3b8a"; e.target.style.background = "#fff"; }}
                onBlur={e => { e.target.style.borderColor = "#e8ecf4"; e.target.style.background = "#f8fafc"; }}
              />
            </div>

            {/* Date range */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 13px", border: "1.5px solid #e8ecf4", borderRadius: 10, background: "#f8fafc", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569", whiteSpace: "nowrap" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ width: 14, height: 14 }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {dateRange}
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ width: 12, height: 12 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 13px", border: "1.5px solid #e8ecf4", borderRadius: 10, background: "#f8fafc", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569" }}>
              <Icon.Filter s={{ width: 13, height: 13, color: "#94a3b8" }} />
              Status: {statusFilter}
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ width: 12, height: 12 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            {/* Quick filter pills */}
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "Confirmed", "Pending", "Failed"].map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  padding: "6px 12px", borderRadius: 20, border: "none",
                  cursor: "pointer", fontSize: 12, fontWeight: 700,
                  fontFamily: "'DM Sans',sans-serif",
                  background: statusFilter === s ? "#0f172a" : "#f1f5f9",
                  color: statusFilter === s ? "#fff" : "#64748b",
                  transition: "all .18s",
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 1.8fr 1fr 1fr", gap: 12, padding: "10px 18px", background: "#f8fafc", borderBottom: "1px solid #e8ecf4" }}>
            {["Transaction Hash", "Sender Lab", "Action", "Status", "Time"].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((tx, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.8fr 1.8fr 1fr 1fr", gap: 12, padding: "12px 18px", borderBottom: "1px solid #f8fafc", alignItems: "center", transition: "background .15s" }}
              onMouseOver={e => (e.currentTarget.style.background = "#fafbfd")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Hash */}
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#1e3b8a", fontWeight: 500 }}>{tx.hash}</span>
                <button className="lnk" style={{ color: "#94a3b8", padding: 2 }}>
                  <Icon.Copy s={{ width: 12, height: 12 }} />
                </button>
              </div>
              {/* Lab */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LabAvatar initials={tx.labCode} color={LAB_COLORS[tx.labCode]} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{tx.lab}</span>
              </div>
              {/* Action */}
              <span style={{ fontSize: 12, color: "#475569", fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>
                {tx.action.replace(/_/g, " ")}
              </span>
              {/* Status */}
              <StatusBadge status={tx.status} />
              {/* Time */}
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{tx.time}</span>
            </div>
          ))}

          {/* Pagination */}
          <div style={{ padding: "14px 18px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Showing <strong>{((page - 1) * PER_PAGE) + 1}</strong> to <strong>{Math.min(page * PER_PAGE, TOTAL)}</strong> of <strong>{TOTAL.toLocaleString()}</strong> transactions
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn-s" style={{ padding: "6px 12px", fontSize: 12, borderRadius: 8 }}>‹</button>
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => setPage(n)} style={{
                  width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
                  background: page === n ? "#1e3b8a" : "#f1f5f9",
                  color: page === n ? "#fff" : "#64748b",
                  transition: "all .18s",
                }}>{n}</button>
              ))}
              <span style={{ fontSize: 13, color: "#94a3b8", padding: "0 4px" }}>…</span>
              <button style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, background: "#f1f5f9", color: "#64748b" }}>249</button>
              <button onClick={() => setPage(p => p + 1)} className="btn-s" style={{ padding: "6px 12px", fontSize: 12, borderRadius: 8 }}>›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
