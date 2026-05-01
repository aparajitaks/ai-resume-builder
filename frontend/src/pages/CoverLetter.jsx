import { useState, useEffect, useRef } from "react";
import { getResumes } from "../services/resume.service";
import { generateCoverLetter } from "../services/coverLetter.service";
import { useToast } from "../context/ToastContext";
import Loader from "../components/ui/Loader";

const CoverLetter = () => {
  const { showToast } = useToast();
  const letterRef = useRef(null);

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await getResumes();
        if (res.success) setResumes(res.data);
      } catch {
        showToast("Failed to load resumes", "error");
      } finally {
        setResumesLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !company.trim() || !jobDescription.trim()) {
      showToast("Please fill in all job details", "error");
      return;
    }

    const selected = resumes.find((r) => r._id === selectedResumeId);

    try {
      setLoading(true);
      const res = await generateCoverLetter({
        resumeSummary: selected?.summary || "",
        resumeExperience: selected?.experience || [],
        resumeSkills: selected?.skills || [],
        jobTitle,
        company,
        jobDescription,
      });

      if (res.success) {
        setCoverLetter(res.data.coverLetter);
        showToast("Cover letter generated!", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Generation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      showToast("Copied to clipboard!", "success");
    } catch {
      showToast("Copy failed", "error");
    }
  };

  const handleExportPDF = async () => {
    if (!letterRef.current) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      html2pdf()
        .set({
          margin: 0.75,
          filename: `Cover_Letter_${company}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(letterRef.current)
        .save();
      showToast("PDF exported!", "success");
    } catch {
      showToast("PDF export failed", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI Cover Letter Generator</h1>
        <p className="text-gray-600 mt-1">
          Generate tailored cover letters for every job application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── LEFT: Form ── */}
        <div className="space-y-6">
          {/* Resume Selector */}
          <div className="bg-white rounded-xl shadow p-6">
            <label className="block text-sm font-medium mb-2">
              Select a Resume (optional — for context)
            </label>
            {resumesLoading ? (
              <Loader size="sm" />
            ) : (
              <select
                id="cl-resume-select"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">-- No resume --</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title} — {r.personal?.fullName || "No name"}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Job Details</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input
                id="cl-job-title"
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                id="cl-company"
                type="text"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <textarea
                id="cl-job-description"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <button
              id="btn-generate-cl"
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading && <Loader size="sm" />}
              {loading ? "Generating..." : "✨ Generate Cover Letter"}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Output ── */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Cover Letter</h2>
            {coverLetter && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  📋 Copy
                </button>
                <button
                  onClick={handleExportPDF}
                  className="text-sm bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  📄 PDF
                </button>
              </div>
            )}
          </div>

          {coverLetter ? (
            <div
              ref={letterRef}
              className="border rounded-lg p-6 min-h-[400px] bg-white"
            >
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full min-h-[400px] text-sm text-gray-700 leading-relaxed resize-none border-0 focus:outline-none"
              />
            </div>
          ) : (
            <div className="border rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <p className="text-gray-400 text-center">
                Fill in the job details and click
                <br />
                "Generate Cover Letter" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
