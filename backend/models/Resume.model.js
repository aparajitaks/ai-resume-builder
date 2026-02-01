import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    personalInfo: Object,
    skills: [String],
    experience: [Object],
    education: [Object],
    generatedSummary: String
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
