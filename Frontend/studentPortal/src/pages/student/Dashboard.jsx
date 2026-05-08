import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../../services/studentservice";
import { getMyGrades } from "../../services/studentservice";

// ── Grade color helper ────────────────────────────────────────────────────────────
const gradeColor = (g) => {
  if (!g) return "text-gray-400";
  if (g.startsWith("A")) return "text-indigo-600";
  if (g.startsWith("B")) return "text-purple-500";
  return "text-gray-500";
};

// ── Stat Card Component ──────────────────────────────────────────────────────────
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
          <span className="material-symbols-outlined text-lg">{icon}</span>
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

// ── Section Header Component ─────────────────────────────────────────────────────
function SectionHeader({ title, linkLabel, onLink }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800 font-headline">{title}</h3>
      {linkLabel && (
        <button onClick={onLink} className="text-sm text-indigo-600 font-semibold hover:opacity-70 transition-opacity cursor-pointer">
          {linkLabel} →
        </button>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ gpa: 0, credits: 0, totalCredits: 120 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // سحب البيانات من الـ API الحقيقي
        const [coursesRes, gradesRes] = await Promise.all([
          getMyCourses(),
          getMyGrades()
        ]);

        const fetchedCourses = coursesRes.data || [];
        const fetchedGrades = gradesRes.data || [];

        setCourses(fetchedCourses);
        setGrades(fetchedGrades);

        // حساب الإحصائيات بشكل تلقائي
        let totalPoints = 0;
        let earnedCredits = 0;

        const gradePoints = { "A": 4, "A-": 3.7, "B+": 3.3, "B": 3, "B-": 2.7, "C+": 2.3, "C": 2 };

        fetchedGrades.forEach(g => {
          const points = gradePoints[g.grade] || 0;
          const courseCredits = g.courseId?.credits || 3; // افتراضي 3 لو مش موجود
          totalPoints += (points * courseCredits);
          earnedCredits += courseCredits;
        });

        setStats(prev => ({
          ...prev,
          credits: earnedCredits,
          gpa: earnedCredits > 0 ? (totalPoints / earnedCredits).toFixed(2) : 0
        }));

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-64 rounded-xl bg-[#EEEDF4]" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-[#EEEDF4]" />)}
        </div>
        <div className="h-56 rounded-2xl bg-[#EEEDF4]" />
      </div>
    );
  }

  const creditsPercent = Math.min(100, Math.round((stats.credits / stats.totalCredits) * 100));

  return (
    <div className="space-y-8">
      {/* ── Welcome ── */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 font-headline">
          Welcome back, {user?.name || "Student"}
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Here's a live look at your academic progress.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Cumulative GPA"
          value={stats.gpa}
          sub="Based on recent grades"
          icon="stars"
          onClick={() => navigate("/student/grades")}
        />
        <StatCard
          label="Credits Earned"
          value={stats.credits}
          sub={`/ ${stats.totalCredits} required`}
          icon="school"
          onClick={() => navigate("/student/grades")}
        />
        <StatCard
          label="Active Courses"
          value={courses.length}
          sub="Currently enrolled"
          icon="menu_book"
          onClick={() => navigate("/student/courses")}
        />
        <StatCard
          label="Account Status"
          value="Active"
          sub={user?.email}
          icon="verified_user"
          accent
        />
      </div>

      {/* ── Degree Progress ── */}
      <div className="bg-white rounded-2xl px-8 py-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-600">Degree Progress</span>
          <span className="text-sm font-bold text-indigo-600">{creditsPercent}% Complete</span>
        </div>
        <div className="w-full bg-[#EEEDF4] h-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${creditsPercent}%`, background: "linear-gradient(to right, #4b41e1, #645efb)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Col: Courses */}
        <div className="col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <SectionHeader
              title="My Enrolled Courses"
              linkLabel="View All"
              onLink={() => navigate("/student/courses")}
            />
            <div className="space-y-3">
              {courses.length > 0 ? courses.slice(0, 3).map((course) => (
                <div key={course._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#F5F3FF] hover:bg-indigo-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{course.courseName || course.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Code: {course.courseCode || 'N/A'}</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full">
                    {course.credits || 3} Credits
                  </span>
                </div>
              )) : (
                <p className="text-center text-gray-400 py-4">No courses found. Go to enrollment to start!</p>
              )}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <SectionHeader
              title="Recent Grades"
              linkLabel="Full Transcript"
              onLink={() => navigate("/student/grades")}
            />
            <div className="space-y-3">
              {grades.length > 0 ? grades.slice(0, 3).map((g) => (
                <div key={g._id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F3FF] hover:bg-indigo-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">{g.courseId?.courseName || "Course"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Updated: {new Date(g.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-3xl font-extrabold font-headline ${gradeColor(g.grade)}`}>
                    {g.grade}
                  </span>
                </div>
              )) : (
                <p className="text-center text-gray-400 py-4">No grades posted yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Announcements (Static Placeholder since no API for it yet) */}
        <div className="col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <SectionHeader title="Announcements" />
                <div className="space-y-4">
                    <div className="border-l-4 border-red-400 pl-4">
                        <p className="text-sm font-bold text-gray-800">Summer Training Open</p>
                        <p className="text-xs text-gray-400">Applications close May 25th</p>
                    </div>
                    <div className="border-l-4 border-indigo-400 pl-4">
                        <p className="text-sm font-bold text-gray-800">Final Exams Schedule</p>
                        <p className="text-xs text-gray-400">Check the student portal</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <footer className="py-4 border-t border-indigo-100 flex justify-center">
        <p className="text-xs text-gray-400 tracking-wide">© 2026 Helwan University - Student Portal.</p>
      </footer>
    </div>
  );
}