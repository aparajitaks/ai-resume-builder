import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Welcome 👋</h1>
        <p className="text-gray-600 mt-1">
          Build, edit and download AI-powered resumes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Create Resume */}
        <div className="bg-white rounded-xl shadow p-6">
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
        <div className="bg-white rounded-xl shadow p-6 opacity-60">
          <h2 className="text-xl font-semibold mb-2">My Resumes</h2>
          <p className="text-gray-600 mb-4">
            View and edit your saved resumes.
          </p>
          <span className="text-sm bg-gray-200 px-3 py-1 rounded">
            Coming soon
          </span>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white rounded-xl shadow p-6 opacity-60">
          <h2 className="text-xl font-semibold mb-2">AI Suggestions</h2>
          <p className="text-gray-600 mb-4">
            Improve bullet points using AI.
          </p>
          <span className="text-sm bg-gray-200 px-3 py-1 rounded">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
