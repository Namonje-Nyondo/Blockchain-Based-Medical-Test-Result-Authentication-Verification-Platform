import Toggle from "./Toggle.jsx";

export default function SettingsRow({ iconBg, icon, title, sub, toggle, toggleOn, onToggle, chevron }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 20px", cursor: chevron ? "pointer" : "default",
        transition: "background .15s",
      }}
      onMouseOver={e => { if (chevron) e.currentTarget.style.background = "#f8fafc"; }}
      onMouseOut={e => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: iconBg || "rgba(20,184,166,.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
      </div>
      {toggle && <Toggle on={toggleOn} onChange={onToggle} />}
      {chevron && (
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ width: 16, height: 16, flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </div>
  );
}
