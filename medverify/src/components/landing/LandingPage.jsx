import Icon from "../shared/Icon.jsx";
import { LP_STATS, LP_FEATURES } from "../../data/mockData.js";

export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f6f8", fontFamily: "'DM Sans',sans-serif", color: "#0f172a" }}>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(246,246,248,.9)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon.Shield s={{ width: 25, height: 25, color: "#1e3b8a" }} />
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>Med<span style={{ color: "#1e3b8a" }}>Verify</span></span>
          </div>
          <div className="nav-lp" style={{ display: "flex", gap: 28 }}>
            {["Solutions", "Network", "Security"].map(l => (
              <a key={l} href="#" style={{ fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none" }}
                onMouseOver={e => (e.currentTarget.style.color = "#1e3b8a")}
                onMouseOut={e => (e.currentTarget.style.color = "#475569")}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <button onClick={() => onNavigate("login")}  className="btn-s" style={{ padding: "9px 17px", fontSize: 14 }}>Log In</button>
            <button onClick={() => onNavigate("signup")} className="btn-p" style={{ padding: "9px 17px", fontSize: 14 }}>Get Started</button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section style={{ padding: "68px 24px 76px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -60, width: 540, height: 540, background: "radial-gradient(circle,rgba(30,59,138,.06) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 13px", borderRadius: 999, background: "rgba(30,59,138,.08)", color: "#1e3b8a", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", width: "fit-content", animation: "fadeUp .55s .05s ease both" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1e3b8a", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} /> Blockchain Verified
              </div>
              <h1 style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.09, letterSpacing: "-0.03em", animation: "fadeUp .55s .18s ease both" }}>
                Secure &amp; <span style={{ color: "#1e3b8a" }}>Tamper-Proof</span> Medical Test Verification
              </h1>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.72, maxWidth: 460, animation: "fadeUp .55s .3s ease both" }}>
                Authenticate medical records instantly using decentralized ledger technology. Ensure absolute data integrity and patient privacy.
              </p>
              <div style={{ display: "flex", gap: 11, flexWrap: "wrap", animation: "fadeUp .55s .42s ease both" }}>
                <button onClick={() => onNavigate("signup")} className="btn-p" style={{ padding: "13px 26px" }}>
                  <Icon.Wallet s={{ width: 16, height: 16 }} /> Get Started Free
                </button>
                <button onClick={() => onNavigate("login")} className="btn-s" style={{ padding: "13px 26px" }}>
                  <span style={{ fontSize: 15 }}>🔐</span> Verify Document
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, paddingTop: 4, animation: "fadeUp .55s .52s ease both" }}>
                <div style={{ display: "flex" }}>
                  {[75, 68, 60].map((l, i) => (
                    <div key={i} style={{ width: 33, height: 33, borderRadius: "50%", border: "2.5px solid #f6f6f8", background: `hsl(220,12%,${l}%)`, marginLeft: i > 0 ? -9 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>👤</div>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Trusted by <strong style={{ color: "#0f172a" }}>10,000+</strong> Healthcare Providers</p>
              </div>
            </div>

            {/* QR Hero Card */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(30,59,138,.07)", borderRadius: 28, filter: "blur(36px)", transform: "rotate(-4deg)", pointerEvents: "none" }} />
              <div style={{ position: "relative", background: "#fff", borderRadius: 28, padding: 13, boxShadow: "0 28px 72px rgba(30,59,138,.14)", border: "1px solid #e8ecf4" }}>
                <div style={{ background: "linear-gradient(135deg,#1e3b8a 0%,#14b8a6 100%)", borderRadius: 16, aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ position: "absolute", width: `${58 + i * 22}%`, height: `${58 + i * 22}%`, borderRadius: "50%", border: "1px solid rgba(255,255,255,.18)", pointerEvents: "none" }} />)}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, position: "relative", zIndex: 1 }}>
                    {Array.from({ length: 49 }, (_, i) => {
                      const r = Math.floor(i / 7), c = i % 7;
                      const f = (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3) || (i % 3 !== 0 && i % 5 !== 0);
                      return <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: f ? "rgba(255,255,255,.88)" : "transparent" }} />;
                    })}
                  </div>
                  <div style={{ position: "absolute", bottom: 18, left: 14, right: 14, background: "rgba(255,255,255,.93)", backdropFilter: "blur(10px)", borderRadius: 14, padding: "13px 17px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
                    <div>
                      <p style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 2 }}>Network Status</p>
                      <p style={{ color: "#0f172a", fontSize: 18, fontWeight: 900 }}>100% Secure</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#14b8a6", animation: "pulse 1.3s ease-in-out infinite" }} />
                      <span style={{ color: "#14b8a6", fontSize: 13, fontWeight: 700 }}>Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: "#fff", borderTop: "1px solid #e8ecf4", borderBottom: "1px solid #e8ecf4" }}>
          <div className="stats-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {LP_STATS.map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", padding: "28px 16px", borderRight: i < 3 ? "1px solid #e8ecf4" : "none" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</p>
                <p style={{ fontSize: 33, fontWeight: 900, color: s.accent ? "#14b8a6" : "#0f172a", letterSpacing: "-0.03em" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: "76px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 48px" }}>
              <p style={{ color: "#1e3b8a", fontWeight: 700, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 11 }}>Why MedVerify</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 13 }}>Revolutionizing healthcare trust with cryptographic security.</h2>
              <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7 }}>Every medical document is authentic, verifiable, and protected against unauthorized changes.</p>
            </div>
            <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {LP_FEATURES.map(f => (
                <div key={f.title} style={{ background: "#fff", border: "1.5px solid #e8ecf4", borderRadius: 18, padding: 24, transition: "all .2s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(30,59,138,.22)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(30,59,138,.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#e8ecf4"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${f.c}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "0 24px 68px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", background: "linear-gradient(135deg,#1e3b8a 0%,#163070 100%)", borderRadius: 30, padding: "60px 44px", position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 2px 2px,rgba(255,255,255,.1) 1px,transparent 0)", backgroundSize: "38px 38px", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, maxWidth: 500, margin: "0 auto" }}>
              <h3 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", marginBottom: 13 }}>Ready to secure your medical data?</h3>
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 30 }}>Join thousands of clinics and patients already protecting their clinical records.</p>
              <div style={{ display: "flex", gap: 11, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => onNavigate("signup")} style={{ background: "#fff", color: "#1e3b8a", border: "none", cursor: "pointer", padding: "13px 30px", borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: "'DM Sans',sans-serif", transition: "all .18s" }}
                  onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Get Started Today
                </button>
                <button style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.28)", cursor: "pointer", padding: "13px 30px", borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: "'DM Sans',sans-serif", backdropFilter: "blur(8px)", transition: "all .18s" }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "42px 24px 22px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 38, marginBottom: 38 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 11 }}>
                <Icon.Shield s={{ width: 19, height: 19, color: "#1e3b8a" }} />
                <span style={{ fontSize: 15, fontWeight: 800 }}>Med<span style={{ color: "#1e3b8a" }}>Verify</span></span>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 250 }}>Empowering healthcare with blockchain-based verification systems.</p>
            </div>
            {[["Product", ["Verification API", "Patient Portal", "Clinic Management", "Security Specs"]], ["Company", ["About Us", "Careers", "Compliance", "Press Kit"]]].map(([title, links]) => (
              <div key={title}>
                <h5 style={{ fontWeight: 700, marginBottom: 13, fontSize: 13 }}>{title}</h5>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}
                      onMouseOver={e => (e.currentTarget.style.color = "#1e3b8a")}
                      onMouseOut={e => (e.currentTarget.style.color = "#64748b")}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 13, fontSize: 13 }}>Connect</h5>
              <div style={{ display: "flex", gap: 8 }}>
                {["🔗", "✉️"].map((icon, i) => (
                  <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: "50%", background: "#e8ecf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, textDecoration: "none", transition: "background .2s" }}
                    onMouseOver={e => (e.currentTarget.style.background = "#1e3b8a")}
                    onMouseOut={e => (e.currentTarget.style.background = "#e8ecf4")}>{icon}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 18, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 9 }}>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>© 2024 MedVerify Technologies Inc. All rights reserved.</p>
            <div style={{ display: "flex", gap: 18 }}>
              {["Privacy Policy", "Terms of Service"].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#475569")}
                  onMouseOut={e => (e.currentTarget.style.color = "#94a3b8")}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
