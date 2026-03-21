import Icon from "../shared/Icon.jsx";
import TopBar from "../shared/TopBar.jsx";
import RecordRow from "../shared/RecordRow.jsx";

export default function PHome({ user, setPage, records }) {
  return (
    <div>
      <TopBar title={`Welcome back, ${user.name}`} sub="Patient ID: HC-R829-X01" role="patient" />
      <div style={{ padding: "22px 26px" }}>

        {/* Wallet strip */}
        <div className="card ai" style={{ padding: "13px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(20,184,166,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon.Chain s={{ width: 14, height: 14, color: "#0d9488" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Connected Wallet</div>
              <div className="mono" style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>0x71C...4e89</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>Active</span>
          </div>
        </div>

        {/* Stats */}
        <div className="ai" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22, animationDelay: ".06s" }}>
          <div className="stat-card">
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>TOTAL RECORDS</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>{records.length}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>VERIFIED</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "#10b981", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {records.filter(r => r.status === "verified").length}
            </div>
            <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginTop: 3 }}>Secure</div>
          </div>
        </div>

        {/* Recent records */}
        <div className="ai" style={{ animationDelay: ".12s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Medical Blockchain Records</h2>
            <button className="lnk" onClick={() => setPage("records")} style={{ fontSize: 13, color: "#1e3b8a", fontWeight: 700 }}>View All →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {records.slice(0, 3).map(r => <RecordRow key={r.id} r={r} />)}
          </div>
        </div>

        {/* Upload CTA */}
        <div style={{ marginTop: 18 }}>
          <button className="btn-teal" onClick={() => setPage("upload")} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            <Icon.Plus s={{ width: 17, height: 17 }} /> Upload New Record
          </button>
        </div>
      </div>
    </div>
  );
}
