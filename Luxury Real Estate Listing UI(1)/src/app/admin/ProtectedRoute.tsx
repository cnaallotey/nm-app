import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
