export default function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 46, height: 26, borderRadius: 13, cursor: "pointer",
        background: on ? "linear-gradient(135deg,#1e3b8a,#14b8a6)" : "#d1d5db",
        position: "relative", transition: "background .25s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 23 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,.2)",
        transition: "left .22s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}
