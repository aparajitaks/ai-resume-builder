import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResumes, deleteResume } from "../services/resume.service";
import { useToast } from "../context/ToastContext";
import Loader from "../components/ui/Loader";

const MyResumes = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await getResumes();
      if (res.success) {
        setResumes(res.data);
      }
    } catch (error) {
      showToast("Failed to load resumes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      setDeletingId(id);
      await deleteResume(id);
      setResumes(resumes.filter((r) => r._id !== id));
      showToast("Resume deleted", "success");
    } catch (error) {
      showToast("Failed to delete resume", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-700";
    if (score >= 60) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-gray-600 mt-1">
            {resumes.length} resume{resumes.length !== 1 && "s"} saved
          </p>
        </div>
        <Link
          to="/builder"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors"
        >
          + New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No resumes yet</p>
          <Link
            to="/builder"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create your first resume →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-semibold line-clamp-1">
                  {resume.title || "Untitled"}
                </h2>
                {resume.atsScore?.score != null && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getScoreColor(
                      resume.atsScore.score
                    )}`}
                  >
                    ATS {resume.atsScore.score}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-1">
                {resume.personal?.fullName || "No name"}
                {resume.personal?.title && ` — ${resume.personal.title}`}
              </p>

              <p className="text-xs text-gray-400 mb-4">
                Updated {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              <div className="mt-auto flex items-center gap-3 pt-3 border-t">
                <button
                  onClick={() => navigate(`/builder/${resume._id}`)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(resume._id)}
                  disabled={deletingId === resume._id}
                  className="text-sm text-red-500 hover:text-red-700 font-medium disabled:text-gray-400"
                >
                  {deletingId === resume._id ? "Deleting..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResumes;
