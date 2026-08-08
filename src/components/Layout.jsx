import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "◆" },
  { to: "/attendance", label: "Attendance", icon: "✓" },
  { to: "/fees", label: "Fees", icon: "₹" },
  { to: "/salary", label: "Salary", icon: "$" },
  { to: "/timetable", label: "Timetable", icon: "▦" },
  { to: "/links", label: "Quick Links", icon: "⇢" },
];

export default function Layout() {
  const { profile, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gy-cream">
      <aside className="w-64 shrink-0 bg-gy-ink text-gy-cream flex flex-col">
        <div className="px-6 py-7 border-b border-white/10 flex items-center gap-3">
          <div className="brand-mark w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-semibold shrink-0">
            ग
          </div>
          <div>
            <p className="font-display text-xl font-semibold leading-tight tracking-tight">
              Gyanam <span className="text-gy-goldLight">Classes</span>
            </p>
            <p className="text-[11px] text-white/45 italic leading-snug mt-0.5">
              a place of complete learning
            </p>
          </div>
        </div>
        <nav className="flex-1 py-5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/[0.08] text-gy-goldLight border-r-2 border-gy-gold"
                    : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              <span className="w-4 text-center text-gy-gold/80">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/10 text-xs">
          <p className="text-white/70 font-medium">{profile?.name || "Signed in"}</p>
          <p className="text-white/40 font-mono uppercase tracking-wide mt-0.5">
            {profile?.role || "user"}
          </p>
          <button
            onClick={logout}
            className="mt-2.5 text-gy-goldLight hover:text-gy-gold transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
