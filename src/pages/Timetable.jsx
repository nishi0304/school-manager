import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PERIODS = ["9:00", "9:45", "10:30", "11:30", "12:15", "1:30", "2:15"];

// Replace with a Firestore query against a `timetable` collection:
// { classId, day, period, subject, teacher, room }
const SAMPLE = {
  Mon: ["Math", "English", "Science", "Break", "History", "Art", "PE"],
  Tue: ["Science", "Math", "English", "Break", "Geography", "Music", "Library"],
  Wed: ["English", "Science", "Math", "Break", "Art", "History", "PE"],
  Thu: ["Math", "PE", "Science", "Break", "English", "Geography", "Art"],
  Fri: ["History", "Math", "English", "Break", "Science", "Music", "Library"],
  Sat: ["Art", "Sports", "Assembly", "Break", "-", "-", "-"],
};

export default function Timetable() {
  const [selectedClass, setSelectedClass] = useState("6-A");

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-semibold text-ledger-navy">Timetable</h1>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-ledger-line rounded px-3 py-1.5 text-sm bg-white"
        >
          {["6-A", "6-B", "7-A", "7-B"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <p className="text-sm text-ledger-navy/60 mb-6">
        Sample schedule for class {selectedClass} — connect to a Firestore{" "}
        <code className="font-mono">timetable</code> collection.
      </p>

      <div className="badge-card ml-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ledger-navy text-white">
            <tr>
              <th className="px-3 py-2.5 text-left font-mono text-xs">Time</th>
              {DAYS.map((d) => (
                <th key={d} className="px-3 py-2.5 text-left font-medium">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, i) => (
              <tr key={period} className="border-t border-ledger-line">
                <td className="px-3 py-2.5 font-mono text-xs text-ledger-navy/50">{period}</td>
                {DAYS.map((d) => {
                  const subject = SAMPLE[d][i];
                  const isBreak = subject === "Break";
                  return (
                    <td
                      key={d}
                      className={`px-3 py-2.5 ${
                        isBreak
                          ? "text-ledger-navy/30 italic"
                          : "text-ledger-navy font-medium"
                      }`}
                    >
                      {subject}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
