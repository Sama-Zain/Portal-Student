
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

// layouts
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

// auth
import ProtectedRoutes from "./protectedRoutes/protectedRoutes";

// pages
import Login from "./pages/Login";

// student
import StudentDashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Schedule from "./pages/student/Schedule";
import Grades from "./pages/student/Grades";
import CourseRegistration from "./pages/student/CourseRegistration";

// admin
import AdminDashboard from "./pages/admin/Dashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCourses from "./pages/admin/ManageCourses";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },

      // ================= STUDENT =================
      {
        path: "student",
        element: (
          <ProtectedRoutes role="student">
            <StudentLayout />
          </ProtectedRoutes>
        ),
        children: [
          { path: "dashboard", element: <StudentDashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "schedule", element: <Schedule /> },
          { path: "grades", element: <Grades /> },
          { path: "courses", element: <CourseRegistration /> },
        ],
      },

      // ================= ADMIN =================
      {
        path: "admin",
        element: (
          <ProtectedRoutes role="admin">
            <AdminLayout />
          </ProtectedRoutes>
        ),
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "students", element: <ManageStudents /> },
          { path: "courses", element: <ManageCourses /> },

        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;