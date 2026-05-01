import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  improveExperience,
  generateSummary,
  scoreATS,
  suggestSkills,
  tailorToJob,
} from "../services/ai.service";
import {
  createResume,
  updateResume,
  getResumeById,
  toggleShare,
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

  // Tailor modal
  const [tailorOpen, setTailorOpen] = useState(false);
  const [tailorJD, setTailorJD] = useState("");
  const [tailorLoading, setTailorLoading] = useState(false);

  // Share
  const [shareData, setShareData] = useState({ isPublic: false, shareId: null });
  const [shareLoading, setShareLoading] = useState(false);

  const [resume, setResume] = useState({
    title: "",
    personal: { fullName: "", title: "", email: "", phone: "", location: "" },
    summary: "",
    skills: [],
    experience: [{ role: "", company: "", description: "" }],
    education: [{ degree: "", school: "", year: "" }],
  });

  useEffect(() => {
    if (!resumeId) return;
    const loadResume = async () => {
      try {
        const res = await getResumeById(resumeId);
        if (res.success) {
          const d = res.data;
          setResume({
            title: d.title || "", personal: d.personal || { fullName: "", title: "", email: "", phone: "", location: "" },
            summary: d.summary || "", skills: d.skills || [],
            experience: d.experience?.length ? d.experience : [{ role: "", company: "", description: "" }],
            education: d.education?.length ? d.education : [{ degree: "", school: "", year: "" }],
          });
          if (d.atsScore?.score != null) setAtsResult({ score: d.atsScore.score, feedback: d.atsScore.feedback });
          if (d.shareId) setShareData({ isPublic: d.isPublic, shareId: d.shareId });
        }
      } catch { showToast("Failed to load resume", "error"); navigate("/dashboard"); }
      finally { setPageLoading(false); }
    };
    loadResume();
  }, [resumeId]);

  const handleImproveExperience = async (index) => {
    const exp = resume.experience[index];
    if (!exp.description.trim()) { showToast("Please write a description first", "error"); return; }
    try {
      setAiLoadingIndex(index);
      const res = await improveExperience({ role: exp.role, company: exp.company, description: exp.description });
      if (res.success) { const u = [...resume.experience]; u[index].description = res.data.improvedText; setResume({ ...resume, experience: u }); showToast("Experience improved!", "success"); }
    } catch (e) { showToast(e.response?.data?.message || "AI improvement failed", "error"); }
    finally { setAiLoadingIndex(null); }
  };

  const handleGenerateSummary = async () => {
    if (!resume.personal.fullName.trim() || !resume.personal.title.trim()) { showToast("Fill in your name and title first", "error"); return; }
    try {
      setSummaryLoading(true);
      const res = await generateSummary({ fullName: resume.personal.fullName, title: resume.personal.title, skills: resume.skills, experience: resume.experience });
      if (res.success) { setResume({ ...resume, summary: res.data.summary }); showToast("Summary generated!", "success"); }
    } catch (e) { showToast(e.response?.data?.message || "Summary generation failed", "error"); }
    finally { setSummaryLoading(false); }
  };

  const handleATSScore = async () => {
    try {
      setAtsLoading(true);
      const res = await scoreATS({ personal: resume.personal, summary: resume.summary, experience: resume.experience, education: resume.education, skills: resume.skills });
      if (res.success) { setAtsResult(res.data); showToast(`ATS Score: ${res.data.score}/100`, "success"); }
    } catch (e) { showToast(e.response?.data?.message || "ATS scoring failed", "error"); }
    finally { setAtsLoading(false); }
  };

  const handleSuggestSkills = async () => {
    if (!resume.personal.title.trim()) { showToast("Fill in your professional title first", "error"); return; }
    try {
      setSkillsLoading(true);
      const res = await suggestSkills({ title: resume.personal.title, experience: resume.experience, currentSkills: resume.skills });
      if (res.success) { setSuggestedSkills(res.data.skills); showToast("Skills suggested!", "success"); }
    } catch (e) { showToast(e.response?.data?.message || "Skill suggestion failed", "error"); }
    finally { setSkillsLoading(false); }
  };

  const handleSave = async () => {
    if (!resume.title.trim()) { showToast("Please enter a resume title", "error"); return; }
    try {
      setSaveLoading(true);
      const payload = { ...resume, ...(atsResult && { atsScore: { score: atsResult.score, feedback: atsResult.feedback, checkedAt: new Date().toISOString() } }) };
      if (savedId) { await updateResume(savedId, payload); showToast("Resume updated!", "success"); }
      else { const res = await createResume(payload); if (res.success) { setSavedId(res.data._id); showToast("Resume saved!", "success"); } }
    } catch (e) { showToast(e.response?.data?.message || "Save failed", "error"); }
    finally { setSaveLoading(false); }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      html2pdf().set({ margin: 0.5, filename: `${resume.personal.fullName || "resume"}.pdf`, image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "letter", orientation: "portrait" } }).from(previewRef.current).save();
      showToast("PDF exported!", "success");
    } catch { showToast("PDF export failed", "error"); }
  };

  const handleTailor = async () => {
    if (!tailorJD.trim()) { showToast("Paste a job description", "error"); return; }
    try {
      setTailorLoading(true);
      const res = await tailorToJob({ summary: resume.summary, experience: resume.experience, skills: resume.skills, jobDescription: tailorJD });
      if (res.success) {
        setResume({ ...resume, summary: res.data.summary, experience: res.data.experience });
        if (res.data.suggestedSkills?.length) setSuggestedSkills(res.data.suggestedSkills);
        showToast("Resume tailored to job!", "success");
        setTailorOpen(false); setTailorJD("");
      }
    } catch (e) { showToast(e.response?.data?.message || "Tailoring failed", "error"); }
    finally { setTailorLoading(false); }
  };

  const handleToggleShare = async () => {
    if (!savedId) { showToast("Save the resume first", "error"); return; }
    try {
      setShareLoading(true);
      const res = await toggleShare(savedId);
      if (res.success) {
        setShareData(res.data);
        if (res.data.isPublic) {
          const url = `${window.location.origin}/share/${res.data.shareId}`;
          await navigator.clipboard.writeText(url);
          showToast("Link copied to clipboard!", "success");
        } else { showToast("Sharing disabled", "success"); }
      }
    } catch { showToast("Share toggle failed", "error"); }
    finally { setShareLoading(false); }
  };

  if (pageLoading) return <div className="min-h-screen flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tailor Modal */}
      {tailorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Tailor to Job Description</h2>
            <textarea placeholder="Paste the full job description here..." value={tailorJD} onChange={(e) => setTailorJD(e.target.value)} rows={10} className="w-full border rounded-lg px-4 py-2 mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setTailorOpen(false); setTailorJD(""); }} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
              <button onClick={handleTailor} disabled={tailorLoading} className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${tailorLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                {tailorLoading && <Loader size="sm" />}{tailorLoading ? "Tailoring..." : "Tailor Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setTailorOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">🎯 Tailor to Job</button>
            <button onClick={handleToggleShare} disabled={shareLoading} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${shareData.isPublic ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
              {shareLoading && <Loader size="sm" />}{shareData.isPublic ? "🔗 Shared" : "🔗 Share"}
            </button>
            <button id="btn-save" onClick={handleSave} disabled={saveLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg disabled:bg-emerald-400 flex items-center gap-2 transition-colors">
              {saveLoading && <Loader size="sm" />}{saveLoading ? "Saving..." : "💾 Save"}
            </button>
            <button id="btn-export-pdf" onClick={handleExportPDF} className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg transition-colors">📄 Export PDF</button>
          </div>
        </div>

        {/* Share URL banner */}
        {shareData.isPublic && shareData.shareId && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
            <p className="text-sm text-green-700 truncate">{window.location.origin}/share/{shareData.shareId}</p>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${shareData.shareId}`); showToast("Copied!", "success"); }} className="text-sm text-green-700 font-medium hover:underline ml-4 shrink-0">Copy</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* FORM (LEFT) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Title */}
            <div className="bg-white rounded-xl shadow p-6">
              <label className="block text-sm font-medium mb-1">Resume Title</label>
              <input id="builder-resume-title" type="text" placeholder="e.g. Software Engineer Resume" value={resume.title} onChange={(e) => setResume({ ...resume, title: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input id="builder-fullname" type="text" value={resume.personal.fullName} onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, fullName: e.target.value } })} className="w-full border rounded-lg px-4 py-2 mb-3" />
              <label className="block text-sm font-medium mb-1">Professional Title</label>
              <input id="builder-title" type="text" value={resume.personal.title} onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, title: e.target.value } })} className="w-full border rounded-lg px-4 py-2 mb-3" />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={resume.personal.email} onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, email: e.target.value } })} className="w-full border rounded-lg px-4 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" value={resume.personal.phone} onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, phone: e.target.value } })} className="w-full border rounded-lg px-4 py-2" /></div>
              </div>
              <label className="block text-sm font-medium mb-1 mt-3">Location</label>
              <input type="text" placeholder="City, State" value={resume.personal.location} onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, location: e.target.value } })} className="w-full border rounded-lg px-4 py-2" />
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Summary</h2>
                <button id="btn-generate-summary" onClick={handleGenerateSummary} disabled={summaryLoading} className={`text-sm px-3 py-1.5 rounded-lg text-white flex items-center gap-2 transition-colors ${summaryLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                  {summaryLoading && <Loader size="sm" />}{summaryLoading ? "Generating..." : "🎯 Generate with AI"}
                </button>
              </div>
              <textarea placeholder="Professional summary..." value={resume.summary} onChange={(e) => setResume({ ...resume, summary: e.target.value })} rows={4} className="w-full border rounded-lg px-4 py-2" />
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                <button id="btn-suggest-skills" onClick={handleSuggestSkills} disabled={skillsLoading} className={`text-sm px-3 py-1.5 rounded-lg text-white flex items-center gap-2 transition-colors ${skillsLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                  {skillsLoading && <Loader size="sm" />}{skillsLoading ? "Suggesting..." : "💡 Suggest Skills"}
                </button>
              </div>
              <div className="flex gap-2 mb-4">
                <input type="text" id="skillInput" placeholder="Add a skill" className="flex-1 border rounded-lg px-4 py-2" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const v = e.target.value.trim(); if (!v) return; setResume({ ...resume, skills: [...resume.skills, v] }); e.target.value = ""; } }} />
                <button id="add-skill-btn" onClick={() => { const i = document.getElementById("skillInput"); if (!i.value.trim()) return; setResume({ ...resume, skills: [...resume.skills, i.value.trim()] }); i.value = ""; }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {skill}<button onClick={() => setResume({ ...resume, skills: resume.skills.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600 font-bold">×</button>
                  </span>
                ))}
              </div>
              {suggestedSkills.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">💡 AI Suggestions (click to add):</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((s, i) => (
                      <button key={i} onClick={() => { setResume({ ...resume, skills: [...resume.skills, s] }); setSuggestedSkills(suggestedSkills.filter((_, idx) => idx !== i)); }} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-sm hover:bg-amber-100 transition-colors">+ {s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Experience</h2>
              {resume.experience.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <input type="text" placeholder="Job Title" value={exp.role} onChange={(e) => { const u = [...resume.experience]; u[index] = { ...u[index], role: e.target.value }; setResume({ ...resume, experience: u }); }} className="w-full border rounded-lg px-3 py-2 mb-2" />
                  <input type="text" placeholder="Company" value={exp.company} onChange={(e) => { const u = [...resume.experience]; u[index] = { ...u[index], company: e.target.value }; setResume({ ...resume, experience: u }); }} className="w-full border rounded-lg px-3 py-2 mb-2" />
                  <textarea placeholder="What did you do?" value={exp.description} onChange={(e) => { const u = [...resume.experience]; u[index] = { ...u[index], description: e.target.value }; setResume({ ...resume, experience: u }); }} rows={3} className="w-full border rounded-lg px-3 py-2" />
                  <div className="flex items-center gap-2 mt-3">
                    <button disabled={aiLoadingIndex === index} onClick={() => handleImproveExperience(index)} className={`text-sm px-3 py-1.5 rounded-lg text-white flex items-center gap-2 transition-colors ${aiLoadingIndex === index ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                      {aiLoadingIndex === index && <Loader size="sm" />}{aiLoadingIndex === index ? "Improving..." : "✨ Improve with AI"}
                    </button>
                    {resume.experience.length > 1 && <button onClick={() => setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== index) })} className="text-sm text-red-500 hover:text-red-700 ml-auto">Remove</button>}
                  </div>
                </div>
              ))}
              <button id="add-experience-btn" onClick={() => setResume({ ...resume, experience: [...resume.experience, { role: "", company: "", description: "" }] })} className="bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">+ Add Experience</button>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              {resume.education.map((edu, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <input type="text" placeholder="Degree (e.g. B.S. Computer Science)" value={edu.degree} onChange={(e) => { const u = [...resume.education]; u[index] = { ...u[index], degree: e.target.value }; setResume({ ...resume, education: u }); }} className="w-full border rounded-lg px-3 py-2 mb-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="School" value={edu.school} onChange={(e) => { const u = [...resume.education]; u[index] = { ...u[index], school: e.target.value }; setResume({ ...resume, education: u }); }} className="w-full border rounded-lg px-3 py-2" />
                    <input type="text" placeholder="Year" value={edu.year} onChange={(e) => { const u = [...resume.education]; u[index] = { ...u[index], year: e.target.value }; setResume({ ...resume, education: u }); }} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  {resume.education.length > 1 && <button onClick={() => setResume({ ...resume, education: resume.education.filter((_, i) => i !== index) })} className="text-sm text-red-500 hover:text-red-700 mt-2">Remove</button>}
                </div>
              ))}
              <button id="add-education-btn" onClick={() => setResume({ ...resume, education: [...resume.education, { degree: "", school: "", year: "" }] })} className="bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">+ Add Education</button>
            </div>
          </div>

          {/* PREVIEW + ATS (RIGHT) */}
          <div className="lg:col-span-3 space-y-6">
            {/* ATS Score */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">📊 ATS Score</h2>
                <button id="btn-ats-score" onClick={handleATSScore} disabled={atsLoading} className={`text-sm px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors ${atsLoading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}>
                  {atsLoading && <Loader size="sm" />}{atsLoading ? "Analyzing..." : "Check ATS Score"}
                </button>
              </div>
              {atsResult ? (
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`text-4xl font-bold ${atsResult.score >= 80 ? "text-emerald-600" : atsResult.score >= 60 ? "text-amber-500" : "text-red-500"}`}>{atsResult.score}</div>
                    <div className="flex-1"><div className="w-full bg-gray-200 rounded-full h-3"><div className={`h-3 rounded-full transition-all duration-500 ${atsResult.score >= 80 ? "bg-emerald-500" : atsResult.score >= 60 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${atsResult.score}%` }} /></div></div>
                    <span className="text-gray-400 text-sm">/ 100</span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{atsResult.feedback}</p>
                </div>
              ) : <p className="text-sm text-gray-400">Click "Check ATS Score" to analyze your resume.</p>}
            </div>

            {/* Live Preview */}
            <div className="sticky top-10 bg-white rounded-xl shadow p-10">
              <h2 className="text-xl font-semibold mb-6">Live Preview</h2>
              <div ref={previewRef} className="border rounded-lg p-8 min-h-[500px] bg-white">
                <h1 className="text-4xl font-bold">{resume.personal.fullName || "Your Name"}</h1>
                <p className="text-lg text-gray-600 mt-1">{resume.personal.title || "Professional Title"}</p>
                {(resume.personal.email || resume.personal.phone || resume.personal.location) && (
                  <p className="text-sm text-gray-500 mt-1">{[resume.personal.email, resume.personal.phone, resume.personal.location].filter(Boolean).join(" • ")}</p>
                )}
                <hr className="my-5" />
                {resume.summary && <div className="mb-5"><h3 className="font-semibold mb-1 text-sm uppercase tracking-wide text-gray-500">Summary</h3><p className="text-sm text-gray-700">{resume.summary}</p></div>}
                {resume.skills.length > 0 && <div className="mb-5"><h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">Skills</h3><div className="flex flex-wrap gap-2">{resume.skills.map((s, i) => <span key={i} className="border px-3 py-1 rounded-full text-sm">{s}</span>)}</div></div>}
                {resume.experience.some(e => e.role || e.company || e.description) && <div className="mb-5"><h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">Experience</h3>{resume.experience.map((exp, i) => <div key={i} className="mb-3"><p className="font-medium">{exp.role || "Job Title"} {exp.company && <span className="text-gray-500">@ {exp.company}</span>}</p><p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p></div>)}</div>}
                {resume.education.some(e => e.degree || e.school) && <div className="mb-5"><h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-gray-500">Education</h3>{resume.education.map((edu, i) => <div key={i} className="mb-2"><p className="font-medium">{edu.degree || "Degree"}</p><p className="text-sm text-gray-600">{edu.school}{edu.year && ` — ${edu.year}`}</p></div>)}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
