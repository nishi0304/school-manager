import { useEffect, useMemo, useState } from "react";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Timetable() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    className: "",
    day: "Mon",
    time: "",
    subject: "",
    teacher: "",
  });

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "timetable"),
      (snap) => {
        setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Couldn't load timetable. Check your Firebase setup.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const classOptions = useMemo(() => {
    const set = new Set(entries.map((e) => e.className).filter(Boolean));
    return Array.from(set).sort();
  }, [entries]);

  useEffect(() => {
    if (!selectedClass && classOptions.length) setSelectedClass(classOptions[0]);
  }, [classOptions, selectedClass]);

  const visible = entries
    .filter((e) => e.className === selectedClass)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const byDay = DAYS.reduce((acc, d) => {
    acc[d] = visible.filter((e) => e.day === d);
    return acc;
  }, {});

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "timetable"), {
        className: form.className.trim(),
        day: form.day,
        time: form.time.trim(),
        subject: form.subject.trim(),
        teacher: form.teacher.trim(),
        createdAt: serverTimestamp(),
      });
      setSelectedClass(form.className.trim());
      setForm({ className: form.className, day: "Mon", time: "", subject: "", teacher: "" });
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
        <h1 className="font-display text-3xl font-semibold text-gy-ink">Timetable</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-gy-ink text-white rounded px-4 py-2 text-sm font-medium hover:bg-gy-inkDeep"
        >
          {showForm ? "Cancel" : "+ Add period"}
        </button>
      </div>
      <p className="text-sm text-gy-ink/60 mb-6">Live data from Firestore.</p>

      {error && (
        <p className="text-sm text-gy-coral bg-gy-coral/10 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="badge-card p-5 mb-6 max-w-2xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
                Day
              </label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm bg-white"
              >
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Time
              </label>
              <input
                required
                placeholder="e.g. 9:00"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Subject
              </label>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Teacher
              </label>
              <input
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                className="w-full border border-gy-line rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gy-teal text-white rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save period"}
          </button>
        </form>
      )}

      {classOptions.length > 0 && (
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-gy-line rounded px-3 py-1.5 text-sm bg-white mb-4"
        >
          {classOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      )}

      {loading && <p className="text-sm text-gy-ink/40">Loading…</p>}

      {!loading && classOptions.length === 0 && (
        <p className="text-sm text-gy-ink/40">
          No timetable entries yet — click "+ Add period" to get started.
        </p>
      )}

      {!loading && classOptions.length > 0 && (
        <div className="badge-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gy-ink text-white">
              <tr>
                {DAYS.map((d) => (
                  <th key={d} className="px-3 py-2.5 text-left font-medium">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gy-line align-top">
                {DAYS.map((d) => (
                  <td key={d} className="px-3 py-2.5">
                    {byDay[d].length === 0 && (
                      <span className="text-gy-ink/30 italic">—</span>
                    )}
                    {byDay[d].map((e) => (
                      <div key={e.id} className="mb-2 last:mb-0">
                        <p className="font-mono text-xs text-gy-ink/50">{e.time}</p>
                        <p className="font-medium text-gy-ink">{e.subject}</p>
                        {e.teacher && (
                          <p className="text-xs text-gy-ink/50">{e.teacher}</p>
                        )}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
