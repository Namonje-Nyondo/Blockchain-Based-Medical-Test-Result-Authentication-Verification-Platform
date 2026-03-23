import { useEffect, useState } from "react";
import Icon from "../shared/Icon.jsx";
import TopBar from "../shared/TopBar.jsx";
import { getContract } from "../../utils/contractService.js";

export default function LHome({ user, setPage }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let contractInstance = null;
    let recordRegisteredHandler = null;

    const loadTransactions = async () => {
      try {
        contractInstance = await getContract();

        const filter = contractInstance.filters.RecordRegistered();
        const events = await contractInstance.queryFilter(filter);

        const formattedTransactions = events
          .map((event) => ({
            patient: `${String(event.args.patientIdHash).slice(0, 8)}...${String(event.args.patientIdHash).slice(-4)}`,
            doc: `${String(event.args.documentHash).slice(0, 8)}...${String(event.args.documentHash).slice(-4)}`,
            time: new Date(Number(event.args.timestamp) * 1000).toLocaleString(),
            txHash: event.transactionHash,
          }))
          .reverse();

        setTransactions(formattedTransactions);

        recordRegisteredHandler = (
          recordId,
          documentHash,
          issuer,
          patientIdHash,
          metadataHash,
          timestamp,
          event
        ) => {
          const newTransaction = {
            patient: `${String(patientIdHash).slice(0, 8)}...${String(patientIdHash).slice(-4)}`,
            doc: `${String(documentHash).slice(0, 8)}...${String(documentHash).slice(-4)}`,
            time: new Date(Number(timestamp) * 1000).toLocaleString(),
            txHash: event.log.transactionHash,
          };

          setTransactions((prev) => [newTransaction, ...prev]);
        };

        contractInstance.on("RecordRegistered", recordRegisteredHandler);
      } catch (error) {
        console.error("Failed to load real transaction history:", error);
        setTransactions([]);
      }
    };

    loadTransactions();

    return () => {
      if (contractInstance && recordRegisteredHandler) {
        contractInstance.off("RecordRegistered", recordRegisteredHandler);
      }
    };
  }, []);

  return (
    <div>
      <TopBar
        title="Lab Dashboard"
        sub={`${user.name} · MedChain Lab Portal`}
        role="laboratory"
      />

      <div style={{ padding: "22px 26px" }}>
        <div
          className="ai"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 13,
            marginBottom: 22,
          }}
        >
          <div
            className="stat-card"
            style={{
              background: "linear-gradient(135deg,#1e3b8a 0%,#0d6efd 100%)",
              border: "none",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.6)",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              TOTAL VERIFIED RECORDS
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              1,284
            </div>
            <div
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255,255,255,.15)",
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>
                Immutable Storage Active
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              PENDING
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#f59e0b",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              7
            </div>
          </div>

          <div className="stat-card">
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              PATIENTS SERVED
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#1e3b8a",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              342
            </div>
          </div>
        </div>

        <div
          className="card ai"
          style={{ padding: "18px", marginBottom: 20, animationDelay: ".08s" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Secure Upload
            </div>
            <button
              className="lnk"
              onClick={() => setPage("upload")}
              style={{
                fontSize: 13,
                color: "#1e3b8a",
                fontWeight: 700,
              }}
            >
              Full Upload →
            </button>
          </div>

          <div className="drop-zone" onClick={() => setPage("upload")}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(30,59,138,.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <Icon.Upload s={{ width: 22, height: 22, color: "#1e3b8a" }} />
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 3,
              }}
            >
              Drag and drop test results
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#94a3b8",
                marginBottom: 12,
              }}
            >
              PDF, DICOM or JPG (Max 20MB)
            </div>

            <button
              className="btn-p"
              style={{ padding: "9px 20px", fontSize: 13 }}
              onClick={(e) => e.stopPropagation()}
            >
              Browse Files
            </button>
          </div>
        </div>

        <div className="ai" style={{ animationDelay: ".14s" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Transaction History
            </h2>

            <button
              className="lnk"
              onClick={() => setPage("history")}
              style={{
                fontSize: 13,
                color: "#1e3b8a",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon.Filter s={{ width: 13, height: 13 }} /> Filter
            </button>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                padding: "10px 14px",
                background: "#f8fafc",
                borderBottom: "1px solid #e8ecf4",
              }}
            >
              {["Patient ID (Hashed)", "Document Hash", "Timestamp"].map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {transactions.length === 0 ? (
              <div style={{ padding: "18px 14px", color: "#94a3b8", fontSize: 13 }}>
                No real transactions yet
              </div>
            ) : (
              transactions.map((tx, i) => (
                <div key={tx.txHash || i} className="tx-row">
                  <span className="mono">{tx.patient}</span>
                  <span className="mono">{tx.doc}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{tx.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}