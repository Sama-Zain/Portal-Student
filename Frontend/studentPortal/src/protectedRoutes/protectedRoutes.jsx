
import LoadingSpinner from './../components/LoadingSpinner';
import { useAuth } from "../context/AuthContext";
import { Navigate } from 'react-router-dom';
export default function ProtectedRoutes({ children, role }) {

  const { user, token, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!token) return <Navigate to="/login" replace />;

  if (role && user?.role !== role) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
}