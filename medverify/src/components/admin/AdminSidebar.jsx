import Icon from "../shared/Icon.jsx";

/* Admin-only sidebar nav */
const AdminGridIcon = ({ s }) => (
  <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const NodeIcon = ({ s }) => (
  <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
    <path d="M12 7v4M5 17l7-6M19 17l-7-6"/>
  </svg>
);
const AuditIcon = ({ s }) => (
  <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9"  x2="8" y2="9"/>
  </svg>
);
const RegistryIcon = ({ s }) => (
  <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const AnalyticsIcon = ({ s }) => (
  <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const NAV = [
  { id: "dashboard", label: "Dashboard",  Icon: AdminGridIcon  },
  { id: "analytics", label: "Analytics",  Icon: AnalyticsIcon  },
  { id: "nodes",     label: "Nodes",      Icon: NodeIcon       },
  { id: "audit",     label: "Audit Trail",Icon: AuditIcon      },
  { id: "registry",  label: "Registry",   Icon: RegistryIcon   },
  { id: "settings",  label: "Settings",   Icon: Icon.Settings  },
];

export default function AdminSidebar({ active, setPage, user, onLogout }) {
  return (
    <aside style={{
      width: 230, flexShrink: 0, background: "#0f172a",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1e3b8a,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon.Shield s={{ width: 18, height: 18, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>MedVerify</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>Admin Console</div>
          </div>
        </div>
      </div>

      {/* Admin chip */}
      <div style={{ padding: "12px 12px 0" }}>
        <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 11, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, border: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon.Shield s={{ width: 15, height: 15, color: "#fff" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 10px", flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", padding: "0 6px", marginBottom: 8 }}>Menu</div>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 13px", borderRadius: 11, width: "100%",
              background: isActive ? "rgba(255,255,255,.1)" : "transparent",
              border: isActive ? "1px solid rgba(255,255,255,.12)" : "1px solid transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,.5)",
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              fontSize: 14, fontWeight: isActive ? 700 : 500,
              transition: "all .18s", textAlign: "left", marginBottom: 2,
            }}
              onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; } }}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; } }}
            >
              <item.Icon s={{ width: 16, height: 16 }} />
              {item.label}
              {item.id === "registry" && (
                <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 20 }}>2</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0 10px 20px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,.07)", marginBottom: 10 }} />
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 13px", borderRadius: 11, width: "100%",
          background: "transparent", border: "none",
          color: "rgba(239,68,68,.7)", cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
          transition: "all .18s",
        }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,.1)"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(239,68,68,.7)"; }}
        >
          <Icon.Logout s={{ width: 16, height: 16 }} /> Log Out
        </button>
      </div>
    </aside>
  );
}
