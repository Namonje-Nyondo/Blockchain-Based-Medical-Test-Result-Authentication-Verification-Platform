import Icon from "./Icon.jsx";

const STEPS = ["Upload File", "Record Details", "Review & Submit"];

export default function StepIndicator({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 28 }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < step ? "#10b981" : i === step ? "linear-gradient(135deg,#1e3b8a,#2a52c9)" : "#e8ecf4",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .3s",
              boxShadow: i === step ? "0 4px 12px rgba(30,59,138,.3)" : "none",
            }}>
              {i < step
                ? <Icon.Check s={{ width: 15, height: 15, color: "#fff" }} />
                : <span style={{ fontSize: 13, fontWeight: 800, color: i === step ? "#fff" : "#94a3b8" }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: i <= step ? "#0f172a" : "#94a3b8", whiteSpace: "nowrap", letterSpacing: ".04em" }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 56, height: 2, background: i < step ? "#10b981" : "#e8ecf4", margin: "0 6px", marginBottom: 22, borderRadius: 2, transition: "background .3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}
