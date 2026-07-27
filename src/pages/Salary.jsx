import { useState } from "react";
import StatusStamp from "../components/StatusStamp";

// Replace with a Firestore query against a `salaries` collection:
// { teacherId, name, month, baseSalary, deductions, paid }
const SAMPLE_STAFF = [
  { id: "1", name: "Meera Iyer", role: "Math Teacher", base: 42000, deductions: 0, paid: true },
  { id: "2", name: "Rohan Verma", role: "Science Teacher", base: 40000, deductions: 1500, paid: true },
  { id: "3", name: "Anjali Nair", role: "English Teacher", base: 38000, deductions: 0, paid: false },
];

export default function Salary() {
  const [staff] = useState(SAMPLE_STAFF);
  const [month, setMonth] = useState(
    new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })
  );

  const totalPayroll = staff.reduce((sum, s) => sum + (s.base - s.deductions), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-semibold text-ledger-navy">
          Salary management
        </h1>
      </div>
      <p className="text-sm text-ledger-navy/60 mb-6">
        Sample data shown — connect to a Firestore <code className="font-mono">salaries</code> collection.
      </p>

      <div className="badge-card ml-2 p-4 mb-6 max-w-xs">
        <p className="text-xs font-mono uppercase text-ledger-navy/50">Payroll — {month}</p>
        <p className="text-2xl font-display font-semibold text-ledger-navy">
          ₹{totalPayroll.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="badge-card ml-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ledger-navy text-white text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Staff</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Base</th>
              <th className="px-4 py-2.5 font-medium">Deductions</th>
              <th className="px-4 py-2.5 font-medium">Net</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t border-ledger-line">
                <td className="px-4 py-3 font-medium text-ledger-navy">{s.name}</td>
                <td className="px-4 py-3 text-ledger-navy/60">{s.role}</td>
                <td className="px-4 py-3 font-mono">₹{s.base.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 font-mono">₹{s.deductions.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 font-mono font-medium">
                  ₹{(s.base - s.deductions).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <StatusStamp status={s.paid ? "paid" : "due"}>
                    {s.paid ? "Paid" : "Pending"}
                  </StatusStamp>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
