import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
          AI Resume Builder
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/builder"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Builder
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Dashboard
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
