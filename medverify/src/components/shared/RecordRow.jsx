import Icon from "./Icon.jsx";
import Badge from "./Badge.jsx";

export default function RecordRow({ r }) {
  return (
    <div className="record-row">
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(30,59,138,.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon.QR s={{ width: 18, height: 18, color: "#1e3b8a" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2, flexWrap: "wrap" }}>
          <Badge status={r.status} />
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{r.date}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 1 }}>{r.title}</div>
        <div className="mono">Hash: {r.hash}</div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button className="btn-s" style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8, gap: 4 }}>
          <Icon.Cert s={{ width: 12, height: 12 }} /> Certificate
        </button>
        <button className="btn-s" style={{ padding: "6px 10px", fontSize: 12, borderRadius: 8, gap: 4 }}>
          <Icon.View s={{ width: 12, height: 12 }} /> View
        </button>
      </div>
    </div>
  );
}
