import Icon from "../shared/Icon.jsx";
import TopBar from "../shared/TopBar.jsx";
import RecordRow from "../shared/RecordRow.jsx";

export default function PRecords({ records, setPage }) {
  return (
    <div>
      <TopBar title="My Records" sub="All medical documents on the blockchain" role="patient" />
      <div style={{ padding: "22px 26px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <button className="btn-teal" onClick={() => setPage("upload")} style={{ padding: "10px 18px", fontSize: 13 }}>
            <Icon.Plus s={{ width: 15, height: 15 }} /> Upload Record
          </button>
        </div>
        <div className="ai" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {records.map(r => <RecordRow key={r.id} r={r} />)}
        </div>
      </div>
    </div>
  );
}
