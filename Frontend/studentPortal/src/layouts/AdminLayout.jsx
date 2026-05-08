import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/admin/students", label: "Manage Students", icon: <FaUsers /> },
  { to: "/admin/courses", label: "Manage Courses", icon: <FaBook /> },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const currentItem = navItems.find((n) =>
    location.pathname.startsWith(n.to)
  );

  const pageTitle = currentItem?.label ?? "Admin Panel";

  return (
    <div className="min-h-screen flex bg-surface font-body text-on-surface">

      {/* ── Sidebar ── */}
      <aside
        className="fixed left-0 top-0 h-full w-72 bg-indigo-50/80 backdrop-blur-xl flex flex-col py-8 px-6 shadow-xl z-50"
        style={{ boxShadow: "0 20px 25px -5px rgba(99,102,241,0.05)" }}
      >
        {/* Brand */}
        <div className="mb-12">
          <span className="text-2xl font-bold tracking-tighter text-indigo-700 font-headline">
            The Curator
          </span>
          <p className="text-slate-500 text-xs tracking-widest font-semibold uppercase mt-1">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 py-3 px-4 rounded-xl transition-all font-medium ` +
                (isActive
                  ? "text-indigo-700 border-l-4 border-indigo-600 font-bold bg-indigo-100/50 scale-95"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-l-4 border-transparent")
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-indigo-100/50 pt-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen">

        {/* Header */}
        <header className="w-full h-24 flex items-center justify-between px-12 sticky top-0 bg-surface/80 backdrop-blur-md z-40">
          <h1 className="font-headline text-4xl font-extrabold text-indigo-600 tracking-tight">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}