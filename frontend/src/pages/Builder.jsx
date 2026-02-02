import ResumeForm from "../dashboard/ResumeForm";
import ResumePreview from "../dashboard/ResumePreview";

const Builder = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Resume Details</h2>
        <ResumeForm />
      </div>

      {/* Right: Preview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <ResumePreview />
      </div>
    </div>
  );
};

export default Builder;
