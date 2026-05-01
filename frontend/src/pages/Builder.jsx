import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  improveExperience,
  generateSummary,
  scoreATS,
  suggestSkills,
} from "../services/ai.service";
import {
  createResume,
  updateResume,
  getResumeById,
} from "../services/resume.service";
import { useToast } from "../context/ToastContext";
import Loader from "../components/ui/Loader";

const Builder = () => {
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const previewRef = useRef(null);

  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [atsLoading, setAtsLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!resumeId);
  const [savedId, setSavedId] = useState(resumeId || null);

  const [atsResult, setAtsResult] = useState(null);
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  const [resume, setResume] = useState({
    title: "",
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    skills: [],
    experience: [{ role: "", company: "", description: "" }],
    education: [{ degree: "", school: "", year: "" }],
  });

  // ── Load existing resume ──
  useEffect(() => {
    if (!resumeId) return;

    const loadResume = async () => {
      try {
        const res = await getResumeById(resumeId);
        if (res.success) {
          const data = res.data;
          setResume({
            title: data.title || "",
            personal: data.personal || { fullName: "", title: "", email: "", phone: "", location: "" },
            summary: data.summary || "",
            skills: data.skills || [],
            experience: data.experience?.length ? data.experience : [{ role: "", company: "", description: "" }],
            education: data.education?.length ? data.education : [{ degree: "", school: "", year: "" }],
          });
          if (data.atsScore?.score !== null && data.atsScore?.score !== undefined) {
            setAtsResult({ score: data.atsScore.score, feedback: data.atsScore.feedback });
          }
        }
      } catch (error) {
        showToast("Failed to load resume", "error");
        navigate("/dashboard");
      } finally {
        setPageLoading(false);
      }
    };

    loadResume();
  }, [resumeId]);

  // ── AI: Improve Experience ──
  const handleImproveExperience = async (index) => {
    const exp = resume.experience[index];
    if (!exp.description.trim()) {
      showToast("Please write a description first", "error");
      return;
    }
    try {
      setAiLoadingIndex(index);
      const res = await improveExperience({
        role: exp.role,
        company: exp.company,
        description: exp.description,
      });
      if (res.success) {
        const updated = [...resume.experience];
        updated[index].description = res.data.improvedText;
        setResume({ ...resume, experience: updated });
        showToast("Experience improved with AI!", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "AI improvement failed", "error");
    } finally {
      setAiLoadingIndex(null);
    }
  };

  // ── AI: Generate Summary ──
  const handleGenerateSummary = async () => {
    if (!resume.personal.fullName.trim() || !resume.personal.title.trim()) {
      showToast("Fill in your name and title first", "error");
      return;
    }
    try {
      setSummaryLoading(true);
      const res = await generateSummary({
        fullName: resume.personal.fullName,
        title: resume.personal.title,
        skills: resume.skills,
        experience: resume.experience,
      });
      if (res.success) {
        setResume({ ...resume, summary: res.data.summary });
        showToast("Summary generated!", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Summary generation failed", "error");
    } finally {
      setSummaryLoading(false);
    }
  };

  // ── AI: ATS Score ──
  const handleATSScore = async () => {
    try {
      setAtsLoading(true);
      const res = await scoreATS({
        personal: resume.personal,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
      });
      if (res.success) {
        setAtsResult(res.data);
        showToast(`ATS Score: ${res.data.score}/100`, "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "ATS scoring failed", "error");
    } finally {
      setAtsLoading(false);
    }
  };

  // ── AI: Suggest Skills ──
  const handleSuggestSkills = async () => {
    if (!resume.personal.title.trim()) {
      showToast("Fill in your professional title first", "error");
      return;
    }
    try {
      setSkillsLoading(true);
      const res = await suggestSkills({
        title: resume.personal.title,
        experience: resume.experience,
        currentSkills: resume.skills,
      });
      if (res.success) {
        setSuggestedSkills(res.data.skills);
        showToast("Skills suggested!", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Skill suggestion failed", "error");
    } finally {
      setSkillsLoading(false);
    }
  };

  // ── Save Resume ──
  const handleSave = async () => {
    if (!resume.title.trim()) {
      showToast("Please enter a resume title", "error");
      return;
    }
    try {
      setSaveLoading(true);
      const payload = {
        ...resume,
        ...(atsResult && {
          atsScore: {
            score: atsResult.score,
            feedback: atsResult.feedback,
            checkedAt: new Date().toISOString(),
          },
        }),
      };

      if (savedId) {
        await updateResume(savedId, payload);
        showToast("Resume updated!", "success");
      } else {
        const res = await createResume(payload);
        if (res.success) {
          setSavedId(res.data._id);
          showToast("Resume saved!", "success");
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Save failed", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  // ── PDF Export ──
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.5,
        filename: `${resume.personal.fullName || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().set(opt).from(previewRef.current).save();
      showToast("PDF exported!", "success");
    } catch (error) {
      showToast("PDF export failed", "error");
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <div className="flex gap-3">
            <button
              id="btn-save"
              onClick={handleSave}
              disabled={saveLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {saveLoading && <Loader size="sm" />}
              {saveLoading ? "Saving..." : "💾 Save"}
            </button>
            <button
              id="btn-export-pdf"
              onClick={handleExportPDF}
              className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ================= FORM (LEFT) ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Title */}
            <div className="bg-white rounded-xl shadow p-6">
              <label className="block text-sm font-medium mb-1">Resume Title</label>
              <input
                id="builder-resume-title"
                type="text"
                placeholder="e.g. Software Engineer Resume"
                value={resume.title}
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                id="builder-fullname"
                type="text"
                value={resume.personal.fullName}
                onChange={(e) =>
                  setResume({ ...resume, personal: { ...resume.personal, fullName: e.target.value } })
                }
                className="w-full border rounded-lg px-4 py-2 mb-3"
              />

              <label className="block text-sm font-medium mb-1">Professional Title</label>
              <input
                id="builder-title"
                type="text"
                value={resume.personal.title}
                onChange={(e) =>
                  setResume({ ...resume, personal: { ...resume.personal, title: e.target.value } })
                }
                className="w-full border rounded-lg px-4 py-2 mb-3"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.personal.email}
                    onChange={(e) =>
                      setResume({ ...resume, personal: { ...resume.personal, email: e.target.value } })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={resume.personal.phone}
                    onChange={(e) =>
                      setResume({ ...resume, personal: { ...resume.personal, phone: e.target.value } })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <label className="block text-sm font-medium mb-1 mt-3">Location</label>
              <input
                type="text"
                placeholder="City, State"
                value={resume.personal.location}
                onChange={(e) =>
                  setResume({ ...resume, personal: { ...resume.personal, location: e.target.value } })
                }
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Summary</h2>
                <button
                  id="btn-generate-summary"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                  className={`text-sm px-3 py-1.5 rounded-lg text-white flex items-center gap-2 transition-colors ${
                    summaryLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {summaryLoading && <Loader size="sm" />}
                  {summaryLoading ? "Generating..." : "🎯 Generate with AI"}
                </button>
              </div>
              <textarea
                placeholder="Professional summary..."
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                rows={4}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                <button
                  id="btn-suggest-skills"
                  onClick={handleSuggestSkills}
                  disabled={skillsLoading}
                  className={`text-sm px-3 py-1.5 rounded-lg text-white flex items-center gap-2 transition-colors ${
                    skillsLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {skillsLoading && <Loader size="sm" />}
                  {skillsLoading ? "Suggesting..." : "💡 Suggest Skills"}
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  id="skillInput"
                  placeholder="Add a skill"
                  className="flex-1 border rounded-lg px-4 py-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (!value) return;
                      setResume({ ...resume, skills: [...resume.skills, value] });
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  id="add-skill-btn"
                  onClick={() => {
                    const input = document.getElementById("skillInput");
                    if (!input.value.trim()) return;
                    setResume({ ...resume, skills: [...resume.skills, input.value.trim()] });
                    input.value = "";
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() =>
                        setResume({ ...resume, skills: resume.skills.filter((_, i) => i !== index) })
                      }
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* AI Suggested Skills */}
              {suggestedSkills.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">💡 AI Suggestions (click to add):</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setResume({ ...resume, skills: [...resume.skills, skill] });
                          setSuggestedSkills(suggestedSkills.filter((_, idx) => idx !== i));
                        }}
                        className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-sm hover:bg-amber-100 transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Experience</h2>

              {resume.experience.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4 relative">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[index] = { ...updated[index], role: e.target.value };
                      setResume({ ...resume, experience: updated });
                    }}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[index] = { ...updated[index], company: e.target.value };
                      setResume({ ...resume, experience: updated });
                    }}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                  />
                  <textarea
                    placeholder="What did you do in this role?"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[index] = { ...updated[index], description: e.target.value };
                      setResume({ ...resume, experience: updated });
                    }}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      disabled={aiLoadingIndex === index}
                      onClick={() => handleImproveExperience(index)}
                      className={`text-sm px-3 py-1.5 rounded-lg text-white flex items-center gap-2 transition-colors ${
                        aiLoadingIndex === index
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {aiLoadingIndex === index && <Loader size="sm" />}
                      {aiLoadingIndex === index ? "Improving..." : "✨ Improve with AI"}
                    </button>
                    {resume.experience.length > 1 && (
                      <button
                        onClick={() =>
                          setResume({
                            ...resume,
                            experience: resume.experience.filter((_, i) => i !== index),
                          })
                        }
                        className="text-sm text-red-500 hover:text-red-700 ml-auto"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                id="add-experience-btn"
                onClick={() =>
                  setResume({
                    ...resume,
                    experience: [...resume.experience, { role: "", company: "", description: "" }],
                  })
                }
                className="bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + Add Experience
              </button>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>

              {resume.education.map((edu, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    placeholder="Degree (e.g. B.S. Computer Science)"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[index] = { ...updated[index], degree: e.target.value };
                      setResume({ ...resume, education: updated });
                    }}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="School / University"
                      value={edu.school}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[index] = { ...updated[index], school: e.target.value };
                        setResume({ ...resume, education: updated });
                      }}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g. 2020)"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[index] = { ...updated[index], year: e.target.value };
                        setResume({ ...resume, education: updated });
                      }}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  {resume.education.length > 1 && (
                    <button
                      onClick={() =>
                        setResume({
                          ...resume,
                          education: resume.education.filter((_, i) => i !== index),
                        })
                      }
                      className="text-sm text-red-500 hover:text-red-700 mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                id="add-education-btn"
                onClick={() =>
                  setResume({
                    ...resume,
                    education: [...resume.education, { degree: "", school: "", year: "" }],
                  })
                }
                className="bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + Add Education
              </button>
            </div>
          </div>

          {/* ================= PREVIEW + ATS (RIGHT) ================= */}
          <div className="lg:col-span-3 space-y-6">
            {/* ATS Score Panel */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">📊 ATS Score</h2>
                <button
                  id="btn-ats-score"
                  onClick={handleATSScore}
                  disabled={atsLoading}
                  className={`text-sm px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors ${
                    atsLoading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {atsLoading && <Loader size="sm" />}
                  {atsLoading ? "Analyzing..." : "Check ATS Score"}
                </button>
              </div>

              {atsResult ? (
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`text-4xl font-bold ${
                        atsResult.score >= 80
                          ? "text-emerald-600"
                          : atsResult.score >= 60
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {atsResult.score}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            atsResult.score >= 80
                              ? "bg-emerald-500"
                              : atsResult.score >= 60
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${atsResult.score}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">/ 100</span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{atsResult.feedback}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Click "Check ATS Score" to analyze your resume against ATS systems.
                </p>
              )}
            </div>

            {/* Live Preview */}
            <div className="sticky top-10 bg-white rounded-xl shadow p-10">
              <h2 className="text-xl font-semibold mb-6">Live Preview</h2>

              <div ref={previewRef} className="border rounded-lg p-8 min-h-[500px] bg-white">
                <h1 className="text-4xl font-bold">
                  {resume.personal.fullName || "Your Name"}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {resume.personal.title || "Professional Title"}
                </p>

                {/* Contact line */}
                {(resume.personal.email || resume.personal.phone || resume.personal.location) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {[resume.personal.email, resume.personal.phone, resume.personal.location]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}

                <hr className="my-5" />

                {/* Summary */}
                {resume.summary && (
                  <div className="mb-5">
                    <h3 className="font-semibold mb-1 text-sm uppercase tracking-wide text-gray-500">
                      Summary
                    </h3>
                    <p className="text-sm text-gray-700">{resume.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {resume.skills.length > 0 && (
                  <div className="mb-5">
                    <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill, i) => (
                        <span key={i} className="border px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {resume.experience.some((e) => e.role || e.company || e.description) && (
                  <div className="mb-5">
                    <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
                      Experience
                    </h3>
                    {resume.experience.map((exp, i) => (
                      <div key={i} className="mb-3">
                        <p className="font-medium">
                          {exp.role || "Job Title"}{" "}
                          {exp.company && <span className="text-gray-500">@ {exp.company}</span>}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {resume.education.some((e) => e.degree || e.school) && (
                  <div className="mb-5">
                    <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">
                      Education
                    </h3>
                    {resume.education.map((edu, i) => (
                      <div key={i} className="mb-2">
                        <p className="font-medium">{edu.degree || "Degree"}</p>
                        <p className="text-sm text-gray-600">
                          {edu.school}{edu.year && ` — ${edu.year}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
