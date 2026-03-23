import { useState } from "react";
import Icon from "../shared/Icon.jsx";

/* ── Check Your Email screen ─────────────────────────────── */
function CheckEmailScreen({ email, onBackToLogin, onResend }) {
  const [resent,    setResent]    = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = () => {
    if (countdown > 0) return;
    onResend();
    setResent(true);
    setCountdown(30);
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  /* Try to open the user's mail app */
  const openMailApp = () => {
    window.location.href = "mailto:";
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f3fa",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'DM Sans',sans-serif",
      backgroundImage: "radial-gradient(ellipse at 30% 20%,rgba(30,59,138,.06) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(20,184,166,.05) 0%,transparent 60%)",
    }}>
      <div style={{ width: "100%", maxWidth: 380 }} className="ai">
        <div className="card" style={{ overflow: "hidden", textAlign: "center" }}>

          {/* Back arrow */}
          <div style={{ padding: "16px 20px 0", display: "flex" }}>
            <button className="lnk" onClick={onBackToLogin} style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "background .18s" }}
              onMouseOver={e => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={e => (e.currentTarget.style.background = "#f1f5f9")}>
              <Icon.ArrowL s={{ width: 13, height: 13 }} />
            </button>
          </div>

          <div style={{ padding: "24px 28px 32px" }}>
            {/* Mail icon */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,rgba(30,59,138,.1),rgba(20,184,166,.1))",
              border: "2px solid rgba(30,59,138,.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 22px",
            }}>
              <Icon.Mail s={{ width: 32, height: 32, color: "#1e3b8a" }} />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 10 }}>
              Check your email
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, marginBottom: 6 }}>
              We have sent a password recovery link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>
            {email && (
              <div style={{ display: "inline-block", background: "rgba(30,59,138,.06)", border: "1px solid rgba(30,59,138,.12)", borderRadius: 8, padding: "5px 12px", marginBottom: 24 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3b8a" }}>{email}</span>
              </div>
            )}
            {!email && <div style={{ marginBottom: 24 }} />}

            {/* Open Email App */}
            <button
              onClick={openMailApp}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                background: "linear-gradient(135deg,#1e3b8a,#2a52c9)", color: "#fff",
                border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
                boxShadow: "0 6px 20px rgba(30,59,138,.28)",
                transition: "transform .14s, box-shadow .18s", marginBottom: 12,
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(30,59,138,.38)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(30,59,138,.28)"; }}
            >
              Open Email App
            </button>

            {/* Back to Login */}
            <button
              onClick={onBackToLogin}
              style={{
                width: "100%", padding: "13px", borderRadius: 12,
                background: "#fff", color: "#0f172a",
                border: "1.5px solid #dde3ed", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
                transition: "all .18s", marginBottom: 20,
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#1e3b8a"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#dde3ed"; }}
            >
              Back to Login
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 18 }} />

            {/* Resend */}
            <p style={{ fontSize: 13, color: "#94a3b8" }}>
              Didn't receive the email?{" "}
              {countdown > 0 ? (
                <span style={{ color: "#94a3b8", fontWeight: 600 }}>Resend in {countdown}s</span>
              ) : (
                <button
                  className="lnk"
                  onClick={handleResend}
                  style={{ color: "#1e3b8a", fontWeight: 700, fontSize: 13 }}
                >
                  {resent ? "Email sent ✓" : "Resend Email"}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Icon.Shield s={{ width: 12, height: 12, color: "#94a3b8" }} />
          Secure Medical Portal
        </p>
      </div>
    </div>
  );
}

/* ── Forgot Password screen ──────────────────────────────── */
export default function ForgotPassword({ onNavigate }) {
  const [email,      setEmail]      = useState("");
  const [sending,    setSending]    = useState(false);
  const [sent,       setSent]       = useState(false);
  const [error,      setError]      = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = () => {
    if (!isValidEmail) { setError("Please enter a valid email address."); return; }
    setError("");
    setSending(true);
    /* Simulate API call */
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  /* Show the "Check your email" screen after submission */
  if (sent) {
    return (
      <CheckEmailScreen
        email={email}
        onBackToLogin={() => onNavigate("login")}
        onResend={() => {
          /* In production: call real resend API */
          console.log("Resending to", email);
        }}
      />
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f3fa",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'DM Sans',sans-serif",
      backgroundImage: "radial-gradient(ellipse at 30% 20%,rgba(30,59,138,.06) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(20,184,166,.05) 0%,transparent 60%)",
    }}>
      <div style={{ width: "100%", maxWidth: 380 }} className="ai">
        <div className="card" style={{ overflow: "hidden" }}>

          {/* Logo strip */}
          <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#1e3b8a,#2a52c9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.Shield s={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
              Med<span style={{ color: "#1e3b8a" }}>Verify</span>
            </span>
          </div>

          <div style={{ padding: "22px 24px 28px" }}>
            {/* Back to login */}
            <button className="lnk" onClick={() => onNavigate("login")} style={{ display: "flex", alignItems: "center", gap: 5, color: "#1e3b8a", fontSize: 13, fontWeight: 700, marginBottom: 22 }}>
              <Icon.ArrowL s={{ width: 13, height: 13 }} />
              Back to Login
            </button>

            {/* Heading */}
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.025em", marginBottom: 10 }}>
              Forgot Password?
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, marginBottom: 24 }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Email field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Icon.Mail s={{
                  position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                  width: 15, height: 15, color: "#94a3b8", pointerEvents: "none",
                }} />
                <input
                  className="inp"
                  type="email"
                  placeholder="name@medical.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && isValidEmail && !sending && handleSend()}
                  style={error ? { borderColor: "#ef4444", background: "rgba(239,68,68,.02)" } : {}}
                />
              </div>
              {error && (
                <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12, flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!email || sending}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                background: email && !sending
                  ? "linear-gradient(135deg,#1e3b8a,#2a52c9)"
                  : "#e2e8f0",
                color: email && !sending ? "#fff" : "#94a3b8",
                border: "none", cursor: email && !sending ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: email && !sending ? "0 6px 20px rgba(30,59,138,.28)" : "none",
                transition: "all .18s",
              }}
              onMouseOver={e => { if (email && !sending) e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {sending ? (
                <>
                  <span style={{ width: 15, height: 15, border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                  Sending…
                </>
              ) : (
                <>
                  Send Reset Link
                  <Icon.ArrowR s={{ width: 15, height: 15 }} />
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding: "0 24px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>
              Having trouble?{" "}
              <button className="lnk" style={{ color: "#1e3b8a", fontWeight: 700, fontSize: 13 }}>
                Contact medical support
              </button>
            </p>
          </div>
        </div>

        {/* Footer badge */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Icon.Shield s={{ width: 12, height: 12, color: "#94a3b8" }} />
          Secure Medical Portal
        </p>
      </div>
    </div>
  );
}
