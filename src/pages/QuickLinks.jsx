import { useState } from "react";

// Deep-link helpers. On mobile these open the native app if installed,
// and fall back to the web version in a browser.
const igUrl = (username) => `https://instagram.com/${username}`;
const fbUrl = (idOrUsername) => `https://facebook.com/${idOrUsername}`;
const waUrl = (phone, msg = "") =>
  `https://wa.me/${phone.replace(/\D/g, "")}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
const callUrl = (phone) => `tel:${phone.replace(/\s/g, "")}`;

const LINKS = [
  { key: "instagram", label: "Instagram", color: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", build: igUrl, placeholder: "school_handle" },
  { key: "facebook", label: "Facebook", color: "bg-[#1877F2]", build: fbUrl, placeholder: "SchoolPageName" },
  { key: "whatsapp", label: "WhatsApp", color: "bg-[#25D366]", build: (v) => waUrl(v, "Hello from the school office"), placeholder: "+91 98765 43210" },
  { key: "call", label: "Call", color: "bg-gy-ink", build: callUrl, placeholder: "+91 98765 43210" },
];

export default function QuickLinks() {
  const [values, setValues] = useState({
    instagram: "yourschool",
    facebook: "yourschool",
    whatsapp: "+91 98765 43210",
    call: "+91 98765 43210",
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-gy-ink mb-1">
        Quick links
      </h1>
      <p className="text-sm text-gy-ink/60 mb-6">
        One-tap contact. On phones these open the native app; on desktop they open the web version.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        {LINKS.map((link) => (
          <div key={link.key} className="badge-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg ${link.color}`} />
              <p className="font-medium text-gy-ink">{link.label}</p>
            </div>
            <input
              value={values[link.key]}
              onChange={(e) => setValues((v) => ({ ...v, [link.key]: e.target.value }))}
              placeholder={link.placeholder}
              className="w-full border border-gy-line rounded px-3 py-1.5 text-sm mb-3 font-mono"
            />
            <a
              href={link.build(values[link.key])}
              target="_blank"
              rel="noreferrer"
              className="block text-center w-full bg-gy-ink text-white rounded py-2 text-sm font-medium hover:bg-gy-inkDeep"
            >
              Open {link.label}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
