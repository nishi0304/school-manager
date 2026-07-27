import { useAuth } from "../context/AuthContext";
import StatusStamp from "../components/StatusStamp";

const CARDS = [
  { label: "Students present today", value: "—", note: "Wire to attendance collection" },
  { label: "Fees collected this month", value: "—", note: "Wire to fees collection" },
  { label: "Salaries pending", value: "—", note: "Wire to salary collection" },
  { label: "Classes today", value: "—", note: "Wire to timetable collection" },
];

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono uppercase text-ledger-navy/50">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="font-display text-3xl font-semibold text-ledger-navy mt-1">
            Welcome{profile?.name ? `, ${profile.name}` : ""}
          </h1>
        </div>
        <StatusStamp status="present">Live</StatusStamp>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CARDS.map((c) => (
          <div key={c.label} className="badge-card p-5 ml-2">
            <p className="text-3xl font-display font-semibold text-ledger-navy">{c.value}</p>
            <p className="text-sm text-ledger-navy/70 mt-1">{c.label}</p>
            <p className="text-xs text-ledger-navy/30 mt-2 font-mono">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="badge-card p-6 ml-2">
        <h2 className="font-display text-lg font-semibold text-ledger-navy mb-2">
          Next steps
        </h2>
        <ul className="text-sm text-ledger-navy/70 space-y-1.5 list-disc list-inside">
          <li>Add your Firebase project keys in <code className="font-mono">src/firebase.js</code></li>
          <li>Create a <code className="font-mono">users</code> collection with role: admin / teacher / student</li>
          <li>Try the Attendance page — it requests camera + location permission</li>
          <li>Flesh out Fees, Salary and Timetable with real Firestore reads once your data model is ready</li>
        </ul>
      </div>
    </div>
  );
}
