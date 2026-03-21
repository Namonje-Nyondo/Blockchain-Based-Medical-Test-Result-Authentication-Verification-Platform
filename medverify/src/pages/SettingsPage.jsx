import { useState } from "react";
import Icon from "../components/shared/Icon.jsx";
import SettingsRow from "../components/shared/SettingsRow.jsx";

export default function SettingsPage({ user, role, onLogout }) {
  const isLab = role === "laboratory";
  const [twoFA,  setTwoFA]  = useState(true);
  const [notifs, setNotifs] = useState(true);

  const avatarInitials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const accountId = isLab ? "LAB-0042-HC" : "HC-R829-X01";

  const tealIcon = (svgPath) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" style={{ width: 20, height: 20 }}>
      {svgPath}
    </svg>
  );

  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf4", padding: "16px 24px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ width: 32 }} />
        <h1 style={{ flex: 1, textAlign: "center", fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>Settings</h1>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "24px 20px 40px" }}>

        {/* Profile Card */}
        <div className="card ai" style={{ padding: "24px 20px 20px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: isLab ? "linear-gradient(135deg,#0d9488,#2a52c9)" : "linear-gradient(135deg,#c47c5a,#e8a87c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,.12)" }}>
                {isLab ? <Icon.Lab s={{ width: 30, height: 30, color: "#fff" }} /> : <span style={{ fontFamily: "'DM Sans',sans-serif" }}>{avatarInitials}</span>}
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: "50%", background: "#1e3b8a", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ width: 10, height: 10 }}>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em", marginBottom: 4 }}>
                {user.name || (isLab ? "MedChain Lab" : "Dr. Alex River")}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                <Icon.Wallet s={{ width: 12, height: 12, color: "#94a3b8" }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#64748b" }}>0x71C7...4E90</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,.1)", borderRadius: 20, padding: "3px 10px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: ".08em" }}>
                  {isLab ? "Certified Laboratory" : "Verified Professional"}
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: "9px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e8ecf4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em" }}>{isLab ? "Lab ID" : "Patient ID"}</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#0f172a", fontWeight: 500 }}>{accountId}</span>
          </div>
        </div>

        {/* Account Security */}
        <div style={{ marginBottom: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".12em", padding: "0 4px", marginBottom: 8 }}>Account Security</p>
          <div className="card" style={{ overflow: "hidden" }}>
            <SettingsRow
              iconBg="rgba(20,184,166,.1)"
              icon={tealIcon(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>)}
              title="Two-Factor Auth"
              sub="Biometric and SMS login"
              toggle toggleOn={twoFA} onToggle={setTwoFA}
            />
            <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
            <SettingsRow
              iconBg="rgba(30,59,138,.08)"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="#1e3b8a" strokeWidth="2" style={{ width: 20, height: 20 }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>}
              title="Change Password"
              sub="Last changed 3 months ago"
              chevron
            />
          </div>
        </div>

        {/* Preferences */}
        <div style={{ marginTop: 20, marginBottom: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".12em", padding: "0 4px", marginBottom: 8 }}>Preferences</p>
          <div className="card" style={{ overflow: "hidden" }}>
            <SettingsRow
              iconBg="rgba(20,184,166,.1)"
              icon={tealIcon(<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>)}
              title="Language" sub="English (US)" chevron
            />
            <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
            <SettingsRow
              iconBg="rgba(245,158,11,.08)"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>}
              title="Push Notifications" sub="Status and verification alerts"
              toggle toggleOn={notifs} onToggle={setNotifs}
            />
            <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
            <SettingsRow
              iconBg="rgba(99,102,241,.08)"
              icon={tealIcon(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>)}
              title="Privacy Settings"
              sub={isLab ? "Data sharing & patient access" : "Manage data sharing & visibility"}
              chevron
            />
            {isLab && (
              <>
                <div style={{ height: 1, background: "#f1f5f9", margin: "0 20px" }} />
                <SettingsRow
                  iconBg="rgba(30,59,138,.08)"
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="#1e3b8a" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>}
                  title="Blockchain Network" sub="HealthChain Mainnet" chevron
                />
              </>
            )}
          </div>
        </div>

        {/* Sign Out */}
        <div style={{ marginTop: 28 }}>
          <button
            onClick={onLogout}
            style={{ width: "100%", padding: "15px", borderRadius: 14, background: "#fff", border: "1.5px solid rgba(239,68,68,.25)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, transition: "all .18s" }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,.04)"; e.currentTarget.style.borderColor = "rgba(239,68,68,.5)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(239,68,68,.25)"; }}
          >
            <Icon.Logout s={{ width: 18, height: 18 }} /> Sign Out
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 22, fontSize: 10, color: "#c7cdd8", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
          MedVerify V2.41 • HealthChain Network
        </p>
      </div>
    </div>
  );
}
