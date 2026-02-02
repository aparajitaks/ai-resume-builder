import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthLayout = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise allow login / register pages
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
