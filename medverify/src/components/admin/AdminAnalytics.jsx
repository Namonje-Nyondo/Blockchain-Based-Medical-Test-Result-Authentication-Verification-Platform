import { useState, useEffect } from "react";
import AdminTopBar from "./AdminTopBar.jsx";
import Icon from "../shared/Icon.jsx";
import {
  GAS_PRICE_SERIES,
  ANALYTICS_KPIS,
  TOP_GAS_LABS,
} from "../../data/mockData.js";

/* ── Tiny helpers ─────────────────────────────────────────── */
const W = 340, H = 140, PAD = { t: 12, r: 12, b: 24, l: 32 };

function GasChart({ liveValue }) {
  const data  = [...GAS_PRICE_SERIES.slice(-23), liveValue];
  const max   = Math.max(...data) + 4;
  const min   = Math.max(0, Math.min(...data) - 4);
  const range = max - min || 1;
  const cw    = W - PAD.l - PAD.r;
  const ch    = H - PAD.t - PAD.b;

  const px = (i) => PAD.l + (i / (data.length - 1)) * cw;
  const py = (v) => PAD.t + ch - ((v - min) / range) * ch;

  /* Build path strings */
  const linePath = data.map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const fillPath = `${linePath} L${px(data.length - 1).toFixed(1)},${(PAD.t + ch).toFixed(1)} L${PAD.l},${(PAD.t + ch).toFixed(1)} Z`;

  const xLabels = ["00:00", "06:08", "12:00", "18:00", "23:58"];
  const yGridLines = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e3b8a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1e3b8a" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Y grid lines */}
      {Array.from({ length: yGridLines }).map((_, i) => {
        const y = PAD.t + (i / (yGridLines - 1)) * ch;
        const val = Math.round(max - (i / (yGridLines - 1)) * range);
        return (
          <g key={i}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#e8ecf4" strokeWidth="1" strokeDasharray="3,3" />
            <text x={PAD.l - 4} y={y + 4} textAnchor="end" fontSize="8" fill="#94a3b8">{val}</text>
          </g>
        );
      })}

      {/* Fill */}
      <path d={fillPath} fill="url(#gasGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#1e3b8a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Live dot */}
      <circle cx={px(data.length - 1)} cy={py(liveValue)} r="4" fill="#1e3b8a" />
      <circle cx={px(data.length - 1)} cy={py(liveValue)} r="7" fill="none" stroke="#1e3b8a" strokeWidth="1.5" strokeOpacity="0.35" />

      {/* X labels */}
      {xLabels.map((lbl, i) => (
        <text key={lbl} x={PAD.l + (i / (xLabels.length - 1)) * cw} y={H - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">{lbl}</text>
      ))}
    </svg>
  );
}

function LatencyBar({ label, value, maxVal, color }) {
  const pct = Math.min(100, (value / maxVal) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{value}ms</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}cc)`, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function DonutChart({ pct, color, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
}

/* ── KPI Card ─────────────────────────────────────────────── */
function KpiCard({ kpi }) {
  const hasChange = kpi.change !== null;
  return (
    <div className="card" style={{ padding: "18px 20px", transition: "box-shadow .2s" }}
      onMouseOver={e => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.07)")}
      onMouseOut={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.04)")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${kpi.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          {kpi.icon}
        </div>
        {hasChange && (
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
            background: kpi.up ? "rgba(239,68,68,.08)" : "rgba(16,185,129,.08)",
            color: kpi.up ? "#dc2626" : "#059669",
          }}>{kpi.change}</span>
        )}
        {kpi.tag && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "rgba(16,185,129,.08)", color: "#059669" }}>
            {kpi.tag}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>{kpi.label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>{kpi.value}</div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function AdminAnalytics() {
  const [liveGwei, setLiveGwei] = useState(42);
  const [range, setRange]       = useState("Last 24 Hours");

  /* Simulate live gas price fluctuation */
  useEffect(() => {
    const id = setInterval(() => {
      setLiveGwei(v => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.max(10, Math.min(80, Math.round((v + delta) * 10) / 10));
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const exportReport = () => {
    const rows = [
      "Metric,Value",
      `Total Daily Gas Usage,145.2 Gwei`,
      `Avg. Confirmation Time,12.4s`,
      `Active Network Nodes,1284`,
      `Success Rate,99.98%`,
      `Live Gas Price,${liveGwei} Gwei`,
      `Node Syncing Latency,98ms`,
      `API Response Latency,142ms`,
      `Validation Integrity,96%`,
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "network-analytics.csv"; a.click();
  };

  return (
    <div>
      <AdminTopBar
        title="Network Health & Gas Analytics"
        sub="Real-time performance monitoring for medical data verification"
        actions={
          <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
            <button onClick={exportReport} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#0f172a", color: "#fff", border: "none",
              borderRadius: 10, padding: "8px 14px", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
              transition: "opacity .18s",
            }}
              onMouseOver={e => (e.currentTarget.style.opacity = ".85")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}
            >
              <Icon.Upload s={{ width: 14, height: 14 }} /> Export Report
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", color: "#475569", border: "1.5px solid #e8ecf4",
              borderRadius: 10, padding: "8px 13px", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
              transition: "all .18s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#1e3b8a"; e.currentTarget.style.color = "#1e3b8a"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#e8ecf4"; e.currentTarget.style.color = "#475569"; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {range}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 11, height: 11 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        }
      />

      <div style={{ padding: "22px 26px" }}>

        {/* ── KPI cards ──────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
          {ANALYTICS_KPIS.map((kpi, i) => <KpiCard key={i} kpi={kpi} />)}
        </div>

        {/* ── Row 2: Gas chart + Latency + Integrity ─────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Gas Price Card */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 3, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1e3b8a" strokeWidth="2" style={{ width: 16, height: 16 }}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  Real-time Gas Price (Gwei)
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Live network cost monitoring</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#1e3b8a", letterSpacing: "-0.03em", lineHeight: 1 }}>{liveGwei}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Gwei</div>
              </div>
            </div>
            <GasChart liveValue={liveGwei} />
          </div>

          {/* Right column: Latency + Integrity */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Network Latency */}
            <div className="card" style={{ padding: "18px 20px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3b8a" strokeWidth="2" style={{ width: 16, height: 16 }}>
                  <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0"/>
                  <line x1="12" y1="20" x2="12.01" y2="20"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Network Latency</span>
              </div>
              <LatencyBar label="Node Syncing"  value={98}  maxVal={150} color="#1e3b8a" />
              <LatencyBar label="API Response"  value={142} maxVal={200} color="#14b8a6" />
            </div>

            {/* Validation Integrity */}
            <div className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <Icon.Shield s={{ width: 16, height: 16, color: "#1e3b8a" }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Validation Integrity</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <DonutChart pct={96} color="#1e3b8a" size={76} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>96%</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>Cross-Chain Verification</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Total verified blocks: <strong style={{ color: "#1e3b8a" }}>4.2M</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Gas-Consuming Labs ─────────────────────────── */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>Top Gas-Consuming Labs</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>High-volume verifiers this cycle</div>
          </div>
          {TOP_GAS_LABS.map((lab, i) => (
            <div key={i}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < TOP_GAS_LABS.length - 1 ? "1px solid #f8fafc" : "none", transition: "background .15s" }}
              onMouseOver={e => (e.currentTarget.style.background = "#fafbfd")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Rank */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", width: 16, textAlign: "center" }}>{i + 1}</div>
              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: lab.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{lab.initials}</span>
              </div>
              {/* Name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{lab.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{(1200 + i * 87).toLocaleString()} Trans / Day</div>
              </div>
              {/* Gwei + change */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{lab.gwei}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: lab.up ? "#dc2626" : "#059669" }}>{lab.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom live strip ───────────────────────────────── */}
        <div style={{ marginTop: 16, padding: "14px 20px", background: "#0f172a", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#14b8a6", animation: "pulse 1.8s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>Live · HealthChain Mainnet</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Gas Price", value: `${liveGwei} Gwei` },
              { label: "Block",     value: "19,482,310"       },
              { label: "TPS",       value: "48.2"             },
            ].map(x => (
              <div key={x.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{x.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'DM Mono',monospace" }}>{x.value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
