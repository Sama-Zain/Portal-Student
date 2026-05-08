import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getMyCourses, enrollInCourse, withdrawFromCourse } from "../../services/studentservice";

// ── Status badge ───────────────────────────────────────────────────────────
const statusBadge = {
  registered: "bg-[#C9E6FF]/60 text-[#004666]",
  open:       "bg-indigo-100/80 text-indigo-500",
  full:       "bg-red-100 text-red-400",
  waitlisted: "bg-amber-100 text-amber-600",
};

const statusLabel = {
  registered: "REGISTERED",
  open:       "OPEN",
  full:       "FULL",
  waitlisted: "WAITLISTED",
};

const abbrBadge = (status) =>
  status === "full" ? "bg-gray-200 text-gray-400" : "bg-indigo-100 text-indigo-500";

// ── Helper: بيبني الداتا من الـ response ──────────────────────────────────
const buildData = (res) => {
  // الـ backend بيرجع array من الـ courses اللي الطالب enrolled فيها
  const enrolled = Array.isArray(res) ? res : (res.data ?? res.courses ?? []);

  return {
    semester:         res.semester         ?? "Current Semester",
    registrationOpen: res.registrationOpen ?? true,
    creditLoad:       enrolled.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0),
    maxCredits:       res.maxCredits       ?? 18,
    courses: enrolled.map((c) => ({
      id:         c._id     ?? c.id,
      code:       c.code    ?? c.courseCode ?? "—",
      section:    c.section ?? "—",
      abbr:       c.abbr    ?? (c.name ?? "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
      name:       c.name    ?? c.courseName ?? "—",
      instructor: c.instructor ?? "—",
      credits:    parseFloat(c.credits) || 0,
      status:     "registered", // كل الكورسات الجاية من my-courses هي مسجّلة
    })),
  };
};

// ── Main ───────────────────────────────────────────────────────────────────
export default function CourseRegistration() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [busy,    setBusy]    = useState(null);

  useEffect(() => {
    getMyCourses()
      .then((res) => {
        setData(buildData(res));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load courses");
        setLoading(false);
      });
  }, []);

  // ── Register → POST /course/enroll ──
  const handleRegister = async (id) => {
    setBusy(id);
    try {
      await enrollInCourse(id);
      setData((prev) => {
        const course = prev.courses.find((c) => c.id === id);
        return {
          ...prev,
          creditLoad: prev.creditLoad + (course?.credits ?? 0),
          courses: prev.courses.map((c) =>
            c.id === id ? { ...c, status: "registered" } : c
          ),
        };
      });
      toast.success("Course registered!");
    } catch (err) {
      toast.error(err.message || "Failed to register");
    } finally {
      setBusy(null);
    }
  };

  // ── Drop → DELETE /course/withdraw ──
  const handleDrop = async (id) => {
    setBusy(id);
    try {
      await withdrawFromCourse(id);
      setData((prev) => {
        const course = prev.courses.find((c) => c.id === id);
        return {
          ...prev,
          creditLoad: prev.creditLoad - (course?.credits ?? 0),
          courses: prev.courses.map((c) =>
            c.id === id ? { ...c, status: "open" } : c
          ),
        };
      });
      toast.info("Course dropped.");
    } catch (err) {
      toast.error(err.message || "Failed to drop course");
    } finally {
      setBusy(null);
    }
  };

  // ── Waitlist → local state فقط (مفيش endpoint في الباك) ──
  const handleWaitlist = async (id) => {
    setBusy(id);
    await new Promise((r) => setTimeout(r, 400));
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === id ? { ...c, status: "waitlisted" } : c
      ),
    }));
    toast.success("Added to waitlist!");
    setBusy(null);
  };

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-44 rounded-2xl bg-indigo-200/40" />
        <div className="h-80 rounded-2xl bg-[#EEEDF4]" />
      </div>
    );
  }

  // ── Error ──
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

  const creditPercent = Math.min(
    Math.round((data.creditLoad / data.maxCredits) * 100),
    100
  );

  return (
    <div className="space-y-6">

      {/* ── Hero banner ── */}
      <section
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #5147e8 0%, #6c66f5 100%)" }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 800 200">
          <path d="M0 150 Q 200 50 400 150 T 800 100" fill="none" stroke="white" strokeWidth="1.5"/>
          <path d="M0 120 Q 200 20 400 120 T 800 70"  fill="none" stroke="white" strokeWidth="1"/>
          <path d="M0 180 Q 200 80 400 180 T 800 130" fill="none" stroke="white" strokeWidth="0.8"/>
        </svg>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold tracking-widest uppercase mb-4 inline-block">
              {data.registrationOpen ? "Registration Open" : "Registration Closed"}
            </span>
            <h2 className="text-5xl font-extrabold font-headline tracking-tight mb-2">
              {data.semester}
            </h2>
            <p className="text-white/80 text-base max-w-sm leading-relaxed">
              Finalize your curriculum for the upcoming semester.<br />
              You have priority enrollment status.
            </p>
          </div>

          <div className="text-right shrink-0 min-w-[160px]">
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Credit Load</p>
            <div className="flex items-baseline gap-1 justify-end mb-3">
              <span className="text-6xl font-extrabold font-headline leading-none">{data.creditLoad}</span>
              <span className="text-2xl font-semibold opacity-50">/ {data.maxCredits}</span>
            </div>
            <div className="w-40 h-2 bg-white/25 rounded-full overflow-hidden ml-auto">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${creditPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Table ── */}
      <section className="bg-white rounded-2xl px-8 py-6 shadow-sm">
        <h3 className="text-2xl font-bold font-headline text-indigo-900 mb-6">
          Available Curriculum
        </h3>

        <div className="grid grid-cols-12 px-4 mb-2">
          <span className="col-span-5 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">Course Name</span>
          <span className="col-span-3 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">Instructor</span>
          <span className="col-span-1 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">Credits</span>
          <span className="col-span-1 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">Status</span>
          <span className="col-span-2 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 text-right">Action</span>
        </div>

        {data.courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2">menu_book</span>
            <p className="text-sm font-medium">No courses enrolled yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.courses.map((course) => (
              <div
                key={course.id}
                className={`grid grid-cols-12 items-center px-4 py-4 rounded-2xl bg-[#F5F3FF] transition-colors hover:bg-indigo-50/80 ${
                  course.status === "full" ? "opacity-75" : ""
                }`}
              >
                <div className="col-span-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${abbrBadge(course.status)}`}>
                    {course.abbr}
                  </div>
                  <div>
                    <p className="font-bold text-indigo-900 font-headline">{course.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{course.code} • {course.section}</p>
                  </div>
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(course.instructor.split(" ").pop() ?? "?")[0]}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{course.instructor}</span>
                </div>

                <div className="col-span-1">
                  <span className="font-bold text-gray-800 font-headline">{course.credits.toFixed(1)}</span>
                </div>

                <div className="col-span-1">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${statusBadge[course.status]}`}>
                    {statusLabel[course.status]}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end">
                  <ActionButton
                    course={course}
                    busy={busy === course.id}
                    onRegister={() => handleRegister(course.id)}
                    onDrop={() => handleDrop(course.id)}
                    onWaitlist={() => handleWaitlist(course.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="py-4 border-t border-indigo-100 flex justify-center">
        <p className="text-xs text-gray-400 tracking-wide">© 2024 The Curator. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ── Action Button ──────────────────────────────────────────────────────────
function ActionButton({ course, busy, onRegister, onDrop, onWaitlist }) {
  if (busy) {
    return <div className="w-8 h-8 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />;
  }

  switch (course.status) {
    case "registered":
      return (
        <button onClick={onDrop}
          className="text-red-500 font-bold text-sm hover:underline underline-offset-4 cursor-pointer transition-all">
          Drop
        </button>
      );
    case "open":
      return (
        <button onClick={onRegister}
          className="px-6 py-2 rounded-full text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(to right, #4b41e1, #645efb)" }}>
          Register
        </button>
      );
    case "full":
      return (
        <button onClick={onWaitlist}
          className="px-6 py-2 rounded-full border-2 border-indigo-500 text-indigo-500 font-bold text-sm cursor-pointer hover:bg-indigo-50 transition-all">
          Waitlist
        </button>
      );
    case "waitlisted":
      return (
        <button onClick={onDrop}
          className="text-amber-500 font-bold text-sm hover:underline underline-offset-4 cursor-pointer transition-all">
          Leave Waitlist
        </button>
      );
    default:
      return null;
  }
}