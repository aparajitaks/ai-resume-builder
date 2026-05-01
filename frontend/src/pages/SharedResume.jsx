import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicResume } from "../services/resume.service";
import Loader from "../components/ui/Loader";

const SharedResume = () => {
  const { shareId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await getPublicResume(shareId);
        if (res.success) {
          setResume(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Resume not found");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400">
            Shared via AI Resume Builder
          </p>
        </div>

        {/* Resume Card */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold">
            {resume.personal?.fullName || "Name"}
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            {resume.personal?.title || "Professional"}
          </p>

          {(resume.personal?.email || resume.personal?.phone || resume.personal?.location) && (
            <p className="text-sm text-gray-500 mt-1">
              {[resume.personal.email, resume.personal.phone, resume.personal.location]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}

          <hr className="my-6" />

          {/* Summary */}
          {resume.summary && (
            <div className="mb-6">
              <h3 className="font-semibold mb-1 text-sm uppercase tracking-wide text-gray-500">
                Summary
              </h3>
              <p className="text-sm text-gray-700">{resume.summary}</p>
            </div>
          )}

          {/* Skills */}
          {resume.skills?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="border px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resume.experience?.length > 0 &&
            resume.experience.some((e) => e.role || e.company || e.description) && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
                  Experience
                </h3>
                {resume.experience.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-medium">
                      {exp.role || "Role"}{" "}
                      {exp.company && (
                        <span className="text-gray-500">@ {exp.company}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

          {/* Education */}
          {resume.education?.length > 0 &&
            resume.education.some((e) => e.degree || e.school) && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
                  Education
                </h3>
                {resume.education.map((edu, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-medium">{edu.degree || "Degree"}</p>
                    <p className="text-sm text-gray-600">
                      {edu.school}
                      {edu.year && ` — ${edu.year}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

          {/* ATS Score badge */}
          {resume.atsScore?.score != null && (
            <div className="mt-6 pt-4 border-t">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  resume.atsScore.score >= 80
                    ? "bg-emerald-100 text-emerald-700"
                    : resume.atsScore.score >= 60
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                ATS Score: {resume.atsScore.score}/100
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedResume;
