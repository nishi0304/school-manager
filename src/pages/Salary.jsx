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

export default function Salary() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "",
    base: "",
    deductions: "",
    paid: false,
  });

  useEffect(() => {
    const q = query(collection(db, "salaries"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setStaff(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Couldn't load salaries. Check your Firebase setup.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const totalPayroll = staff.reduce(
    (sum, s) => sum + ((Number(s.base) || 0) - (Number(s.deductions) || 0)),
    0
  );

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "salaries"), {
        name: form.name.trim(),
        role: form.role.trim(),
        base: Number(form.base) || 0,
        deductions: Number(form.deductions) || 0,
        paid: form.paid,
        month: new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", role: "", base: "", deductions: "", paid: false });
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
        <h1 className="font-display text-3xl font-semibold text-ledger-navy">
          Salary management
        </h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-ledger-navy text-white rounded px-4 py-2 text-sm font-medium hover:bg-ledger-navyDeep"
        >
          {showForm ? "Cancel" : "+ Add staff"}
        </button>
      </div>
      <p className="text-sm text-ledger-navy/60 mb-6">Live data from Firestore.</p>

      {error && (
        <p className="text-sm text-ledger-brick bg-ledger-brick/10 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="badge-card ml-2 p-5 mb-6 max-w-xl">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono uppercase text-ledger-navy/50 mb-1">
                Staff name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-ledger-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-ledger-navy/50 mb-1">
                Role
              </label>
              <input
                required
                placeholder="e.g. Math Teacher"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-ledger-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-ledger-navy/50 mb-1">
                Base salary (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.base}
                onChange={(e) => setForm({ ...form, base: e.target.value })}
                className="w-full border border-ledger-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-ledger-navy/50 mb-1">
                Deductions (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.deductions}
                onChange={(e) => setForm({ ...form, deductions: e.target.value })}
                className="w-full border border-ledger-line rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ledger-navy/70 mb-4">
            <input
              type="checkbox"
              checked={form.paid}
              onChange={(e) => setForm({ ...form, paid: e.target.checked })}
            />
            Already paid this month
          </label>
          <button
            type="submit"
            disabled={saving}
            className="bg-ledger-sage text-white rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save staff record"}
          </button>
        </form>
      )}

      <div className="badge-card ml-2 p-4 mb-6 max-w-xs">
        <p className="text-xs font-mono uppercase text-ledger-navy/50">Total payroll</p>
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
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ledger-navy/40">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && staff.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ledger-navy/40">
                  No staff yet — click "+ Add staff" to get started.
                </td>
              </tr>
            )}
            {staff.map((s) => {
              const base = Number(s.base) || 0;
              const deductions = Number(s.deductions) || 0;
              return (
                <tr key={s.id} className="border-t border-ledger-line">
                  <td className="px-4 py-3 font-medium text-ledger-navy">{s.name}</td>
                  <td className="px-4 py-3 text-ledger-navy/60">{s.role}</td>
                  <td className="px-4 py-3 font-mono">₹{base.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono">₹{deductions.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 font-mono font-medium">
                    ₹{(base - deductions).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusStamp status={s.paid ? "paid" : "due"}>
                      {s.paid ? "Paid" : "Pending"}
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
