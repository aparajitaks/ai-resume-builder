import { Outlet, Navigate } from "react-router-dom";
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

  return (
    <div className="min-h-screen flex">
      {/* Left side (Brand / Info) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-4xl font-bold mb-4">AI Resume Builder</h1>
          <p className="text-lg opacity-90">
            Build professional, ATS-friendly resumes using AI.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
