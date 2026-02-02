import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">
        AI Resume Builder
      </h1>

      <div className="flex gap-4 items-center">
        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
          Dashboard
        </Link>
        <Link to="/builder" className="text-gray-700 hover:text-indigo-600">
          Builder
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
