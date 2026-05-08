import { useState, useEffect } from "react";
import { getMyGrades } from "../../services/studentservice"; // استيراد السيرفيس الحقيقية

const STUDY_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBYF0QgaBCSrkDXxqF90MZBx9slCod2vjipyEDahGvy09_I98-hgAXOrlAhgC-ANgZG3ZKqVec5_XGzz0JLnrlB91kLH7aeugAZ85ljfslGo07H-MJ43XMCXDDufYLL-Df9Mxpa-xqB4WeddisK39gyjmoHnkz-qsVposInjMwMswNrVRNsCJfi0FZ6W3e8MPe2cC7E67RKLZN8njt-GTx8B6Xd2U23Ge1EYfUeNOlps_YU4HYuDTCPTurIrldUtxEjB8XFMtyFgQ";

// ── Helpers ────────────────────────────────────────────────────────────────
const gradeColor = (g) => {
  if (!g) return "text-gray-400";
  if (g.startsWith("A")) return "text-indigo-600";
  if (g.startsWith("B")) return "text-purple-500";
  return "text-gray-600";
};

const gradePoints = { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "F": 0.0 };

function StatusBadge({ status }) {
  const isCompleted = status === "completed" || status === "graded";
  return (
    <span className={`inline-flex px-4 py-2 rounded-2xl text-[10px] font-bold tracking-wider uppercase leading-tight text-center ${
      isCompleted ? "bg-[#EEEDF4] text-gray-500" : "bg-[#C9E6FF]/70 text-[#004c6e]"
    }`}>
      {isCompleted ? "COMPLETED" : <>IN<br />PROGRESS</>}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    gpa: 0,
    credits: 0,
    totalCredits: 120,
    standing: "Good Standing",
    standingTag: "ACTIVE"
  });

  useEffect(() => {
    const fetchGradesData = async () => {
      try {
        setLoading(true);
        const res = await getMyGrades();
        const fetchedGrades = res.data || [];
        setGrades(fetchedGrades);

        // حساب الإحصائيات من الداتا الفعلية
        let totalWeightedPoints = 0;
        let totalEarnedCredits = 0;

        fetchedGrades.forEach((item) => {
          const courseCredits = item.courseId?.credits || 3;
          const points = gradePoints[item.grade] || 0;
          
          totalWeightedPoints += (points * courseCredits);
          totalEarnedCredits += courseCredits;
        });

        const calculatedGPA = totalEarnedCredits > 0 ? (totalWeightedPoints / totalEarnedCredits) : 0;

        setStats(prev => ({
          ...prev,
          gpa: calculatedGPA,
          credits: totalEarnedCredits,
          standing: calculatedGPA >= 3.5 ? "Dean's List" : "Good Standing",
          standingTag: calculatedGPA >= 3.5 ? "EXCELLENT" : "ACTIVE"
        }));
      } catch (error) {
        console.error("Error loading grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradesData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-[#EEEDF4]" />)}
        </div>
        <div className="h-96 rounded-2xl bg-[#EEEDF4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <p className="text-sm text-gray-400 font-medium mb-2">Cumulative GPA</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-800 font-headline">
              {stats.gpa.toFixed(2)}
            </span>
          </div>
          <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <p className="text-sm text-gray-400 font-medium mb-2">Credits Earned</p>
          <p className="text-4xl font-extrabold text-gray-800 font-headline">{stats.credits}</p>
          <p className="text-sm text-gray-400 mt-1">/ {stats.totalCredits} required</p>
          <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <p className="text-sm text-gray-400 font-medium mb-2">Academic Standing</p>
          <p className="text-2xl font-extrabold text-gray-800 font-headline">{stats.standing}</p>
          <p className="text-sm text-gray-400 mt-1">Academic Year 2026</p>
          <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
        </div>

        <div className="rounded-2xl p-6 shadow-sm flex flex-col justify-between"
             style={{ background: "linear-gradient(135deg,#5147e8,#6c66f5)" }}>
          <p className="text-sm text-white/70 font-medium">Status Tag</p>
          <div>
            <p className="text-3xl font-extrabold text-white font-headline mb-2">{stats.standingTag}</p>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase">
              VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* ── Table + Side Panel ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Grade Table */}
        <div className="col-span-7 bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 font-headline">Course Academic Performance</h3>
          </div>

          <div className="grid grid-cols-12 px-2 mb-4">
            <span className="col-span-5 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">Course Name</span>
            <span className="col-span-2 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">Credits</span>
            <span className="col-span-3 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">Status</span>
            <span className="col-span-2 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 text-right">Grade</span>
          </div>

          <div className="divide-y divide-gray-50">
            {grades.length > 0 ? grades.map((item) => (
              <div key={item._id} className="grid grid-cols-12 items-center py-5 px-2 hover:bg-indigo-50/30 rounded-xl transition-colors">
                <div className="col-span-5">
                  <p className="font-bold text-gray-800">{item.courseId?.courseName || "General Course"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.courseId?.courseCode || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">{(item.courseId?.credits || 3).toFixed(1)}</span>
                </div>
                <div className="col-span-3">
                  <StatusBadge status={item.grade ? "completed" : "in_progress"} />
                </div>
                <div className="col-span-2 text-right">
                  <span className={`text-2xl font-extrabold font-headline ${gradeColor(item.grade)}`}>
                    {item.grade || "—"}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400">No grades available yet.</div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden shadow-sm flex-1">
            <img
              src={STUDY_IMG}
              alt="Student studying"
              className="w-full h-full object-cover min-h-[400px] opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
          <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              "النجاح مش مجرد درجات، النجاح هو الاستمرارية في التعلم وتطوير مهاراتك كل يوم."
            </p>
          </div>
        </div>
      </div>

      <footer className="py-4 border-t border-indigo-100 flex justify-center">
        <p className="text-xs text-gray-400 tracking-wide">© 2026 Helwan University Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}