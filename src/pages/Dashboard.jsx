import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import StatusStamp from "../components/StatusStamp";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isToday(timestamp) {
  if (!timestamp?.toDate) return false;
  const d = timestamp.toDate();
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function Dashboard() {
  const { profile } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, "attendance"), (snap) =>
        setAttendance(snap.docs.map((d) => d.data()))
      ),
      onSnapshot(collection(db, "fees"), (snap) =>
        setFees(snap.docs.map((d) => d.data()))
      ),
      onSnapshot(collection(db, "salaries"), (snap) =>
        setSalaries(snap.docs.map((d) => d.data()))
      ),
      onSnapshot(collection(db, "timetable"), (snap) =>
        setTimetable(snap.docs.map((d) => d.data()))
      ),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const presentToday = attendance.filter(
    (a) => a.role === "student" && isToday(a.timestamp)
  ).length;

  const feesCollected = fees.reduce((sum, f) => sum + (Number(f.amountPaid) || 0), 0);

  const salariesPending = salaries.filter((s) => !s.paid).length;

  const todayName = DAY_NAMES[new Date().getDay()];
  const classesToday = timetable.filter((t) => t.day === todayName).length;

  const CARDS = [
    { label: "Students present today", value: presentToday },
    { label: "Fees collected (all time)", value: `₹${feesCollected.toLocaleString("en-IN")}` },
    { label: "Salaries pending", value: salariesPending },
    { label: "Classes today", value: classesToday },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono uppercase text-gy-ink/50">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="font-display text-3xl font-semibold text-gy-ink mt-1">
            Welcome{profile?.name ? `, ${profile.name}` : ""}
          </h1>
        </div>
        <StatusStamp status="present">Live</StatusStamp>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CARDS.map((c) => (
          <div key={c.label} className="badge-card p-5 ml-2">
            <p className="text-3xl font-display font-semibold text-gy-ink">{c.value}</p>
            <p className="text-sm text-gy-ink/70 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="badge-card p-6 ml-2">
        <h2 className="font-display text-lg font-semibold text-gy-ink mb-2">
          Quick actions
        </h2>
        <p className="text-sm text-gy-ink/70">
          Use the sidebar to check in attendance, add fee records, manage salaries, or edit the
          timetable. Everything here updates live as records are added.
        </p>
      </div>
    </div>
  );
}
