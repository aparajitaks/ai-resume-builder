import { useState } from "react";

const ResumeForm = () => {
  const [name, setName] = useState("");

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border px-3 py-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

export default ResumeForm;
