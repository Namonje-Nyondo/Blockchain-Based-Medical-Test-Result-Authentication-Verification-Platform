import Icon from "../shared/Icon.jsx";
import NotificationBell from "../shared/NotificationPanel.jsx";

export default function AdminTopBar({ title, sub, actions }) {
  return (
    <div style={{
      background: "#fff", borderBottom: "1px solid #e8ecf4",
      padding: "14px 26px", display: "flex", alignItems: "center",
      justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10,
    }}>
      <div>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>{title}</h1>
        {sub && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {actions}
        <NotificationBell role="admin" />
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon.Shield s={{ width: 15, height: 15, color: "#fff" }} />
        </div>
      </div>
    </div>
  );
}
