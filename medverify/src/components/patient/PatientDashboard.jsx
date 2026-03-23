import { useState } from "react";
import { useRecords } from "../../hooks/useRecords.js";
import Sidebar from "../shared/Sidebar.jsx";
import PHome from "./PHome.jsx";
import PRecords from "./PRecords.jsx";
import PUpload from "./PUpload.jsx";
import PWallet from "./PWallet.jsx";
import PSettings from "./PSettings.jsx";
import VerifyPage from "../verify/VerifyPage.jsx";

export default function PatientDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const { records, addRecord } = useRecords();

  const handleComplete = (rec) => {
    addRecord(rec);
    setPage("records");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="patient" active={page} setPage={setPage} user={user} onLogout={onLogout} />
      <div className="main-area">
        {page === "dashboard" && <PHome     user={user}  setPage={setPage} records={records} />}
        {page === "records"   && <PRecords  records={records} setPage={setPage} />}
        {page === "upload"    && <PUpload   onComplete={handleComplete} onCancel={() => setPage("dashboard")} />}
        {page === "verify"    && <VerifyPage onNavigate={setPage} embedded />}
        {page === "wallet"    && <PWallet   user={user} />}
        {page === "settings"  && <PSettings user={user} onLogout={onLogout} />}
      </div>
    </div>
  );
}
