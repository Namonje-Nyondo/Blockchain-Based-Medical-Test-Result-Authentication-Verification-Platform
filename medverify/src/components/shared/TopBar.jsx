import Icon from "./Icon.jsx";
import NotificationBell from "./NotificationPanel.jsx";

export default function TopBar({ title, sub, role }) {
  const isLab = role === "laboratory";
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf4", padding: "15px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
      <div>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>{title}</h1>
        {sub && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <NotificationBell role={role} />
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: isLab ? "linear-gradient(135deg,#0d9488,#2a52c9)" : "linear-gradient(135deg,#1e3b8a,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isLab ? <Icon.Lab s={{ width: 15, height: 15, color: "#fff" }} /> : <Icon.Person s={{ width: 15, height: 15, color: "#fff" }} />}
        </div>
      </div>
    </div>
  );
}
