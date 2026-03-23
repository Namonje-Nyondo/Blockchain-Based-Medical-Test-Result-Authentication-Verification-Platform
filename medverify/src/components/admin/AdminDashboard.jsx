import { useState } from "react";
import AdminSidebar    from "./AdminSidebar.jsx";
import AdminHome       from "./AdminHome.jsx";
import AdminNodes      from "./AdminNodes.jsx";
import AuditTrail      from "./AuditTrail.jsx";
import LabRegistry     from "./LabRegistry.jsx";
import AdminSettings   from "./AdminSettings.jsx";
import AdminAnalytics  from "./AdminAnalytics.jsx";

export default function AdminDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar active={page} setPage={setPage} user={user} onLogout={onLogout} />
      <div style={{ flex: 1, overflow: "auto", background: "#f4f6fb", minHeight: "100vh" }}>
        {page === "dashboard" && <AdminHome      setPage={setPage} />}
        {page === "analytics" && <AdminAnalytics />}
        {page === "nodes"     && <AdminNodes     />}
        {page === "audit"     && <AuditTrail     />}
        {page === "registry"  && <LabRegistry    />}
        {page === "settings"  && <AdminSettings  user={user} onLogout={onLogout} />}
      </div>
    </div>
  );
}
