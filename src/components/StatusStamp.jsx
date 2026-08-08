const COLORS = {
  present: "text-gy-teal",
  paid: "text-gy-teal",
  absent: "text-gy-coral",
  due: "text-gy-coral",
  pending: "text-gy-gold",
};

export default function StatusStamp({ status, children }) {
  const colorClass = COLORS[status] || "text-gy-ink";
  return <span className={`stamp ${colorClass}`}>{children}</span>;
}
