import Icon from "./Icon.jsx";

export default function Sidebar({ role, active, setPage, user, onLogout }) {
  const isLab = role === "laboratory";

  const patNav = [
    { id: "dashboard", label: "Dashboard",  icon: <Icon.Home     s={{ width: 16, height: 16 }} /> },
    { id: "records",   label: "My Records", icon: <Icon.Records  s={{ width: 16, height: 16 }} /> },
    { id: "upload",    label: "Upload",     icon: <Icon.Upload   s={{ width: 16, height: 16 }} /> },
    { id: "verify",    label: "Verify",     icon: <Icon.Shield   s={{ width: 16, height: 16 }} /> },
    { id: "wallet",    label: "Wallet",     icon: <Icon.Wallet   s={{ width: 16, height: 16 }} /> },
    { id: "settings",  label: "Settings",   icon: <Icon.Settings s={{ width: 16, height: 16 }} /> },
  ];
  const labNav = [
    { id: "dashboard", label: "Dashboard",    icon: <Icon.Home     s={{ width: 16, height: 16 }} /> },
    { id: "upload",    label: "Upload",       icon: <Icon.Upload   s={{ width: 16, height: 16 }} /> },
    { id: "history",   label: "Transactions", icon: <Icon.Records  s={{ width: 16, height: 16 }} /> },
    { id: "settings",  label: "Settings",     icon: <Icon.Settings s={{ width: 16, height: 16 }} /> },
  ];
  const nav = isLab ? labNav : patNav;

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: isLab ? "linear-gradient(135deg,#0d9488,#2a52c9)" : "linear-gradient(135deg,#1e3b8a,#2a52c9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon.Shield s={{ width: 18, height: 18, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>{isLab ? "MedChain Lab" : "HealthChain"}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>{isLab ? "Lab Portal" : "Patient Portal"}</div>
          </div>
        </div>
      </div>

      {/* User chip */}
      <div style={{ padding: "12px 12px 0" }}>
        <div style={{ background: "rgba(30,59,138,.04)", borderRadius: 11, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: isLab ? "linear-gradient(135deg,#0d9488,#14b8a6)" : "linear-gradient(135deg,#1e3b8a,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {isLab ? <Icon.Lab s={{ width: 15, height: 15, color: "#fff" }} /> : <Icon.Person s={{ width: 15, height: 15, color: "#fff" }} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: isLab ? "#0d9488" : "#14b8a6", fontWeight: 600 }}>{isLab ? "Laboratory" : "Patient"}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "14px 10px", flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".1em", padding: "0 5px", marginBottom: 6 }}>Menu</div>
        {nav.map(item => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0 10px 18px" }}>
        <div style={{ height: 1, background: "#f1f5f9", marginBottom: 8 }} />
        <button className="nav-item" onClick={onLogout} style={{ color: "#ef4444" }}>
          <Icon.Logout s={{ width: 16, height: 16 }} /> Log Out
        </button>
      </div>
    </aside>
  );
}
