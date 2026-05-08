import { useState } from "react";
import { toast } from "react-toastify";

// ── Initial mock data (no backend yet) ────────────────────────────────────
const INITIAL_COURSES = [
  { id: 1, name: "Advanced Algorithms",  instructor: "Dr. Sarah Jenkins",  credits: 4.0, code: "CS-401" },
  { id: 2, name: "Machine Learning",     instructor: "Prof. Robert Chen",  credits: 3.0, code: "AI-301" },
  { id: 3, name: "Database Systems",     instructor: "Dr. Elena Sterling", credits: 3.0, code: "CS-305" },
  { id: 4, name: "Operating Systems",    instructor: "Prof. Marcus Liu",   credits: 4.0, code: "CS-402" },
  { id: 5, name: "Web Development",      instructor: "Dr. Michael Vane",   credits: 3.0, code: "CS-210" },
];

// ── Modal ──────────────────────────────────────────────────────────────────
function CourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState(
    course ?? { name: "", instructor: "", credits: "", code: "" }
  );
  const [saving, setSaving] = useState(false);
  const isEdit = !!course;

  const handleSubmit = async () => {
    if (!form.name || !form.instructor || !form.credits || !form.code) {
      toast.error("Please fill all fields.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onSave({ ...form, credits: parseFloat(form.credits) });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 font-headline">
            {isEdit ? "Edit Course" : "Add New Course"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-gray-400">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Course Name", key: "name",       type: "text",   placeholder: "e.g. Advanced Algorithms" },
            { label: "Course Code", key: "code",       type: "text",   placeholder: "e.g. CS-401"             },
            { label: "Instructor",  key: "instructor", type: "text",   placeholder: "e.g. Dr. Sarah Jenkins"  },
            { label: "Credits",     key: "credits",    type: "number", placeholder: "e.g. 3.0"               },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500 pl-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] border-none outline-none text-sm text-gray-700 focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            style={{ background: "linear-gradient(to right,#4b41e1,#645efb)" }}
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Course"}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3 rounded-full border border-indigo-200 text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Delete Modal ───────────────────────────────────────────────────
function ConfirmModal({ courseName, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    onConfirm();
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500 text-2xl">delete</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Course</h3>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-600">"{courseName}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-3 rounded-full bg-red-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ManageCourses() {
  const [courses,      setCourses]      = useState(INITIAL_COURSES);
  const [search,       setSearch]       = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCourse,   setEditCourse]   = useState(null);
  const [deleteCourse, setDeleteCourse] = useState(null);

  // ── Filter ──
  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  // ── Add ──
  const handleAdd = (form) => {
    setCourses((prev) => [...prev, { ...form, id: Date.now() }]);
    setShowAddModal(false);
    toast.success("Course added successfully!");
  };

  // ── Edit ──
  const handleEdit = (form) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === editCourse.id ? { ...c, ...form } : c))
    );
    setEditCourse(null);
    toast.success("Course updated!");
  };

  // ── Delete ──
  const handleDelete = () => {
    const idToDelete = deleteCourse.id;
    setDeleteCourse(null);
    setCourses((prev) => prev.filter((c) => c.id !== idToDelete));
    toast.info("Course deleted.");
  };

  return (
    <>
      <div className="space-y-6">

        {/* ── Hero banner ── */}
        <section className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-headline mb-1">
              Curriculum Administration
            </h2>
            <p className="text-sm text-gray-400 max-w-md">
              Oversee course offerings, manage instructor assignments, and ensure academic rigor across all disciplines.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            style={{ background: "linear-gradient(to right,#4b41e1,#645efb)" }}
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add Course
          </button>
        </section>

        {/* ── Search bar ── */}
        <div className="relative max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-gray-100 shadow-sm outline-none text-sm text-gray-700 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-4 border-b border-gray-50">
            <span className="col-span-4 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Course Name</span>
            <span className="col-span-3 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Instructor</span>
            <span className="col-span-2 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Credits</span>
            <span className="col-span-1 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Code</span>
            <span className="col-span-2 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="text-sm font-medium">No courses found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 items-center px-8 py-5 hover:bg-[#F5F3FF]/60 transition-colors"
                >
                  <div className="col-span-4">
                    <p className="font-bold text-gray-800">{course.name}</p>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {course.instructor.split(" ").pop()[0]}
                    </div>
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                      {course.credits.toFixed(1)}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs text-gray-400 font-mono">{course.code}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditCourse(course)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteCourse(course)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-8 py-4 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {courses.length} courses
            </p>
          </div>
        </div>

        <footer className="py-4 border-t border-indigo-100 flex justify-center">
          <p className="text-xs text-gray-400 tracking-wide">© 2024 The Curator. All rights reserved.</p>
        </footer>
      </div>

      {showAddModal && (
        <CourseModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
      {editCourse && (
        <CourseModal course={editCourse} onClose={() => setEditCourse(null)} onSave={handleEdit} />
      )}
      {deleteCourse && (
        <ConfirmModal
          courseName={deleteCourse.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteCourse(null)}
        />
      )}
    </>
  );
}