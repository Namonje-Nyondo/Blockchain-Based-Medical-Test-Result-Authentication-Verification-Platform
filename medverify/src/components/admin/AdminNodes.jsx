import AdminTopBar from "./AdminTopBar.jsx";
import { NETWORK_NODES } from "../../data/mockData.js";

const STATUS_STYLES = {
  online:  { bg: "rgba(16,185,129,.1)",  color: "#059669", label: "Online"  },
  offline: { bg: "rgba(239,68,68,.1)",   color: "#dc2626", label: "Offline" },
  syncing: { bg: "rgba(245,158,11,.1)",  color: "#d97706", label: "Syncing" },
};

export default function AdminNodes() {
  const online  = NETWORK_NODES.filter(n => n.status === "online").length;
  const offline = NETWORK_NODES.filter(n => n.status === "offline").length;
  const syncing = NETWORK_NODES.filter(n => n.status === "syncing").length;

  return (
    <div>
      <AdminTopBar title="Network Nodes" sub="Monitor all HealthChain blockchain nodes" />
      <div style={{ padding: "22px 26px" }}>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Online",  value: online,  color: "#10b981", bg: "rgba(16,185,129,.08)" },
            { label: "Syncing", value: syncing, color: "#f59e0b", bg: "rgba(245,158,11,.08)" },
            { label: "Offline", value: offline, color: "#ef4444", bg: "rgba(239,68,68,.08)"  },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background: s.bg, border: `1px solid ${s.color}22` }}>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Nodes table */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
            All Nodes ({NETWORK_NODES.length})
          </div>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr 1fr 1fr", gap: 12, padding: "10px 18px", background: "#f8fafc", borderBottom: "1px solid #e8ecf4" }}>
            {["Node ID", "Region", "IP Address", "Status", "Latency", "Last Block"].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</div>
            ))}
          </div>
          {NETWORK_NODES.map((node, i) => {
            const s = STATUS_STYLES[node.status];
            return (
              <div key={i}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr 1fr 1fr", gap: 12, padding: "13px 18px", borderBottom: "1px solid #f8fafc", alignItems: "center", transition: "background .15s" }}
                onMouseOver={e => (e.currentTarget.style.background = "#fafbfd")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#1e3b8a", fontWeight: 600 }}>{node.id}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{node.region}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#64748b" }}>{node.ip}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, animation: node.status === "online" ? "pulse 2s ease-in-out infinite" : "none" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.label}</span>
                </span>
                <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Mono',monospace" }}>{node.latency}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>{node.blocks}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
