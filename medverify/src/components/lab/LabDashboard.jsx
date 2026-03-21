import { useState } from "react";
import Sidebar from "../shared/Sidebar.jsx";
import LHome from "./LHome.jsx";
import LUpload from "./LUpload.jsx";
import LHistory from "./LHistory.jsx";
import LSettings from "./LSettings.jsx";

export default function LabDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="laboratory" active={page} setPage={setPage} user={user} onLogout={onLogout} />
      <div className="main-area">
        {page === "dashboard" && <LHome     user={user} setPage={setPage} />}
        {page === "upload"    && <LUpload   />}
        {page === "history"   && <LHistory  />}
        {page === "settings"  && <LSettings user={user} onLogout={onLogout} />}
      </div>
    </div>
  );
}
