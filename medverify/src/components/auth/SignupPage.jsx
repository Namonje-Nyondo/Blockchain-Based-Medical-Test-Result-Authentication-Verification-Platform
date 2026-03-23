import { useState } from "react";
import Icon from "../shared/Icon.jsx";

export default function SignupPage({ onNavigate, onLogin }) {
  const [type, setType]     = useState("patient");
  const [showPass, setSP]   = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ minHeight: "100vh", background: "#f0f3fa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif", backgroundImage: "radial-gradient(ellipse at 70% 10%,rgba(20,184,166,.07) 0%,transparent 60%),radial-gradient(ellipse at 20% 90%,rgba(30,59,138,.06) 0%,transparent 60%)" }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="ai">
        <div className="card" style={{ overflow: "hidden" }}>

          {/* Top bar */}
          <div style={{ padding: "15px 17px 13px", display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
            <button className="lnk" onClick={() => onNavigate("login")} style={{ width: 29, height: 29, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}
              onMouseOver={e => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={e => (e.currentTarget.style.background = "#f1f5f9")}>
              <Icon.ArrowL s={{ width: 13, height: 13 }} />
            </button>
            <div style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Join HealthChain</div>
            <div style={{ width: 29 }} />
          </div>

          {/* Hero banner */}
          <div style={{ height: 100, position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0f2d5e 0%,#0e6e6e 50%,#14b8a6 100%)", backgroundSize: "200% 200%", animation: "gradShift 7s ease infinite" }}>
            {Array.from({ length: 22 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%", background: "rgba(255,255,255,.22)", left: `${(i / 22) * 100}%`, top: `${(i % 5) * 20 + 10}%`, animation: `float ${2 + (i % 3) * .6}s ${(i % 4) * .3}s ease-in-out infinite` }} />
            ))}
          </div>

          <div style={{ padding: "20px 20px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 21, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.025em", marginBottom: 4 }}>Create your Account</h2>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>Secure your medical data on the blockchain.</p>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1e3b8a", letterSpacing: ".12em", textTransform: "uppercase", textAlign: "center", marginBottom: 8 }}>Select Account Type</p>
              <div style={{ display: "flex", gap: 9 }}>
                {[{ id: "patient", label: "Patient", icon: <Icon.Person s={{ width: 21, height: 21 }} /> }, { id: "laboratory", label: "Laboratory", icon: <Icon.Lab s={{ width: 21, height: 21 }} /> }].map(t => (
                  <button key={t.id} className={`type-btn ${type === t.id ? "sel" : ""}`} onClick={() => setType(t.id)}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 7, padding: "7px 10px", background: type === "patient" ? "rgba(30,59,138,.05)" : "rgba(13,148,136,.05)", borderRadius: 8, border: `1px solid ${type === "patient" ? "rgba(30,59,138,.1)" : "rgba(13,148,136,.1)"}` }}>
                <p style={{ fontSize: 12, color: type === "patient" ? "#1e3b8a" : "#0d9488", fontWeight: 600 }}>
                  {type === "patient" ? "🏥 Access your personal health records, test results & certificates" : "🔬 Upload certified test results & manage patient submissions"}
                </p>
              </div>
            </div>

            {/* Fields */}
            {[["Full Name", "name", "text", "John Doe"], ["Email Address", "email", "email", "name@example.com"]].map(([lbl, key, typ, ph]) => (
              <div key={key} style={{ marginBottom: 11 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{lbl}</label>
                <div style={{ position: "relative" }}>
                  {key === "name"
                    ? <Icon.User s={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8", pointerEvents: "none" }} />
                    : <Icon.Mail s={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8", pointerEvents: "none" }} />}
                  <input className="inp" type={typ} placeholder={ph} value={form[key]} onChange={set(key)} />
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Icon.Lock s={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8", pointerEvents: "none" }} />
                <input className="inp" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={set("password")} style={{ paddingRight: 40 }} />
                <button className="lnk" onClick={() => setSP(v => !v)} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", padding: 2 }}>
                  <Icon.Eye s={{ width: 15, height: 15 }} off={showPass} />
                </button>
              </div>
            </div>

            {/* Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginBottom: 16 }}>
              <div onClick={() => setAgreed(v => !v)} style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2, border: agreed ? "none" : "1.5px solid #dde3ed", background: agreed ? "#1e3b8a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s", cursor: "pointer" }}>
                {agreed && <svg viewBox="0 0 12 12" fill="none" style={{ width: 9 }}><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                I agree to the <span style={{ color: "#1e3b8a", fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: "#1e3b8a", fontWeight: 600 }}>Privacy Policy</span>.
              </span>
            </label>

            <button className="btn-p" style={{ width: "100%" }} disabled={!agreed || !form.name || !form.email}
              onClick={() => onLogin({ name: form.name, email: form.email, role: type })}>
              Create Account <Icon.ArrowR s={{ width: 14, height: 14 }} />
            </button>

            <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#64748b" }}>
              Already have an account?{" "}
              <button className="lnk" onClick={() => onNavigate("login")} style={{ color: "#1e3b8a", fontWeight: 700, fontSize: 13 }}>Sign in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
