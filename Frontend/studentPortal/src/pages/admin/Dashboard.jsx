import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/admin.service";

// ── Build dashboard data from real API ────────────────────────────────────
const buildDashboardData = (users) => {
  const students = users.filter((u) => u.role === "student");
  const active   = students.filter((s) => s.status === "active");
  const avgGpa   = students.length
    ? students.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) / students.length
    : 0;

  return {
    stats: {
      totalStudents:  students.length,
      activeStudents: active.length,
      avgGpa,
      totalCourses:   0, // ربطه بـ course API لو اتضافت
    },
    recentStudents: students.slice(0, 3).map((s) => ({
      id:     s._id || s.id,
      name:   `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.name || "—",
      major:  s.major  || "—",
      gpa:    parseFloat(s.gpa) || 0,
      status: s.status || "active",
    })),
    recentCourses: [], // ربطه بـ course API لو اتضافت
    gpaDistribution: [
      { range: "3.7 - 4.0", count: students.filter((s) => s.gpa >= 3.7).length,                          color: "#4b41e1" },
      { range: "3.0 - 3.6", count: students.filter((s) => s.gpa >= 3.0 && s.gpa < 3.7).length, color: "#7c3aed" },
      { range: "2.0 - 2.9", count: students.filter((s) => s.gpa >= 2.0 && s.gpa < 3.0).length, color: "#e11d48" },
    ],
  };
};

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:    "bg-green-100 text-green-700",
    probation: "bg-red-100 text-red-500",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 flex flex-col justify-between min-h-[130px] relative overflow-hidden shadow-sm transition-all ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""}`}
      style={{ background: accent ? "linear-gradient(135deg,#5147e8,#6c66f5)" : "#fff" }}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-semibold ${accent ? "text-white/80" : "text-gray-400"}`}>{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-white/20" : "bg-indigo-100"}`}>
          <span className={`material-symbols-outlined text-lg ${accent ? "text-white" : "text-indigo-500"}`}>{icon}</span>
        </div>
      </div>
      <div>
        <p className={`text-4xl font-extrabold font-headline mt-1 ${accent ? "text-white" : "text-gray-800"}`}>{value}</p>
        {sub && <p className={`text-sm mt-1 ${accent ? "text-white/70" : "text-gray-400"}`}>{sub}</p>}
      </div>
      {!accent && <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        // بعض الـ backends بترجع { data: [...] } وبعضها بترجع [...] مباشرة
        const users = Array.isArray(res) ? res : (res.data ?? []);
        setData(buildDashboardData(users));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-72 rounded-xl bg-[#EEEDF4]" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-[#EEEDF4]" />)}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-4">
            <div className="h-64 rounded-2xl bg-[#EEEDF4]" />
            <div className="h-64 rounded-2xl bg-[#EEEDF4]" />
          </div>
          <div className="col-span-4 h-80 rounded-2xl bg-[#EEEDF4]" />
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-4xl text-red-400 mb-3">error</span>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(null); }}
          className="mt-4 px-5 py-2 rounded-full text-sm font-semibold text-white"
          style={{ background: "linear-gradient(to right,#4b41e1,#645efb)" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentStudents, recentCourses, gpaDistribution } = data;
  const maxCount = Math.max(...gpaDistribution.map((g) => g.count), 1);

  return (
    <div className="space-y-8">

      {/* ── Welcome ── */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 font-headline">
          Welcome, <span className="text-indigo-600">{user?.name ?? "Admin"}</span> 👋
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Here's an overview of the academic system.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          sub="Enrolled"
          icon="group"
          onClick={() => navigate("/admin/students")}
        />
        <StatCard
          label="Total Courses"
          value={stats.totalCourses}
          sub="This semester"
          icon="menu_book"
          onClick={() => navigate("/admin/courses")}
        />
        <StatCard
          label="Active Students"
          value={stats.activeStudents}
          sub="Good standing"
          icon="check_circle"
          onClick={() => navigate("/admin/students")}
        />
        <StatCard
          label="Average GPA"
          value={stats.avgGpa.toFixed(2)}
          sub="Across all students"
          icon="stars"
          accent
        />
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left col */}
        <div className="col-span-8 space-y-6">

          {/* Recent Students */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 font-headline">Recent Students</h3>
              <button
                onClick={() => navigate("/admin/students")}
                className="text-sm text-indigo-600 font-semibold hover:opacity-70 cursor-pointer"
              >
                Manage All →
              </button>
            </div>

            <div className="grid grid-cols-12 px-2 mb-3">
              <span className="col-span-4 text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Student</span>
              <span className="col-span-4 text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Major</span>
              <span className="col-span-2 text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">GPA</span>
              <span className="col-span-2 text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Status</span>
            </div>

            {recentStudents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No students found</p>
            ) : (
              <div className="space-y-2">
                {recentStudents.map((s) => (
                  <div key={s.id} className="grid grid-cols-12 items-center px-2 py-4 rounded-2xl bg-[#F5F3FF] hover:bg-indigo-50/80 transition-colors">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {s.name[0]}
                      </div>
                      <span className="font-bold text-gray-800 text-sm">{s.name}</span>
                    </div>
                    <div className="col-span-4">
                      <span className="text-sm text-gray-500">{s.major}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`font-bold text-sm ${s.gpa >= 3.7 ? "text-indigo-600" : s.gpa >= 3.0 ? "text-purple-500" : "text-red-400"}`}>
                        {s.gpa.toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <StatusBadge status={s.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Courses */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 font-headline">Recent Courses</h3>
              <button
                onClick={() => navigate("/admin/courses")}
                className="text-sm text-indigo-600 font-semibold hover:opacity-70 cursor-pointer"
              >
                Manage All →
              </button>
            </div>

            {recentCourses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No courses available yet</p>
            ) : (
              <div className="space-y-2">
                {recentCourses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-4 py-4 rounded-2xl bg-[#F5F3FF] hover:bg-indigo-50/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.instructor}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                      {c.credits.toFixed(1)} cr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right col */}
        <div className="col-span-4 space-y-6">

          {/* GPA Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 font-headline mb-6">GPA Distribution</h3>
            <div className="space-y-4">
              {gpaDistribution.map((g) => (
                <div key={g.range}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-600">{g.range}</span>
                    <span className="font-bold text-gray-800">{g.count} students</span>
                  </div>
                  <div className="w-full bg-[#EEEDF4] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(g.count / maxCount) * 100}%`, background: g.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 font-headline mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Add New Student",   icon: "person_add", to: "/admin/students", action: true  },
                { label: "Add New Course",    icon: "add_circle", to: "/admin/courses",  action: true  },
                { label: "View All Students", icon: "group",      to: "/admin/students", action: false },
                { label: "View All Courses",  icon: "menu_book",  to: "/admin/courses",  action: false },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.to)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    item.action ? "text-white hover:opacity-90" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                  style={item.action ? { background: "linear-gradient(to right,#4b41e1,#645efb)" } : {}}
                >
                  <span className="material-symbols-outlined text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 border-t border-indigo-100 flex justify-center">
        <p className="text-xs text-gray-400 tracking-wide">© 2024 The Curator. All rights reserved.</p>
      </footer>
    </div>
  );
}