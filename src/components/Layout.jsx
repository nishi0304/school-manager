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
    <div className="min-h-screen flex bg-ledger-chalk">
      <aside className="w-60 shrink-0 bg-ledger-navy text-ledger-chalk flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="font-display text-xl font-semibold leading-tight">
            School<span className="text-ledger-marigold">Register</span>
          </p>
          <p className="text-xs text-white/50 mt-1 font-mono">ADMIN CONSOLE</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-ledger-marigold border-r-2 border-ledger-marigold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 text-xs">
          <p className="text-white/60">{profile?.name || "Signed in"}</p>
          <p className="text-white/40 font-mono uppercase">{profile?.role || "user"}</p>
          <button onClick={logout} className="mt-2 text-ledger-marigold hover:underline">
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
