import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Build, edit and download AI-powered resumes.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Resume */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">
            Create Resume
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Start building a new resume with AI assistance.
          </p>
          <Link
            to="/builder"
            className="inline-block text-indigo-600 font-medium hover:underline"
          >
            Start →
          </Link>
        </div>

        {/* My Resumes */}
        <div className="bg-white rounded-xl shadow p-6 opacity-80">
          <h2 className="text-xl font-semibold mb-2">
            My Resumes
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            View and edit your saved resumes.
          </p>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded">
            Coming Soon
          </span>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white rounded-xl shadow p-6 opacity-80">
          <h2 className="text-xl font-semibold mb-2">
            AI Suggestions
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Improve bullet points using AI.
          </p>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
