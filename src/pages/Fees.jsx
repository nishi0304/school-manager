import { useState } from "react";
import StatusStamp from "../components/StatusStamp";

// Replace with a Firestore query against a `fees` collection:
// { studentId, name, class, totalDue, amountPaid, dueDate }
const SAMPLE_STUDENTS = [
  { id: "1", name: "Aarav Sharma", class: "6-A", totalDue: 24000, amountPaid: 24000 },
  { id: "2", name: "Diya Patel", class: "6-A", totalDue: 24000, amountPaid: 12000 },
  { id: "3", name: "Kabir Singh", class: "7-B", totalDue: 26000, amountPaid: 0 },
];

export default function Fees() {
  const [students] = useState(SAMPLE_STUDENTS);
  const [query, setQuery] = useState("");

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalCollected = students.reduce((sum, s) => sum + s.amountPaid, 0);
  const totalDue = students.reduce((sum, s) => sum + (s.totalDue - s.amountPaid), 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ledger-navy mb-1">
        Fees management
      </h1>
      <p className="text-sm text-ledger-navy/60 mb-6">
        Sample data shown — connect to a Firestore <code className="font-mono">fees</code> collection.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="badge-card ml-2 p-4">
          <p className="text-xs font-mono uppercase text-ledger-navy/50">Collected</p>
          <p className="text-2xl font-display font-semibold text-ledger-sage">
            ₹{totalCollected.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="badge-card ml-2 p-4">
          <p className="text-xs font-mono uppercase text-ledger-navy/50">Outstanding</p>
          <p className="text-2xl font-display font-semibold text-ledger-brick">
            ₹{totalDue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <input
        placeholder="Search student…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-ledger-line rounded px-3 py-2 text-sm mb-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-ledger-marigold"
      />

      <div className="badge-card ml-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ledger-navy text-white text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Student</th>
              <th className="px-4 py-2.5 font-medium">Class</th>
              <th className="px-4 py-2.5 font-medium">Paid</th>
              <th className="px-4 py-2.5 font-medium">Balance</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const balance = s.totalDue - s.amountPaid;
              const status = balance === 0 ? "paid" : s.amountPaid > 0 ? "pending" : "due";
              return (
                <tr key={s.id} className="border-t border-ledger-line">
                  <td className="px-4 py-3 font-medium text-ledger-navy">{s.name}</td>
                  <td className="px-4 py-3 text-ledger-navy/60">{s.class}</td>
                  <td className="px-4 py-3 font-mono">₹{s.amountPaid.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono">₹{balance.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <StatusStamp status={status}>
                      {balance === 0 ? "Paid" : s.amountPaid > 0 ? "Partial" : "Due"}
                    </StatusStamp>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
