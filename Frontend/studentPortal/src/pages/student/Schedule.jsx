import { useState, useEffect } from "react";

const LIBRARY_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDq3pPZ0WtMGYZlfR7MI15baj75aKqP_Gqu1d1yZ5CqWJi2I92z0tlWEgqnYznlz1VHE9BLdufr6xawuhv-Gd7pGvjO1Q_WyWC1xPe4V_iJ30CiuiwCW8zk_s2wayPloq_6rKesgoUJRpNRt4pcnPZuHb7tMzf8hnnVHbG-_XTKGLU_y1BplaRv_yBGwqTF_CkP5wU2ZDEixlu5ZPGzRWB1m_oWA4hEyvl7-1fVYvb8qYfrAfrtQq4yyoq_dp5d7XUeyzdhYnu4eA";

// ── Mock API ───────────────────────────────────────────────────────────────
const getScheduleApi = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: {
            stats: {
              totalCourses: 6,
              totalCredits: 18.5,
              weeklyHours:  24.0,
            },
            schedule: [
              {
                day: "Monday",
                color: "#4b41e1",
                classes: [
                  { id: 1, start: "09:00", name: "Advanced Web Architecture",  location: "Hall 4B",      instructor: "Dr. Julian Thorne"   },
                  { id: 2, start: "13:30", name: "Database Systems Management",  location: "Lab 12",       instructor: "Prof. Sarah Chen"    },
                ],
              },
              {
                day: "Wednesday",
                color: "#7c3aed",
                classes: [
                  { id: 3, start: "10:00", name: "Algorithm Design & Analysis",    location: "Auditorium A", instructor: "Dr. Marcus Aurelius" },
                ],
              },
              {
                day: "Friday",
                color: "#06b6d4",
                classes: [
                  { id: 4, start: "09:00", name: "Software Engineering Seminar",    location: "Studio 03",    instructor: "Various Mentors"     },
                ],
              },
            ],
            today:       8, // Current Day Highlight
            highlighted: 14, // Upcoming Deadline
          },
        }),
      600
    )
  );

// ── Mini Calendar ──────────────────────────────────────────────────────────
const DAYS             = ["MO","TU","WE","TH","FR","SA","SU"];
const MAY_START_OFFSET = 4; // May 2026 starts on Friday
const MAY_DAYS         = 31;

function buildCells() {
  const cells = [];
  [27, 28, 29, 30].forEach((d) => cells.push({ day: d, current: false }));
  for (let d = 1; d <= MAY_DAYS; d++) cells.push({ day: d, current: true });
  return cells;
}
const calendarCells = buildCells();

function MiniCalendar({ today, highlighted }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-gray-800 font-headline">May 2026</span>
        <div className="flex gap-1">
          {["chevron_left","chevron_right"].map((icon) => (
            <button key={icon} className="w-7 h-7 rounded-full hover:bg-indigo-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-base">{icon}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <span key={d} className="text-center text-[10px] font-bold text-gray-400 tracking-wider">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: MAY_START_OFFSET }).map((_, i) => <span key={`pre-${i}`} />)}
        {calendarCells.map((cell, i) => {
          const isToday       = cell.current && cell.day === today;
          const isHighlighted = cell.current && cell.day === highlighted;
          return (
            <button key={i} className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer
              ${isToday       ? "bg-indigo-600 text-white font-bold"         : ""}
              ${isHighlighted ? "border-2 border-indigo-400 text-indigo-600" : ""}
              ${!cell.current ? "text-gray-300"                               : ""}
              ${cell.current && !isToday && !isHighlighted ? "text-gray-600 hover:bg-indigo-50" : ""}
            `}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Campus Card ────────────────────────────────────────────────────────────
function CampusCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm group">
      <div className="px-5 pt-4 pb-2">
        <p className="font-bold text-gray-800 font-headline">Central Library</p>
        <p className="text-xs text-gray-400 mt-0.5">Quiet study spaces available until 10 PM</p>
      </div>
      <div className="relative h-40 overflow-hidden">
        <img
          src={LIBRARY_IMG}
          alt="Modern academic library"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white text-xs font-bold tracking-wider uppercase cursor-pointer hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-sm">map</span>
          View Campus Map
        </button>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="rounded-2xl p-6 flex flex-col justify-between min-h-[130px] relative overflow-hidden shadow-sm"
         style={{ background: accent ? "linear-gradient(135deg,#5147e8,#6c66f5)" : "#fff" }}>
      <div className="flex justify-between items-start">
        <span className={`text-sm font-semibold ${accent ? "text-white/80" : "text-gray-400"}`}>{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-white/20" : "bg-indigo-100"}`}>
          <span className={`material-symbols-outlined text-lg ${accent ? "text-white" : "text-indigo-500"}`}>{icon}</span>
        </div>
      </div>
      <div>
        <p className={`text-4xl font-extrabold font-headline mt-1 ${accent ? "text-white" : "text-gray-800"}`}>{value}</p>
        <p className={`text-sm mt-1 ${accent ? "text-white/70" : "text-gray-400"}`}>{sub}</p>
      </div>
      {!accent && <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />}
    </div>
  );
}

// ── Class Card ─────────────────────────────────────────────────────────────
function ClassCard({ cls }) {
  return (
    <div className="bg-white rounded-2xl px-6 py-5 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="shrink-0 text-center min-w-[52px]">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Start</p>
        <p className="text-xl font-extrabold text-indigo-600 font-headline leading-tight">{cls.start}</p>
      </div>
      <div className="w-px h-10 bg-indigo-100 shrink-0" />
      <div className="flex-1">
        <p className="font-bold text-gray-800 font-headline">{cls.name}</p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {cls.location}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <span className="material-symbols-outlined text-sm">person</span>
            {cls.instructor}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Schedule() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScheduleApi().then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-[#EEEDF4]" />)}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-[#EEEDF4]" />)}
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="h-64 rounded-2xl bg-[#EEEDF4]" />
            <div className="h-48 rounded-2xl bg-[#EEEDF4]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Courses" value={data.stats.totalCourses} sub="Active Semester" icon="menu_book" />
        <StatCard label="Total Credits"  value={data.stats.totalCredits} sub="Targeting GPA 4.0" icon="stars" />
        <StatCard label="Weekly Hours"   value={`${data.stats.weeklyHours.toFixed(1)}`} sub="Lecture & Lab Hours" icon="schedule" accent />
      </div>

      {/* ── Schedule + Sidebar Layout ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Day-by-Day Timeline */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {data.schedule.map((dayData) => (
            <div key={dayData.day} className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-0.5 rounded-full" style={{ background: dayData.color }} />
                <h3 className="text-xl font-bold text-gray-800 font-headline">{dayData.day}</h3>
              </div>
              <div className="grid gap-4">
                {dayData.classes.map((cls) => (
                  <ClassCard key={cls.id} cls={cls} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar and Utility Widgets */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <MiniCalendar today={data.today} highlighted={data.highlighted} />
          <CampusCard />
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <span className="material-symbols-outlined text-lg">info</span>
              <span className="font-bold text-sm uppercase tracking-wider">Note</span>
            </div>
            <p className="text-sm text-indigo-900/70 leading-relaxed">
              Summer training applications open soon. Ensure all prerequisites are completed in your profile.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-8 border-t border-indigo-50 flex justify-center">
        <p className="text-xs text-gray-400 tracking-wide">© 2026 Academic Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}