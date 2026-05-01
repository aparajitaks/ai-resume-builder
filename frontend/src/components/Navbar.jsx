import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="font-bold text-lg hover:opacity-90">
        AI Resume Builder
      </Link>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-indigo-200">
            {user.email || ""}
          </span>
          <button
            id="navbar-logout"
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-1.5 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
