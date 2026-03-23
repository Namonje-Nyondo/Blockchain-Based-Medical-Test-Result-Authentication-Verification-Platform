import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/* ── Error Boundary — catches any runtime crash ─────────────── *
 * Shows a helpful message instead of a blank white screen.      */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    const msg = this.state.error?.message || "Unknown error";
    const needsInstall = msg.toLowerCase().includes("ethers") ||
                         msg.toLowerCase().includes("npm install") ||
                         msg.toLowerCase().includes("failed to fetch");
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#f0f3fa",
        fontFamily: "'DM Sans', sans-serif", padding: 24,
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "36px 32px",
          maxWidth: 480, width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,.1)",
          border: "1px solid #e8ecf4",
        }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(239,68,68,.1)", margin: "0 auto 20px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"
              style={{ width: 28, height: 28 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            {needsInstall ? "Setup Required" : "Something went wrong"}
          </h1>

          {needsInstall ? (
            <>
              <p style={{ fontSize: 14, color: "#64748b", textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
                The <strong>ethers.js</strong> package is not installed yet. Run this command in your terminal inside the <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}>medverify</code> folder:
              </p>
              <div style={{
                background: "#0f172a", borderRadius: 10, padding: "14px 18px",
                fontFamily: "monospace", fontSize: 15, color: "#7dd3fc",
                textAlign: "center", marginBottom: 20, letterSpacing: ".02em",
              }}>
                npm install
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginBottom: 20 }}>
                After it finishes, refresh this page.
              </p>
            </>
          ) : (
            <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.6, marginBottom: 20, fontFamily: "monospace", background: "#f8fafc", padding: 12, borderRadius: 8, wordBreak: "break-all" }}>
              {msg}
            </p>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{
              width: "100%", padding: "13px", borderRadius: 12,
              background: "linear-gradient(135deg,#1e3b8a,#2a52c9)", color: "#fff",
              border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

