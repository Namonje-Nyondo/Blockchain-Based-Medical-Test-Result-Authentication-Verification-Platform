import TopBar from "../shared/TopBar.jsx";

export default function PWallet({ user }) {
  return (
    <div>
      <TopBar title="Wallet" sub="Blockchain identity & tokens" role="patient" />
      <div style={{ padding: "22px 26px" }}>
        <div className="card ai" style={{ padding: "26px", marginBottom: 18, background: "linear-gradient(135deg,#1e3b8a,#14b8a6)", color: "#fff" }}>
          <div style={{ fontSize: 10, fontWeight: 700, opacity: .6, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Connected Wallet</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 15, color: "#fff", fontWeight: 500, marginBottom: 4 }}>0x71C4...4e89</div>
          <div style={{ fontSize: 13, opacity: .75 }}>HealthChain Network · Ethereum</div>
          <button style={{ marginTop: 18, background: "rgba(255,255,255,.2)", color: "#fff", border: "1px solid rgba(255,255,255,.3)", padding: "9px 18px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", backdropFilter: "blur(8px)" }}>
            Copy Address
          </button>
        </div>
        <div className="card ai" style={{ padding: "18px", animationDelay: ".08s" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Verification Tokens</div>
          {[["Records Verified", "18"], ["Certificates Issued", "12"], ["Sharing Permissions", "3"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
