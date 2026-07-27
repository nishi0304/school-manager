const COLORS = {
  present: "text-ledger-sage",
  paid: "text-ledger-sage",
  absent: "text-ledger-brick",
  due: "text-ledger-brick",
  pending: "text-ledger-marigold",
};

export default function StatusStamp({ status, children }) {
  const colorClass = COLORS[status] || "text-ledger-navy";
  return <span className={`stamp ${colorClass}`}>{children}</span>;
}
