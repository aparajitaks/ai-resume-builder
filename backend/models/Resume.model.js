import mongoose from "mongoose";

// ── Sub-schemas ──
const personalSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    title: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: "" },
    school: { type: String, default: "" },
    year: { type: String, default: "" },
  },
  { _id: false }
);

// ── Main Resume Schema ──
const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    personal: { type: personalSchema, default: () => ({}) },
    summary: { type: String, default: "" },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    skills: { type: [String], default: [] },
    atsScore: {
      score: { type: Number, default: null },
      feedback: { type: String, default: "" },
      checkedAt: { type: Date, default: null },
    },
    // ── Sharing ──
    shareId: { type: String, default: null, unique: true, sparse: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
