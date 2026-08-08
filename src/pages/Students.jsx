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

// Photos are stored as small compressed thumbnails directly in Firestore
// (Firebase Storage needs the paid Blaze plan). Fine for basic ID photos,
// not meant for full-resolution images.
function resizeImageFile(file, maxSize = 160, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function calcAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

const emptyForm = {
  name: "",
  fatherName: "",
  dob: "",
  className: "",
  address: "",
  photo: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Couldn't load students. Check your Firebase setup.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImageFile(file);
      setForm((f) => ({ ...f, photo: dataUrl }));
    } catch (err) {
      console.error(err);
      setError("Couldn't process that photo.");
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "students"), {
        name: form.name.trim(),
        fatherName: form.fatherName.trim(),
        dob: form.dob,
        className: form.className.trim(),
        address: form.address.trim(),
        photo: form.photo || "",
        createdAt: serverTimestamp(),
      });
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Couldn't save. Check your Firebase setup.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = students.filter((s) =>
    (s.name || "").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-semibold text-gy-ink">Students</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-gy-ink text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gy-inkDeep"
        >
          {showForm ? "Cancel" : "+ Add student"}
        </button>
      </div>
      <p className="text-sm text-gy-ink/60 mb-6">Live data from Firestore.</p>

      {error && (
        <p className="text-sm text-gy-coral bg-gy-coral/10 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="badge-card p-5 mb-6 max-w-2xl">
          <div className="flex gap-5 mb-4">
            <div className="shrink-0">
              <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                Photo
              </label>
              <div className="w-20 h-20 rounded-lg bg-gy-cream border border-gy-line overflow-hidden flex items-center justify-center">
                {form.photo ? (
                  <img src={form.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gy-ink/30 text-xs">No photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="text-xs mt-1.5 w-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                  Student name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gy-line rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                  Father's name
                </label>
                <input
                  value={form.fatherName}
                  onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                  className="w-full border border-gy-line rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
                  Date of birth
                </label>
                <input
                  type="date"
                  required
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full border border-gy-line rounded-lg px-3 py-2 text-sm"
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
                  className="w-full border border-gy-line rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <label className="block text-xs font-mono uppercase text-gy-ink/50 mb-1">
            Address
          </label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={2}
            className="w-full border border-gy-line rounded-lg px-3 py-2 text-sm mb-4"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-gy-teal text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save student"}
          </button>
        </form>
      )}

      <input
        placeholder="Search student…"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border border-gy-line rounded-lg px-3 py-2 text-sm mb-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-gy-gold/50"
      />

      {loading && <p className="text-sm text-gy-ink/40">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-sm text-gy-ink/40">
          No students yet — click "+ Add student" to get started.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="badge-card p-4 flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-gy-cream border border-gy-line overflow-hidden shrink-0 flex items-center justify-center">
              {s.photo ? (
                <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gy-ink/30 text-xs">No photo</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-gy-ink truncate">{s.name}</p>
              <p className="text-xs text-gy-ink/50 font-mono">
                Class {s.className} · Age {calcAge(s.dob) ?? "—"}
              </p>
              {s.fatherName && (
                <p className="text-xs text-gy-ink/60 mt-1">Father: {s.fatherName}</p>
              )}
              {s.address && (
                <p className="text-xs text-gy-ink/40 mt-0.5 truncate">{s.address}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
