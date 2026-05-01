import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Build, edit and download AI-powered resumes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Create Resume */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Create Resume</h2>
          <p className="text-gray-600 mb-4">
            Start building a new resume with AI assistance.
          </p>
          <Link
            to="/builder"
            className="text-indigo-600 font-medium hover:underline"
          >
            Start →
          </Link>
        </div>

        {/* My Resumes */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">My Resumes</h2>
          <p className="text-gray-600 mb-4">
            View, edit, and manage your saved resumes.
          </p>
          <Link
            to="/my-resumes"
            className="text-indigo-600 font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* AI Features */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">AI Features</h2>
          <p className="text-gray-600 mb-4">
            ATS scoring, skill suggestions, and smart summaries.
          </p>
          <Link
            to="/builder"
            className="text-indigo-600 font-medium hover:underline"
          >
            Try Now →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
