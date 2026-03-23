import { useState } from "react";
import Icon from "../shared/Icon.jsx";

/* ── Role tab config ────────────────────────────────────── */
const ROLES = [
  {
    id:          "patient",
    label:       "Patient",
    icon:        ({ s }) => <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z"/></svg>,
    accent:      "#1e3b8a",
    banner:      "linear-gradient(135deg,#1e3b8a 0%,#14b8a6 100%)",
    bannerLabel: "Patient Portal",
    bannerSub:   "Access your medical records",
    placeholder: "dr.smith@hospital.com",
    hint:        null,
  },
  {
    id:          "laboratory",
    label:       "Laboratory",
    icon:        ({ s }) => <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v2h1v8.5l-4 5.5v1a1 1 0 001 1h14a1 1 0 001-1v-1l-4-5.5V4h1V2H7zm3 10.34V4h4v8.34l3.2 4.66H6.8l3.2-4.66z"/></svg>,
    accent:      "#0d9488",
    banner:      "linear-gradient(135deg,#0d9488 0%,#2a52c9 100%)",
    bannerLabel: "Lab Portal",
    bannerSub:   "Submit & certify test results",
    placeholder: "lab@medchain.com",
    hint:        null,
  },
  {
    id:          "admin",
    label:       "Admin",
    icon:        ({ s }) => <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z"/></svg>,
    accent:      "#f59e0b",
    banner:      "linear-gradient(135deg,#0f172a 0%,#1e3b8a 100%)",
    bannerLabel: "Admin Console",
    bannerSub:   "System administration access",
    placeholder: "admin@medverify.com",
    hint:        "Use your admin credentials to access the system console.",
  },
];

export default function LoginPage({ onNavigate, onLogin }) {
  const [tab,      setTab]      = useState("patient");
  const [showPass, setShowPass] = useState(false);
  const [email,    setEmail]    = useState("");
  const [password, setPass]     = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error,    setError]    = useState("");

  const role = ROLES.find(r => r.id === tab);
  const isAdmin = tab === "admin";

  const handleTabSwitch = (id) => {
    setTab(id);
    setEmail("");
    setPass("");
    setAdminKey("");
    setError("");
    setShowPass(false);
  };

  const doLogin = () => {
    setError("");

    /* Admin: require the access key */
    if (isAdmin && adminKey !== "ADMIN2024") {
      setError("Invalid admin access key. Use: ADMIN2024");
      return;
    }

    const name = email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Admin";
    onLogin({ name, email: email || `admin@medverify.com`, role: tab });
  };

  const canSubmit = isAdmin ? email && adminKey : !!email;

  return (
    <div style={{
      minHeight: "100vh",
      background: isAdmin ? "#0a0f1e" : "#f0f3fa",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'DM Sans',sans-serif",
      backgroundImage: isAdmin
        ? "radial-gradient(ellipse at 30% 20%,rgba(245,158,11,.06) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(30,59,138,.12) 0%,transparent 60%)"
        : "radial-gradient(ellipse at 30% 20%,rgba(30,59,138,.06) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(20,184,166,.05) 0%,transparent 60%)",
      transition: "background .4s",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="ai">

        {/* Back */}
        <button className="lnk" onClick={() => onNavigate("landing")} style={{ display: "flex", alignItems: "center", gap: 6, color: isAdmin ? "rgba(255,255,255,.45)" : "#64748b", fontSize: 13, fontWeight: 500, marginBottom: 22 }}>
          <Icon.ArrowL s={{ width: 14, height: 14 }} /> Back to MedVerify
        </button>

        <div style={{
          background: isAdmin ? "#111827" : "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: isAdmin
            ? "0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(245,158,11,.12)"
            : "0 24px 64px rgba(30,59,138,.12), 0 4px 16px rgba(0,0,0,.04)",
          border: isAdmin ? "1px solid rgba(245,158,11,.15)" : "1px solid rgba(255,255,255,.8)",
          transition: "all .3s",
        }}>

          {/* ── Logo header ─────────────────────────────── */}
          <div style={{ padding: "28px 24px 20px", textAlign: "center", borderBottom: `1px solid ${isAdmin ? "rgba(255,255,255,.07)" : "#f1f5f9"}` }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: isAdmin ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "linear-gradient(135deg,#1e3b8a,#2a52c9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
              boxShadow: isAdmin ? "0 8px 20px rgba(245,158,11,.3)" : "0 8px 20px rgba(30,59,138,.25)",
              transition: "all .3s",
            }}>
              <Icon.Shield s={{ width: 24, height: 24, color: "#fff" }} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: isAdmin ? "#fff" : "#0f172a", marginBottom: 3 }}>MedVerify</h1>
            <p style={{ fontSize: 13, color: isAdmin ? "rgba(255,255,255,.4)" : "#94a3b8", fontWeight: 500 }}>HealthChain Secure Gateway</p>
          </div>

          {/* ── Role Tab Switcher ────────────────────────── */}
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{
              display: "flex", gap: 0,
              background: isAdmin ? "rgba(255,255,255,.06)" : "#f1f5f9",
              borderRadius: 12, padding: 4,
            }}>
              {ROLES.map(r => {
                const active = tab === r.id;
                return (
                  <button key={r.id} onClick={() => handleTabSwitch(r.id)} style={{
                    flex: 1, padding: "9px 6px", borderRadius: 9,
                    border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13, fontWeight: active ? 700 : 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    background: active ? (r.id === "admin" ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "#fff") : "transparent",
                    color: active ? (r.id === "admin" ? "#fff" : r.accent) : (isAdmin ? "rgba(255,255,255,.4)" : "#94a3b8"),
                    boxShadow: active && r.id !== "admin" ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                    transition: "all .2s",
                  }}>
                    <r.icon s={{ width: 14, height: 14 }} />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Banner ──────────────────────────────────── */}
          <div style={{ margin: "16px 20px 0" }}>
            <div style={{
              background: role.banner, borderRadius: 12, padding: "14px 16px",
              backgroundSize: "200% 200%", animation: "gradShift 6s ease infinite",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -14, right: -14, width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none" }} />
              {isAdmin && (
                <div style={{ position: "absolute", top: 10, right: 14, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.8s ease-in-out infinite" }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,.7)", fontWeight: 700 }}>RESTRICTED</span>
                </div>
              )}
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 3 }}>
                {role.bannerLabel}
              </p>
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>{role.bannerSub}</p>
            </div>
          </div>

          {/* ── Form ────────────────────────────────────── */}
          <div style={{ padding: "16px 20px 22px" }}>

            {/* Admin hint box */}
            {isAdmin && (
              <div style={{ marginBottom: 14, padding: "10px 13px", background: "rgba(245,158,11,.08)", borderRadius: 10, border: "1px solid rgba(245,158,11,.2)" }}>
                <p style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Restricted Access — Admin credentials required.
                  Demo access key: <strong>ADMIN2024</strong>
                </p>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: isAdmin ? "rgba(255,255,255,.6)" : "#374151", marginBottom: 6 }}>
                {isAdmin ? "Admin Email" : "Professional Email"}
              </label>
              <div style={{ position: "relative" }}>
                <Icon.Mail s={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8", pointerEvents: "none" }} />
                <input
                  className="inp"
                  type="email"
                  placeholder={role.placeholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={isAdmin ? { background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.1)", color: "#fff" } : {}}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: isAdmin ? 12 : 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: isAdmin ? "rgba(255,255,255,.6)" : "#374151" }}>Password</label>
                <button className="lnk" onClick={() => onNavigate("forgot-password")} style={{ fontSize: 12, color: role.accent, fontWeight: 600 }}>Forgot password?</button>
              </div>
              <div style={{ position: "relative" }}>
                <Icon.Lock s={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8", pointerEvents: "none" }} />
                <input
                  className="inp"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPass(e.target.value)}
                  style={{ paddingRight: 40, ...(isAdmin ? { background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.1)", color: "#fff" } : {}) }}
                />
                <button className="lnk" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", padding: 2 }}>
                  <Icon.Eye s={{ width: 15, height: 15 }} off={showPass} />
                </button>
              </div>
            </div>

            {/* Admin access key field */}
            {isAdmin && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.6)", marginBottom: 6 }}>
                  Admin Access Key
                </label>
                <div style={{ position: "relative" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, pointerEvents: "none" }}>
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                  <input
                    className="inp"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter admin access key…"
                    value={adminKey}
                    onChange={e => setAdminKey(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && canSubmit && doLogin()}
                    style={{ paddingRight: 40, background: "rgba(255,255,255,.06)", borderColor: adminKey && adminKey !== "ADMIN2024" ? "rgba(239,68,68,.5)" : "rgba(255,255,255,.1)", color: "#fff", letterSpacing: ".06em" }}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{ marginBottom: 12, padding: "9px 12px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 9, fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={doLogin}
              disabled={!canSubmit}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: canSubmit
                  ? (isAdmin ? "linear-gradient(135deg,#f59e0b,#ef4444)" : `linear-gradient(135deg,${role.accent},${role.accent}cc)`)
                  : "#e2e8f0",
                color: canSubmit ? "#fff" : "#94a3b8",
                boxShadow: canSubmit ? `0 6px 20px ${role.accent}44` : "none",
                transition: "all .18s",
                marginBottom: 13,
              }}
              onMouseOver={e => { if (canSubmit) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {isAdmin ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ width: 16, height: 16 }}>
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  Access Admin Console
                </>
              ) : (
                <>Sign In <Icon.ArrowR s={{ width: 14, height: 14 }} /></>
              )}
            </button>

            {/* Web3 option — not shown for admin */}
            {!isAdmin && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
                  <div style={{ flex: 1, height: 1, background: "#e8ecf4" }} />
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", whiteSpace: "nowrap" }}>or Web3</span>
                  <div style={{ flex: 1, height: 1, background: "#e8ecf4" }} />
                </div>
                <button className="btn-s" style={{ width: "100%", justifyContent: "center" }}>
                  <Icon.Wallet s={{ width: 15, height: 15, color: "#1e3b8a" }} /> Connect Wallet
                </button>
              </>
            )}
          </div>

          {/* ── Footer ──────────────────────────────────── */}
          <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${isAdmin ? "rgba(255,255,255,.07)" : "#f1f5f9"}`, textAlign: "center" }}>
            {!isAdmin && (
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                New to MedVerify?{" "}
                <button className="lnk" onClick={() => onNavigate("signup")} style={{ color: "#1e3b8a", fontWeight: 700, fontSize: 13 }}>Create an account</button>
              </p>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              {["HIPAA Compliant", "256-bit AES", "HealthChain"].map(b => (
                <span key={b} style={{ fontSize: 10, color: isAdmin ? "rgba(255,255,255,.25)" : "#94a3b8", fontWeight: 600, letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ color: isAdmin ? "#f59e0b" : "#14b8a6" }}>✦</span>{b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

