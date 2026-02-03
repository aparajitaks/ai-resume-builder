import { useState } from "react";

const [aiLoadingIndex, setAiLoadingIndex] = useState(null);
const Builder = () => {
  const [resume, setResume] = useState({
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
    },
    skills: [],
    experience: [
      { role: "", company: "", description: "" },
    ],
    education: [],
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-red-500">
          Resume Builder
        </h1>

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
              <h2 className="text-xl font-semibold mb-4">
                Skills
              </h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  id="skillInput"
                  placeholder="Add a skill"
                  className="flex-1 border rounded-lg px-4 py-2"
                />
                <button
                  onClick={() => {
                    const input =
                      document.getElementById("skillInput");
                    if (!input.value) return;

                    setResume({
                      ...resume,
                      skills: [...resume.skills, input.value],
                    });

                    input.value = "";
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
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
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* ================= EXPERIENCE ================= */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">
                Experience
              </h2>

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
                      updated[index].description =
                        e.target.value;
                      setResume({
                        ...resume,
                        experience: updated,
                      });
                    }}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  {resume.experience.length > 1 && (
                    <button
  disabled={aiLoadingIndex === index}
  onClick={async () => {
    try {
      setAiLoadingIndex(index);

      const response = await fetch(
        "http://localhost:5001/api/ai/improve-experience",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: exp.role,
            company: exp.company,
            description: exp.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI failed");
      }

      const updated = [...resume.experience];
      updated[index].description = data.improvedText;
      setResume({ ...resume, experience: updated });
    } catch (error) {
      alert(error.message);
    } finally {
      setAiLoadingIndex(null);
    }
  }}
  className={`text-sm px-3 py-1 rounded-lg text-white ${
    aiLoadingIndex === index
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {aiLoadingIndex === index ? "Improving..." : "✨ Improve with AI"}
</button>

                  )}
                </div>
              ))}

              <button
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
                className="bg-gray-100 border px-4 py-2 rounded-lg"
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
                    <h3 className="font-semibold mb-2">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="border px-3 py-1 \
rounded-full text-sm"
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
                    <h3 className="font-semibold mb-3">
                      Experience
                    </h3>
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
                        <p className="text-sm text-gray-700">
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
