import OpenAI from "openai";

// Helper to create client AFTER env is loaded
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// -------- Improve Experience --------
export const improveExperience = async ({ role, company, description }) => {
  if (!description) {
    throw new Error("Description is required");
  }

  const openai = getOpenAIClient();

  const prompt = `
You are a professional resume writer.

Rewrite the following work experience into 2–3 concise, ATS-optimized bullet points.
Use strong action verbs and a professional tone.

Role: ${role || "N/A"}
Company: ${company || "N/A"}
Description: ${description}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
  const openai = getOpenAIClient();

  const prompt = `
Write a short professional resume summary.

Name: ${fullName}
Title: ${title}
Skills: ${skills?.join(", ")}
Experience: ${experience?.map(e => e.role).join(", ")}

Keep it concise and ATS-friendly.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
