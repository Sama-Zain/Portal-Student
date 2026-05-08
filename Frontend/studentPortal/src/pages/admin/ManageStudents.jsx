import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllUsers, addUser, updateProfile } from "../../services/admin.service";

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:    "bg-green-100 text-green-700",
    probation: "bg-red-100 text-red-500",
    inactive:  "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${map[status] ?? map.inactive}`}>
      {status}
    </span>
  );
}

// ── GPA color ──────────────────────────────────────────────────────────────
const gpaColor = (g) => {
  if (g >= 3.7) return "text-indigo-600";
  if (g >= 3.0) return "text-purple-500";
  return "text-red-400";
};

// ── Student Modal (Add / Edit) ─────────────────────────────────────────────
function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(
    student ?? { firstName: "", lastName: "", studentId: "", major: "", email: "", gpa: "", status: "active" }
  );
  const [saving, setSaving] = useState(false);
  const isEdit = !!student;

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.studentId || !form.major || !form.email) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...form, gpa: parseFloat(form.gpa) || 0 });
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "First Name", key: "firstName", type: "text",   placeholder: "John",                  disabled: false  },
    { label: "Last Name",  key: "lastName",  type: "text",   placeholder: "Doe",                   disabled: false  },
    { label: "Student ID", key: "studentId", type: "text",   placeholder: "UC-2024-001",            disabled: isEdit },
    { label: "Email",      key: "email",     type: "email",  placeholder: "john@university.edu",   disabled: false  },
    { label: "Major",      key: "major",     type: "text",   placeholder: "Computer Science",       disabled: false  },
    { label: "GPA",        key: "gpa",       type: "number", placeholder: "3.50",                  disabled: false  },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 font-headline">
            {isEdit ? "Edit Student" : "Add New Student"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-gray-400">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {fields.map(({ label, key, type, placeholder, disabled }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500 pl-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                disabled={disabled}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl border-none outline-none text-sm transition-all
                  ${disabled
                    ? "bg-[#EEEDF4] text-gray-400 cursor-not-allowed"
                    : "bg-[#F5F3FF] text-gray-700 focus:ring-2 focus:ring-indigo-300"
                  }`}
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 pl-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3FF] border-none outline-none text-sm text-gray-700 focus:ring-2 focus:ring-indigo-300 transition-all cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            style={{ background: "linear-gradient(to right,#4b41e1,#645efb)" }}
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Student"}
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

// ── Confirm Delete ─────────────────────────────────────────────────────────
function ConfirmModal({ name, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500 text-2xl">person_remove</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Student</h3>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-gray-600">"{name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              setDeleting(true);
              await onConfirm();
              setDeleting(false);
            }}
            disabled={deleting}
            className="flex-1 py-3 rounded-full bg-red-500 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {deleting ? "Removing..." : "Remove"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ManageStudents() {
  const [students,      setStudents]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("all");
  const [showAddModal,  setShowAddModal]  = useState(false);
  const [editStudent,   setEditStudent]   = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);

  // ── Fetch students ──
  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const users = Array.isArray(res) ? res : (res.data ?? []);
        setStudents(users.filter((u) => u.role === "student"));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load students");
        setLoading(false);
      });
  }, []);

  // ── Filter ──
  const filtered = students.filter((s) => {
    const fullName = `${s.firstName ?? ""} ${s.lastName ?? ""}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      (s.studentId ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.major     ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Add → POST /user/add-user ──
  const handleAdd = async (form) => {
    try {
      const created = await addUser({ ...form, role: "student" });
      // بعض الـ backends بترجع { user: {...} } أو الـ object مباشرة
      const newStudent = created.user ?? created;
      setStudents((p) => [...p, { ...form, id: newStudent._id ?? newStudent.id ?? Date.now() }]);
      setShowAddModal(false);
      toast.success("Student added successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add student");
    }
  };

  // ── Edit → PUT /user/profile ──
  const handleEdit = async (form) => {
    try {
      await updateProfile(form);
      setStudents((p) =>
        p.map((s) => (s.id === editStudent.id || s._id === editStudent._id)
          ? { ...s, ...form }
          : s
        )
      );
      setEditStudent(null);
      toast.success("Student updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update student");
    }
  };

  // ── Delete → local state فقط (مفيش DELETE /user في الباك) ──
  const handleDelete = async () => {
    const idToDelete = deleteStudent._id ?? deleteStudent.id;
    setDeleteStudent(null);
    setStudents((p) => p.filter((s) => (s._id ?? s.id) !== idToDelete));
    toast.info("Student removed.");
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 rounded-2xl bg-[#EEEDF4]" />
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

  const activeCount = students.filter((s) => s.status === "active").length;
  const avgGpa = students.length
    ? (students.reduce((a, s) => a + (parseFloat(s.gpa) || 0), 0) / students.length).toFixed(2)
    : "0.00";

  return (
    <>
      <div className="space-y-6">

        {/* ── Hero banner ── */}
        <section className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 font-headline mb-1">
              Student Administration
            </h2>
            <p className="text-sm text-gray-400 max-w-md">
              Manage student records, academic standing, and enrollment across all programs.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            style={{ background: "linear-gradient(to right,#4b41e1,#645efb)" }}
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Add Student
          </button>
        </section>

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Students", value: students.length, icon: "group",        sub: "Enrolled"            },
            { label: "Active",         value: activeCount,     icon: "check_circle", sub: "Good standing"       },
            { label: "Average GPA",    value: avgGpa,          icon: "stars",        sub: "Across all students", accent: true },
          ].map(({ label, value, icon, sub, accent }) => (
            <div
              key={label}
              className="rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[110px] relative overflow-hidden"
              style={{ background: accent ? "linear-gradient(135deg,#5147e8,#6c66f5)" : "#fff" }}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-semibold ${accent ? "text-white/80" : "text-gray-400"}`}>{label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-white/20" : "bg-indigo-100"}`}>
                  <span className={`material-symbols-outlined text-lg ${accent ? "text-white" : "text-indigo-500"}`}>{icon}</span>
                </div>
              </div>
              <div>
                <p className={`text-4xl font-extrabold font-headline ${accent ? "text-white" : "text-gray-800"}`}>{value}</p>
                <p className={`text-sm mt-0.5 ${accent ? "text-white/70" : "text-gray-400"}`}>{sub}</p>
              </div>
              {!accent && <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />}
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-gray-100 shadow-sm outline-none text-sm text-gray-700 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "probation"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  filterStatus === f
                    ? "text-white shadow-sm"
                    : "bg-white border border-gray-100 text-gray-400 hover:border-indigo-200"
                }`}
                style={filterStatus === f ? { background: "linear-gradient(to right,#4b41e1,#645efb)" } : {}}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-4 border-b border-gray-50">
            <span className="col-span-3 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Student</span>
            <span className="col-span-2 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Student ID</span>
            <span className="col-span-3 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Major</span>
            <span className="col-span-1 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">GPA</span>
            <span className="col-span-1 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Status</span>
            <span className="col-span-2 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">person_search</span>
              <p className="text-sm font-medium">No students found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((s) => {
                const sid = s._id ?? s.id;
                const gpa = parseFloat(s.gpa) || 0;
                return (
                  <div key={sid} className="grid grid-cols-12 items-center px-8 py-5 hover:bg-[#F5F3FF]/60 transition-colors">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(s.firstName ?? s.name ?? "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {s.firstName ? `${s.firstName} ${s.lastName ?? ""}`.trim() : s.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">{s.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-mono text-gray-500">{s.studentId ?? "—"}</span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-sm text-gray-600">{s.major ?? "—"}</span>
                    </div>
                    <div className="col-span-1">
                      <span className={`font-bold text-sm ${gpaColor(gpa)}`}>{gpa.toFixed(2)}</span>
                    </div>
                    <div className="col-span-1">
                      <StatusBadge status={s.status ?? "active"} />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditStudent(s)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteStudent(s)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="px-8 py-4 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {students.length} students
            </p>
          </div>
        </div>

        <footer className="py-4 border-t border-indigo-100 flex justify-center">
          <p className="text-xs text-gray-400 tracking-wide">© 2024 The Curator. All rights reserved.</p>
        </footer>
      </div>

      {showAddModal && (
        <StudentModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
      {editStudent && (
        <StudentModal student={editStudent} onClose={() => setEditStudent(null)} onSave={handleEdit} />
      )}
      {deleteStudent && (
        <ConfirmModal
          name={deleteStudent.firstName
            ? `${deleteStudent.firstName} ${deleteStudent.lastName ?? ""}`.trim()
            : deleteStudent.name ?? "Student"}
          onConfirm={handleDelete}
          onClose={() => setDeleteStudent(null)}
        />
      )}
    </>
  );
}