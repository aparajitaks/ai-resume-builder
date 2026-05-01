import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getResumeStats } from "../services/resume.service";
import Loader from "../components/ui/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getResumeStats();
        if (res.success) setStats(res.data);
      } catch {
        // Fail silently — dashboard still usable
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

      {/* ── Stats Cards ── */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader size="md" />
        </div>
      ) : stats ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-indigo-600">
              {stats.totalResumes}
            </p>
            <p className="text-gray-500 mt-1">Total Resumes</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p
              className={`text-4xl font-bold ${
                stats.avgAtsScore != null
                  ? stats.avgAtsScore >= 80
                    ? "text-emerald-600"
                    : stats.avgAtsScore >= 60
                    ? "text-amber-500"
                    : "text-red-500"
                  : "text-gray-300"
              }`}
            >
              {stats.avgAtsScore != null ? stats.avgAtsScore : "—"}
            </p>
            <p className="text-gray-500 mt-1">Avg ATS Score</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p
              className={`text-4xl font-bold ${
                stats.bestAtsScore != null
                  ? stats.bestAtsScore >= 80
                    ? "text-emerald-600"
                    : stats.bestAtsScore >= 60
                    ? "text-amber-500"
                    : "text-red-500"
                  : "text-gray-300"
              }`}
            >
              {stats.bestAtsScore != null ? stats.bestAtsScore : "—"}
            </p>
            <p className="text-gray-500 mt-1">Best ATS Score</p>
          </div>
        </div>
      ) : null}

      {/* ── Quick Actions ── */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">📝 Create Resume</h2>
          <p className="text-gray-600 text-sm mb-4">
            Build a new resume with AI.
          </p>
          <Link to="/builder" className="text-indigo-600 font-medium hover:underline text-sm">
            Start →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">📋 My Resumes</h2>
          <p className="text-gray-600 text-sm mb-4">
            View and manage saved resumes.
          </p>
          <Link to="/my-resumes" className="text-indigo-600 font-medium hover:underline text-sm">
            View All →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">✉️ Cover Letter</h2>
          <p className="text-gray-600 text-sm mb-4">
            AI-generate tailored cover letters.
          </p>
          <Link to="/cover-letter" className="text-indigo-600 font-medium hover:underline text-sm">
            Generate →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">🎯 Tailor Resume</h2>
          <p className="text-gray-600 text-sm mb-4">
            Tailor your resume to a job description.
          </p>
          <Link to="/builder" className="text-indigo-600 font-medium hover:underline text-sm">
            Try Now →
          </Link>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      {stats?.recentResumes?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow divide-y">
            {stats.recentResumes.map((r) => (
              <Link
                key={r._id}
                to={`/builder/${r._id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-gray-500">
                    {r.personal?.fullName}
                    {r.personal?.title && ` — ${r.personal.title}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {r.atsScore?.score != null && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        r.atsScore.score >= 80
                          ? "bg-emerald-100 text-emerald-700"
                          : r.atsScore.score >= 60
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.atsScore.score}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
