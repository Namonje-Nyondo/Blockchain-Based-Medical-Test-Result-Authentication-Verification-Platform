import { useState, useEffect, useRef } from "react";
import Icon from "./Icon.jsx";

/* ── Per-role notification data ─────────────────────────────── */
const NOTIFICATIONS = {
  patient: [
    { id: 1, type: "verified",  icon: "✦", color: "#10b981", bg: "rgba(16,185,129,.1)",  title: "Record Verified",          body: "Your Blood Analysis Report has been verified on HealthChain.", time: "2 min ago",  read: false },
    { id: 2, type: "pending",   icon: "●", color: "#f59e0b", bg: "rgba(245,158,11,.1)",  title: "Pending Verification",     body: "COVID-19 Vaccination Record is awaiting lab countersignature.", time: "1 hr ago",   read: false },
    { id: 3, type: "share",     icon: "↗", color: "#1e3b8a", bg: "rgba(30,59,138,.1)",   title: "Record Shared",            body: "Dr. Rivera accessed your MRI Scan – Lumbar Spine.",            time: "3 hrs ago",  read: true  },
    { id: 4, type: "upload",    icon: "↑", color: "#2a52c9", bg: "rgba(42,82,201,.1)",   title: "Upload Complete",          body: "Cholesterol Panel has been anchored to the blockchain.",       time: "Yesterday",  read: true  },
    { id: 5, type: "system",    icon: "i", color: "#64748b", bg: "rgba(100,116,139,.1)", title: "Wallet Connected",         body: "Your wallet 0x71C…4e89 is active on HealthChain Mainnet.",     time: "2 days ago", read: true  },
  ],
  laboratory: [
    { id: 1, type: "new",       icon: "↓", color: "#1e3b8a", bg: "rgba(30,59,138,.1)",   title: "New Test Request",         body: "Patient 0xBf3…a21 has submitted a Blood Test for certification.", time: "5 min ago",  read: false },
    { id: 2, type: "new",       icon: "↓", color: "#1e3b8a", bg: "rgba(30,59,138,.1)",   title: "New Test Request",         body: "Patient 0xA9d…b77 has submitted an Imaging result.",            time: "22 min ago", read: false },
    { id: 3, type: "verified",  icon: "✦", color: "#10b981", bg: "rgba(16,185,129,.1)",  title: "Certification Successful", body: "Record e4f7…1c3a has been anchored to the blockchain.",         time: "1 hr ago",   read: true  },
    { id: 4, type: "system",    icon: "i", color: "#0d9488", bg: "rgba(13,148,136,.1)",  title: "Network Sync Complete",    body: "All pending records synced with HealthChain Mainnet.",          time: "3 hrs ago",  read: true  },
    { id: 5, type: "alert",     icon: "!", color: "#f59e0b", bg: "rgba(245,158,11,.1)",  title: "Submission Limit",         body: "You are approaching your monthly submission quota (92%).",      time: "Yesterday",  read: true  },
  ],
  admin: [
    { id: 1, type: "pending",   icon: "!", color: "#f59e0b", bg: "rgba(245,158,11,.1)",  title: "2 Labs Awaiting Approval", body: "Quantum Genetics and Peak Health Institute need review.",        time: "10 min ago", read: false },
    { id: 2, type: "alert",     icon: "⚠", color: "#ef4444", bg: "rgba(239,68,68,.1)",   title: "Node Offline",             body: "NODE-005 (Asia-East) has gone offline. Check network health.",   time: "34 min ago", read: false },
    { id: 3, type: "verified",  icon: "✦", color: "#10b981", bg: "rgba(16,185,129,.1)",  title: "Lab Approved",             body: "BioPath Central Lab has been activated on HealthChain.",        time: "2 hrs ago",  read: true  },
    { id: 4, type: "system",    icon: "i", color: "#1e3b8a", bg: "rgba(30,59,138,.1)",   title: "Audit Export Ready",       body: "The October audit CSV export has been generated.",              time: "5 hrs ago",  read: true  },
    { id: 5, type: "alert",     icon: "⚠", color: "#ef4444", bg: "rgba(239,68,68,.1)",   title: "Suspicious Transaction",   body: "Unusual activity detected from 0xa2e1…bb89. Review advised.",   time: "Yesterday",  read: true  },
  ],
};

export default function NotificationBell({ role = "patient" }) {
  const [open,  setOpen]  = useState(false);
  const [notes, setNotes] = useState(NOTIFICATIONS[role] || NOTIFICATIONS.patient);
  const ref = useRef(null);

  const unread = notes.filter(n => !n.read).length;

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead  = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll   = ()   => setNotes(prev => prev.map(n => ({ ...n, read: true })));
  const clearNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  const accentColor = role === "admin" ? "#f59e0b" : "#ef4444";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        className="lnk"
        onClick={() => setOpen(v => !v)}
        style={{ position: "relative", padding: 5, transition: "transform .15s" }}
        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Icon.Bell s={{ width: 19, height: 19, color: open ? "#0f172a" : "#64748b" }} />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 1, right: 1,
            minWidth: 16, height: 16, borderRadius: 99,
            background: accentColor, border: "2px solid #fff",
            fontSize: 9, fontWeight: 800, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px",
          }}>
            {unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 340, background: "#fff", borderRadius: 16,
          boxShadow: "0 16px 48px rgba(0,0,0,.16), 0 4px 12px rgba(0,0,0,.06)",
          border: "1px solid #e8ecf4", zIndex: 200,
          animation: "cardIn .22s cubic-bezier(.22,1,.36,1) both",
          overflow: "hidden",
        }}>
          {/* Panel header */}
          <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Notifications</span>
              {unread > 0 && (
                <span style={{ marginLeft: 8, background: accentColor, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button className="lnk" onClick={markAll} style={{ fontSize: 12, color: "#1e3b8a", fontWeight: 700 }}>
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {notes.length === 0 ? (
              <div style={{ padding: "36px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🔔</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>All caught up!</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>No notifications right now.</div>
              </div>
            ) : (
              notes.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 11,
                    padding: "12px 16px",
                    background: n.read ? "transparent" : "rgba(30,59,138,.025)",
                    borderBottom: "1px solid #f8fafc",
                    cursor: "pointer", transition: "background .15s",
                    position: "relative",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseOut={e => (e.currentTarget.style.background = n.read ? "transparent" : "rgba(30,59,138,.025)")}
                >
                  {/* Unread dot */}
                  {!n.read && (
                    <span style={{ position: "absolute", top: 16, right: 14, width: 7, height: 7, borderRadius: "50%", background: accentColor }} />
                  )}

                  {/* Icon */}
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800, color: n.color }}>
                    {n.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 600 : 800, color: "#0f172a", marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4, marginBottom: 4 }}>{n.body}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{n.time}</div>
                  </div>

                  {/* Dismiss */}
                  <button
                    className="lnk"
                    onClick={e => { e.stopPropagation(); clearNote(n.id); }}
                    style={{ color: "#cbd5e1", padding: 2, flexShrink: 0, marginTop: 1, opacity: 0, transition: "opacity .15s" }}
                    onMouseOver={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = "0"; e.currentTarget.style.color = "#cbd5e1"; }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 13, height: 13 }}>
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notes.length > 0 && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="lnk" onClick={() => setNotes([])} style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                Clear all
              </button>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                {notes.filter(n => n.read).length} read · {unread} unread
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
