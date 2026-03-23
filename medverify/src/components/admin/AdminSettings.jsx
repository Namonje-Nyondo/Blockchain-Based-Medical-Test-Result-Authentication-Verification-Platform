import { useState } from "react";
import AdminTopBar from "./AdminTopBar.jsx";
import SettingsRow from "../shared/SettingsRow.jsx";
import Toggle from "../shared/Toggle.jsx";
import Icon from "../shared/Icon.jsx";

export default function AdminSettings({ user, onLogout }) {
  const [maintenanceMode, setMaintenance] = useState(false);
  const [auditAlerts,     setAuditAlerts] = useState(true);
  const [autoSuspend,     setAutoSuspend] = useState(true);
  const [twoFA,           setTwoFA]       = useState(true);

  const tealIcon = (path) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" style={{ width: 20, height: 20 }}>{path}</svg>
  );

  return (
    <div>
      <AdminTopBar title="Admin Settings" sub="System configuration and access control" />
      <div style={{ padding: "22px 26px", maxWidth: 580 }}>

        {/* Profile card */}
        <div className="card ai" style={{ padding: "22px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(245,158,11,.3)", flexShrink: 0 }}>
              <Icon.Shield s={{ width: 28, height: 28, color: "#fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>{user.name}</h2>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#64748b", marginBottom: 6 }}>0xAD...C0N5</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(245,158,11,.1)", borderRadius: 20, padding: "3px 10px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: ".08em" }}>System Administrator</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: "9px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e8ecf4", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em" }}>Admin ID</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#0f172a", fontWeight: 500 }}>ADM-0001-HC</span>
          </div>
        </div>

        {/* System Controls */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".12em", padding: "0 4px", marginBottom: 8 }}>System Controls</p>
        <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
          <SettingsRow
            iconBg="rgba(239,68,68,.08)"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            title="Maintenance Mode"
            sub="Temporarily disable public access to the platform"
            toggle toggleOn={maintenanceMode} onToggle={setMaintenance}
          />
          <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
          <SettingsRow
            iconBg="rgba(30,59,138,.08)"
            icon={tealIcon(<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>)}
            title="Audit Alerts"
            sub="Send email alerts on suspicious transactions"
            toggle toggleOn={auditAlerts} onToggle={setAuditAlerts}
          />
          <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
          <SettingsRow
            iconBg="rgba(245,158,11,.08)"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ width: 20, height: 20 }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>}
            title="Auto-Suspend Labs"
            sub="Automatically suspend labs with score below 30/93"
            toggle toggleOn={autoSuspend} onToggle={setAutoSuspend}
          />
        </div>

        {/* Security */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".12em", padding: "0 4px", marginBottom: 8 }}>Security</p>
        <div className="card" style={{ overflow: "hidden", marginBottom: 28 }}>
          <SettingsRow
            iconBg="rgba(20,184,166,.1)"
            icon={tealIcon(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>)}
            title="Two-Factor Auth"
            sub="Required for admin accounts"
            toggle toggleOn={twoFA} onToggle={setTwoFA}
          />
          <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
          <SettingsRow
            iconBg="rgba(30,59,138,.08)"
            icon={tealIcon(<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>)}
            title="Blockchain Network"
            sub="HealthChain Mainnet · Ethereum"
            chevron
          />
          <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
          <SettingsRow
            iconBg="rgba(30,59,138,.08)"
            icon={tealIcon(<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>)}
            title="Export Audit Logs"
            sub="Download full transaction history"
            chevron
          />
        </div>

        {/* Sign out */}
        <button onClick={onLogout} style={{
          width: "100%", padding: "15px", borderRadius: 14,
          background: "#fff", border: "1.5px solid rgba(239,68,68,.25)",
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
          fontSize: 15, fontWeight: 700, color: "#ef4444",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          transition: "all .18s",
        }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,.04)"; e.currentTarget.style.borderColor = "rgba(239,68,68,.5)"; }}
          onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(239,68,68,.25)"; }}
        >
          <Icon.Logout s={{ width: 18, height: 18 }} /> Sign Out
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#c7cdd8", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
          MedVerify V2.41 • Admin Console • HealthChain Network
        </p>
      </div>
    </div>
  );
}
