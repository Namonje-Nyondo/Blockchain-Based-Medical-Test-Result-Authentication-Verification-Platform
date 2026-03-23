export const PATIENT_RECORDS = [
  { id: 1, title: "Blood Analysis Report",       status: "verified", date: "Oct 24, 2023", hash: "0f60...8362", type: "Blood Test"  },
  { id: 2, title: "COVID-19 Vaccination Record", status: "pending",  date: "Nov 2, 2023",  hash: "c220...b269", type: "Vaccination" },
  { id: 3, title: "MRI Scan – Lumbar Spine",     status: "verified", date: "Sep 12, 2023", hash: "4a1e...99c2", type: "Imaging"     },
  { id: 4, title: "Cholesterol Panel",           status: "verified", date: "Aug 5, 2023",  hash: "7d3a...f120", type: "Blood Test"  },
];

export const LAB_TX = [
  { patient: "0xBf3...a21", doc: "e4f7...1c3a", time: "Oct 24, 2:14 PM"  },
  { patient: "0xA9d...b77", doc: "9c2a...8b4f", time: "Oct 23, 11:02 AM" },
  { patient: "0xC1e...d43", doc: "3f5b...0d92", time: "Oct 22, 4:55 PM"  },
  { patient: "0xD8f...e09", doc: "1a8c...7e61", time: "Oct 21, 9:30 AM"  },
];

export const RECORD_TYPES = [
  { id: "blood",   label: "Blood Test",     icon: "🩸" },
  { id: "imaging", label: "Imaging / MRI",  icon: "🫁" },
  { id: "vaccine", label: "Vaccination",    icon: "💉" },
  { id: "report",  label: "Medical Report", icon: "📋" },
  { id: "dental",  label: "Dental",         icon: "🦷" },
  { id: "other",   label: "Other",          icon: "📄" },
];

export const LP_STATS = [
  { label: "Verified Results", value: "1.2M+"              },
  { label: "Network Nodes",    value: "850+"               },
  { label: "Verify Speed",     value: "< 1.5s"             },
  { label: "Uptime",           value: "99.9%", accent: true },
];

export const LP_FEATURES = [
  { icon: "🔒", title: "Tamper-proof",       desc: "Once a record is cryptographically hashed on the blockchain, it becomes permanent and impossible to alter.", c: "#1e3b8a" },
  { icon: "⚡", title: "Instant Verify",     desc: "Automated validation allows any authorized party to verify document authenticity in milliseconds.",          c: "#14b8a6" },
  { icon: "📜", title: "Immutable Audit",    desc: "Maintain a complete, time-stamped history of every document interaction for perfect compliance.",             c: "#1e3b8a" },
  { icon: "🌐", title: "Decentralized",      desc: "No single point of failure. Distributed network ensures high availability and sovereign data control.",        c: "#14b8a6" },
];

/* ── Admin Mock Data ──────────────────────────────────────── */
export const AUDIT_TRANSACTIONS = [
  { hash: "0x4a2c...9e81", lab: "Northpoint Labs",    labCode: "NL", action: "RECORD_CERTIFIED",  status: "confirmed", time: "Oct 24, 2:14 PM",  block: "19,482,310" },
  { hash: "0x8f11...3b22", lab: "City Diagnostics",   labCode: "CD", action: "RECORD_UPLOADED",   status: "confirmed", time: "Oct 24, 11:02 AM", block: "19,482,271" },
  { hash: "0x1d44...7c80", lab: "Peak Health Inst.",  labCode: "PH", action: "LAB_REGISTERED",    status: "confirmed", time: "Oct 23, 4:55 PM",  block: "19,482,188" },
  { hash: "0x55e8...118a", lab: "Unity Lab Group",    labCode: "UL", action: "RECORD_CERTIFIED",  status: "confirmed", time: "Oct 23, 1:30 PM",  block: "19,482,102" },
  { hash: "0xa2e1...bb89", lab: "Northpoint Labs",    labCode: "NL", action: "RECORD_REVOKED",    status: "failed",    time: "Oct 22, 9:14 AM",  block: "19,481,990" },
  { hash: "0xc3d7...44f1", lab: "BioPath Central",    labCode: "BC", action: "RECORD_CERTIFIED",  status: "confirmed", time: "Oct 22, 8:05 AM",  block: "19,481,944" },
  { hash: "0xe9a3...22c5", lab: "Quantum Genetics",   labCode: "QG", action: "LAB_SUSPENDED",     status: "pending",   time: "Oct 21, 5:48 PM",  block: "19,481,802" },
  { hash: "0xf012...77bd", lab: "Northside Diag.",    labCode: "ND", action: "RECORD_UPLOADED",   status: "confirmed", time: "Oct 21, 3:22 PM",  block: "19,481,755" },
  { hash: "0x7b5c...a39e", lab: "City Diagnostics",   labCode: "CD", action: "RECORD_CERTIFIED",  status: "confirmed", time: "Oct 20, 12:10 PM", block: "19,481,620" },
  { hash: "0x2f8d...cc14", lab: "Peak Health Inst.",  labCode: "PH", action: "RECORD_CERTIFIED",  status: "confirmed", time: "Oct 20, 9:55 AM",  block: "19,481,511" },
];

export const REGISTERED_LABS = [
  { id: "LAB-29304", name: "BioPath Central Lab",    location: "San Francisco, CA", status: "active",    joined: "Oct 12, 2023", score: "68/93", initials: "BC", color: "#1e3b8a", records: 412 },
  { id: "LAB-11928", name: "Quantum Genetics",       location: "Austin, TX",        status: "pending",   joined: "Oct 8, 2023",  score: "—",    initials: "QG", color: "#f59e0b", records: 0,   note: "Under Review — Submitted 2 days ago" },
  { id: "LAB-06041", name: "Northside Diagnostics",  location: "Chicago, IL",       status: "suspended", joined: "Sep 3, 2023",  score: "22/93", initials: "ND", color: "#ef4444", records: 87  },
  { id: "LAB-03821", name: "Northpoint Labs",        location: "Seattle, WA",       status: "active",    joined: "Aug 18, 2023", score: "91/93", initials: "NL", color: "#10b981", records: 634 },
  { id: "LAB-07712", name: "City Diagnostics",       location: "New York, NY",      status: "active",    joined: "Jul 29, 2023", score: "77/93", initials: "CD", color: "#2a52c9", records: 289 },
  { id: "LAB-09934", name: "Unity Lab Group",        location: "Houston, TX",       status: "active",    joined: "Jul 5, 2023",  score: "83/93", initials: "UL", color: "#7c3aed", records: 178 },
  { id: "LAB-14421", name: "Peak Health Institute",  location: "Denver, CO",        status: "pending",   joined: "Oct 15, 2023", score: "—",    initials: "PH", color: "#f59e0b", records: 0,   note: "Under Review — Submitted 1 day ago" },
];

export const ADMIN_STATS = [
  { label: "Total Labs",         value: "7",      sub: "+2 this month",  color: "#1e3b8a" },
  { label: "Active Labs",        value: "4",      sub: "57% of total",   color: "#10b981" },
  { label: "Total Transactions", value: "2,482",  sub: "+148 today",     color: "#2a52c9" },
  { label: "Pending Reviews",    value: "2",      sub: "Requires action",color: "#f59e0b" },
];

export const NETWORK_NODES = [
  { id: "NODE-001", region: "US-East",    ip: "192.168.1.101", status: "online",  latency: "12ms",  blocks: "19,482,310" },
  { id: "NODE-002", region: "US-West",    ip: "192.168.1.102", status: "online",  latency: "18ms",  blocks: "19,482,308" },
  { id: "NODE-003", region: "EU-Central", ip: "192.168.1.103", status: "online",  latency: "45ms",  blocks: "19,482,305" },
  { id: "NODE-004", region: "EU-West",    ip: "192.168.1.104", status: "online",  latency: "52ms",  blocks: "19,482,301" },
  { id: "NODE-005", region: "Asia-East",  ip: "192.168.1.105", status: "offline", latency: "—",     blocks: "19,481,990" },
  { id: "NODE-006", region: "Asia-South", ip: "192.168.1.106", status: "syncing", latency: "78ms",  blocks: "19,482,210" },
];

/* ── Analytics Mock Data ──────────────────────────────────── */
export const GAS_PRICE_SERIES = [
  18, 22, 20, 25, 30, 28, 24, 20, 19, 22, 26, 35,
  42, 38, 32, 29, 31, 36, 40, 44, 42, 38, 34, 30,
];

export const ANALYTICS_KPIS = [
  { label: "Total Daily Gas Usage",   value: "145.2 Gwei", change: "-5.2%",  up: false, icon: "⛽", color: "#1e3b8a", tag: null       },
  { label: "Avg. Confirmation Time",  value: "12.4s",      change: "+0.8%",  up: true,  icon: "⏱",  color: "#0d9488", tag: null       },
  { label: "Active Network Nodes",    value: "1,284",      change: null,     up: null,  icon: "🌐", color: "#2a52c9", tag: "Optimal"  },
  { label: "Success Rate",            value: "99.98%",     change: null,     up: null,  icon: "✅", color: "#10b981", tag: "Stable"   },
];

export const TOP_GAS_LABS = [
  { name: "BioHealth Solutions",  initials: "BH", color: "#1e3b8a", gwei: "42.5 Gwei", change: "+16%", up: true  },
  { name: "Pathology Labs Inc.",  initials: "PL", color: "#2a52c9", gwei: "31.2 Gwei", change: "+4%",  up: true  },
  { name: "Unity Lab Group",      initials: "UL", color: "#7c3aed", gwei: "28.7 Gwei", change: "-2%",  up: false },
  { name: "City Diagnostics",     initials: "CD", color: "#0d9488", gwei: "19.4 Gwei", change: "+8%",  up: true  },
];
