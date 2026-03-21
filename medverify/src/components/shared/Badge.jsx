export default function Badge({ status }) {
  if (status === "verified") return <span className="badge-v">✦ Verified</span>;
  return <span className="badge-p">● Pending</span>;
}
