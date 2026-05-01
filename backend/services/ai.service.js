import Groq from "groq-sdk";
import AppError from "../utils/AppError.js";

// Helper to create Groq client AFTER env is loaded
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new AppError("GROQ_API_KEY is missing", 500);
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

// -------- Improve Experience --------
export const improveExperience = async ({ role, company, description }) => {
  if (!description) {
    throw new AppError("Description is required", 400);
  }

  const groq = getGroqClient();

  const prompt = `
You are a professional resume writer.

Rewrite the following work experience into 2–3 concise, ATS-optimized bullet points.
Use strong action verbs and a professional tone.

Role: ${role || "N/A"}
Company: ${company || "N/A"}
Description: ${description}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

// -------- Generate Summary --------
export const generateSummary = async ({
  fullName,
  title,
  skills,
  experience,
}) => {
  const groq = getGroqClient();

  const prompt = `
Write a short professional resume summary.

Name: ${fullName}
Title: ${title}
Skills: ${skills?.join(", ")}
Experience: ${experience?.map(e => e.role).join(", ")}

Keep it concise and ATS-friendly. Max 3-4 lines. No emojis. No first-person words.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

// -------- ATS Score --------
export const scoreATS = async ({ personal, experience, skills, education, summary }) => {
  const groq = getGroqClient();

  const prompt = `
You are an ATS (Applicant Tracking System) expert.

Analyze this resume and provide:
1. A score from 0 to 100
2. 3-5 specific, actionable feedback items

Resume Data:
- Name: ${personal?.fullName || "Not provided"}
- Title: ${personal?.title || "Not provided"}
- Summary: ${summary || "Not provided"}
- Skills: ${skills?.length ? skills.join(", ") : "None listed"}
- Experience: ${experience?.length ? experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join(" | ") : "None listed"}
- Education: ${education?.length ? education.map(e => `${e.degree} from ${e.school} (${e.year})`).join(" | ") : "None listed"}

RESPOND ONLY with valid JSON in this exact format (no markdown, no code fences):
{"score": <number>, "feedback": "<feedback string with items separated by newlines>"}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content);
    return {
      score: Math.min(100, Math.max(0, Number(parsed.score))),
      feedback: parsed.feedback,
    };
  } catch {
    throw new AppError("Failed to parse ATS score response", 500);
  }
};

// -------- Suggest Skills --------
export const suggestSkills = async ({ title, experience, currentSkills }) => {
  const groq = getGroqClient();

  const prompt = `
You are a career advisor and ATS expert.

Based on this professional profile, suggest 8-12 relevant skills that are NOT already listed.

Title: ${title || "Not provided"}
Current Skills: ${currentSkills?.length ? currentSkills.join(", ") : "None"}
Experience: ${experience?.length ? experience.map(e => e.role).join(", ") : "None"}

RESPOND ONLY with valid JSON in this exact format (no markdown, no code fences):
{"skills": ["skill1", "skill2", "skill3"]}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.skills || [];
  } catch {
    throw new AppError("Failed to parse skills suggestion response", 500);
  }
};

// -------- Tailor Resume to Job Description --------
export const tailorToJob = async ({ summary, experience, skills, jobDescription }) => {
  const groq = getGroqClient();

  const prompt = `
You are a professional resume writer and ATS optimization expert.

A user has an existing resume and wants to tailor it for a specific job. Rewrite:
1. The professional summary — make it highly relevant to the job
2. Each experience bullet point — emphasize skills/achievements that match the job
3. Suggest 3-5 additional skills from the job description that should be added

Current Summary: ${summary || "None"}
Current Experience: ${experience?.length ? experience.map(e => `Role: ${e.role}, Company: ${e.company}, Description: ${e.description}`).join(" || ") : "None"}
Current Skills: ${skills?.length ? skills.join(", ") : "None"}

Job Description:
${jobDescription}

RESPOND ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "summary": "<tailored summary>",
  "experience": [{"role": "<same role>", "company": "<same company>", "description": "<tailored description>"}],
  "suggestedSkills": ["skill1", "skill2"]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content);
    return {
      summary: parsed.summary || summary,
      experience: parsed.experience || experience,
      suggestedSkills: parsed.suggestedSkills || [],
    };
  } catch {
    throw new AppError("Failed to parse tailor response", 500);
  }
};
