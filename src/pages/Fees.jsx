import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import StatusStamp from "../components/StatusStamp";

export default function Fees() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query_, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    className: "",
    totalDue: "",
    amountPaid: "",
  });

  useEffect(() => {
    const q = query(collection(db, "fees"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Couldn't load fees. Check your Firebase setup.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const filtered = students.filter((s) =>
    (s.name || "").toLowerCase().includes(query_.toLowerCase())
  );

  const totalCollected = students.reduce((sum, s) => sum + (Number(s.amountPaid) || 0), 0);
  const totalDue = students.reduce(
    (sum, s) => sum + ((Number(s.totalDue) || 0) - (Number(s.amountPaid) || 0)),
    0
  );

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "fees"), {
        name: form.name.trim(),
        className: form.className.trim(),
        totalDue: Number(form.totalDue) || 0,
        amountPaid: Number(form.amountPaid) || 0,
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", className: "", totalDue: "", amountPaid: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Couldn't save. Check your Firebase setup.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-semibold text-gy-ink">
          Fees management
        </h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-gy-ink text-white rounded px-4 py-2 text-sm font-medium hover:bg-gy-inkDeep"
        >
          {showForm ? "Cancel" : "+ Add student"}
        </button>
      </div>
      <p className="text-sm text-gy-ink/60 mb-6">Live data from Firestore.</p>

      {error && (
        <p className="text-sm text-gy-coral bg-gy-coral/10 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="badge-card p-5 mb-6 max-w-xl">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Student name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Class
              </label>
              <input
                required
                placeholder="e.g. 6-A"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Total fee due (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.totalDue}
                onChange={(e) => setForm({ ...form, totalDue: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Amount already paid (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.amountPaid}
                onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gy-teal text-white rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save student"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="badge-card p-4">
          <p className="text-xs font-mono uppercase text-gy-ink/50">Collected</p>
          <p className="text-2xl font-display font-semibold text-gy-teal">
            ₹{totalCollected.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="badge-card p-4">
          <p className="text-xs font-mono uppercase text-gy-ink/50">Outstanding</p>
          <p className="text-2xl font-display font-semibold text-gy-coral">
            ₹{totalDue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <input
        placeholder="Search student…"
        value={query_}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gy-line rounded px-3 py-2 text-sm mb-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-gy-gold"
      />

      <div className="badge-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gy-ink text-white text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Student</th>
              <th className="px-4 py-2.5 font-medium">Class</th>
              <th className="px-4 py-2.5 font-medium">Paid</th>
              <th className="px-4 py-2.5 font-medium">Balance</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gy-ink/40">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gy-ink/40">
                  No students yet — click "+ Add student" to get started.
                </td>
              </tr>
            )}
            {filtered.map((s) => {
              const paid = Number(s.amountPaid) || 0;
              const due = Number(s.totalDue) || 0;
              const balance = due - paid;
              const status = balance <= 0 ? "paid" : paid > 0 ? "pending" : "due";
              return (
                <tr key={s.id} className="border-t border-gy-line">
                  <td className="px-4 py-3 font-medium text-gy-ink">{s.name}</td>
                  <td className="px-4 py-3 text-gy-ink/60">{s.className}</td>
                  <td className="px-4 py-3 font-mono">₹{paid.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono">₹{balance.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <StatusStamp status={status}>
                      {balance <= 0 ? "Paid" : paid > 0 ? "Partial" : "Due"}
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
