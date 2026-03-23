import Icon from "../shared/Icon.jsx";
import TopBar from "../shared/TopBar.jsx";
import { LAB_TX } from "../../data/mockData.js";

export default function LHistory() {
  return (
    <div>
      <TopBar title="Transaction History" sub="All blockchain submissions" role="laboratory" />
      <div style={{ padding: "22px 26px" }}>
        <div className="card ai" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 16px", borderBottom: "1px solid #e8ecf4" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>All Records</div>
            <button className="btn-s" style={{ padding: "8px 13px", fontSize: 13 }}>
              <Icon.Filter s={{ width: 13, height: 13 }} /> Filter
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "10px 14px", background: "#f8fafc", borderBottom: "1px solid #e8ecf4" }}>
            {["Patient ID (Hashed)", "Document Hash", "Timestamp"].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".07em" }}>{h}</div>
            ))}
          </div>
          {[...LAB_TX, ...LAB_TX].map((tx, i) => (
            <div key={i} className="tx-row">
              <span className="mono">{tx.patient}</span>
              <span className="mono">{tx.doc}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{tx.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
