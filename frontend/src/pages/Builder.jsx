import { useState } from "react";

const Builder = () => {
  const [resume, setResume] = useState({
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: ""
    },
    skills: [],
    experience: [
      { role: "", company: "", description: "" }
    ],
    education: [
      { degree: "", institute: "", year: "" }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ================= FORM (LEFT) ================= */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Details</h2>

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
                    fullName: e.target.value
                  }
                })
              }
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

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
                    title: e.target.value
                  }
                })
              }
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ================= PREVIEW (RIGHT) ================= */}
          <div className="lg:col-span-3">
            <div className="sticky top-10 bg-white rounded-xl shadow p-10">
              <h2 className="text-xl font-semibold mb-6">Live Preview</h2>

              <div className="border rounded-lg p-8 min-h-[500px]">
                <h1 className="text-4xl font-bold">
                  {resume.personal.fullName || "Your Name"}
                </h1>

                <p className="text-lg text-gray-600 mt-2">
                  {resume.personal.title || "Software Engineer"}
                </p>

                <hr className="my-6" />

                <p className="text-sm text-gray-500">
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
