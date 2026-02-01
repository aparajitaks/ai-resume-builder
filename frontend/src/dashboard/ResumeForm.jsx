import { useState } from "react";

export default function ResumeForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    summary: "",
    skills: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Create Resume</h2>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <textarea
        name="summary"
        placeholder="Professional Summary"
        onChange={handleChange}
      />

      <input
        name="skills"
        placeholder="Skills (comma separated)"
        onChange={handleChange}
      />

      <button>Save Resume</button>
    </div>
  );
}
