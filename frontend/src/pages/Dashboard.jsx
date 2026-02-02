import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded">
        <p className="text-lg font-medium mb-2">
          👋 Welcome to your AI Resume Builder
        </p>
        <p className="text-gray-600">
          Build, improve and generate resumes using AI.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
