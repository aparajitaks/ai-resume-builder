import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-xl">
        AI Resume Builder
      </Link>

      {user && (
        <button
          onClick={logout}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
