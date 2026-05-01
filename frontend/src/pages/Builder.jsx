import { useState } from "react";
import { improveExperience } from "../services/ai.service";
import { useToast } from "../context/ToastContext";
import Loader from "../components/ui/Loader";

const Builder = () => {
  const { showToast } = useToast();
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);

  const [resume, setResume] = useState({
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
    },
    skills: [],
    experience: [{ role: "", company: "", description: "" }],
    education: [],
  });

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
      const message =
        error.response?.data?.message || "AI improvement failed";
      showToast(message, "error");
    } finally {
      setAiLoadingIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ================= FORM (LEFT) ================= */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Personal Details
            </h2>

            {/* Full Name */}
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="builder-fullname"
              type="text"
              value={resume.personal.fullName}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: {
                    ...resume.personal,
                    fullName: e.target.value,
                  },
                })
              }
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            {/* Title */}
            <label className="block text-sm font-medium mb-1">
              Professional Title
            </label>
            <input
              id="builder-title"
              type="text"
              value={resume.personal.title}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: {
                    ...resume.personal,
                    title: e.target.value,
                  },
                })
              }
              className="w-full border rounded-lg px-4 py-2"
            />

            {/* ================= SKILLS ================= */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>

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
                      setResume({
                        ...resume,
                        skills: [...resume.skills, value],
                      });
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  id="add-skill-btn"
                  onClick={() => {
                    const input = document.getElementById("skillInput");
                    if (!input.value.trim()) return;

                    setResume({
                      ...resume,
                      skills: [...resume.skills, input.value.trim()],
                    });

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
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() =>
                        setResume({
                          ...resume,
                          skills: resume.skills.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                      className="text-red-500 font-bold hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* ================= EXPERIENCE ================= */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Experience</h2>

              {resume.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 mb-4 relative"
                >
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[index].role = e.target.value;
                      setResume({
                        ...resume,
                        experience: updated,
                      });
                    }}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[index].company = e.target.value;
                      setResume({
                        ...resume,
                        experience: updated,
                      });
                    }}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                  />

                  <textarea
                    placeholder="What did you do in this role?"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[index].description = e.target.value;
                      setResume({
                        ...resume,
                        experience: updated,
                      });
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
                      {aiLoadingIndex === index
                        ? "Improving..."
                        : "✨ Improve with AI"}
                    </button>

                    {resume.experience.length > 1 && (
                      <button
                        onClick={() =>
                          setResume({
                            ...resume,
                            experience: resume.experience.filter(
                              (_, i) => i !== index
                            ),
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
                    experience: [
                      ...resume.experience,
                      {
                        role: "",
                        company: "",
                        description: "",
                      },
                    ],
                  })
                }
                className="bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + Add Experience
              </button>
            </div>
          </div>

          {/* ================= PREVIEW (RIGHT) ================= */}
          <div className="lg:col-span-3">
            <div className="sticky top-10 bg-white rounded-xl shadow p-10">
              <h2 className="text-xl font-semibold mb-6">
                Live Preview
              </h2>

              <div className="border rounded-lg p-8 min-h-[500px]">
                <h1 className="text-4xl font-bold">
                  {resume.personal.fullName || "Your Name"}
                </h1>

                <p className="text-lg text-gray-600 mt-2">
                  {resume.personal.title || "Software Engineer"}
                </p>

                <hr className="my-6" />

                {/* Skills Preview */}
                {resume.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Skills</h3>
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

                {/* Experience Preview */}
                {resume.experience.some(
                  (e) => e.role || e.company || e.description
                ) && (
                  <div>
                    <h3 className="font-semibold mb-3">Experience</h3>
                    {resume.experience.map((exp, i) => (
                      <div key={i} className="mb-4">
                        <p className="font-medium">
                          {exp.role || "Job Title"}{" "}
                          {exp.company && (
                            <span className="text-gray-600">
                              @ {exp.company}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-6">
                  This preview reflects how your resume will look.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
