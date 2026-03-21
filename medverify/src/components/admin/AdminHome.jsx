import AdminTopBar from "./AdminTopBar.jsx";
import Icon from "../shared/Icon.jsx";
import { ADMIN_STATS, NETWORK_NODES, AUDIT_TRANSACTIONS } from "../../data/mockData.js";

function StatusDot({ status }) {
  const colors = { online: "#10b981", offline: "#ef4444", syncing: "#f59e0b" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors[status] || "#94a3b8", animation: status === "online" ? "pulse 2s ease-in-out infinite" : "none" }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: colors[status], textTransform: "capitalize" }}>{status}</span>
    </span>
  );
}

export default function AdminHome({ setPage }) {
  return (
    <div>
      <AdminTopBar title="Admin Dashboard" sub="MedVerify Network Overview" />
      <div style={{ padding: "22px 26px" }}>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {ADMIN_STATS.map((s, i) => (
            <div key={s.label} className="stat-card ai" style={{ animationDelay: `${i * .07}s` }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: s.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
          {/* Recent audit */}
          <div className="card ai" style={{ overflow: "hidden", animationDelay: ".15s" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Recent Transactions</div>
              <button className="lnk" onClick={() => setPage("audit")} style={{ fontSize: 13, color: "#1e3b8a", fontWeight: 700 }}>View All →</button>
            </div>
            {AUDIT_TRANSACTIONS.slice(0, 5).map((tx, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: tx.status === "confirmed" ? "rgba(16,185,129,.1)" : tx.status === "failed" ? "rgba(239,68,68,.1)" : "rgba(245,158,11,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: tx.status === "confirmed" ? "#10b981" : tx.status === "failed" ? "#ef4444" : "#f59e0b" }}>{tx.labCode}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#0f172a", fontWeight: 500 }}>{tx.hash}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{tx.action.replace(/_/g, " ")}</div>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{tx.time}</div>
              </div>
            ))}
          </div>

          {/* Network nodes */}
          <div className="card ai" style={{ overflow: "hidden", animationDelay: ".2s" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Network Nodes</div>
              <button className="lnk" onClick={() => setPage("nodes")} style={{ fontSize: 13, color: "#1e3b8a", fontWeight: 700 }}>Manage →</button>
            </div>
            {NETWORK_NODES.map((node, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: "1px solid #f8fafc" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{node.region}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#94a3b8" }}>{node.ip}</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <StatusDot status={node.status} />
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{node.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
