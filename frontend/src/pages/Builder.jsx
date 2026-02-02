import ResumeForm from "../dashboard/ResumeForm";
import ResumePreview from "../dashboard/ResumePreview";

const Builder = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResumeForm />
      <ResumePreview />
    </div>
  );
};

export default Builder;
