import OpenAI from "openai";
import AppError from "../utils/AppError.js";

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new AppError("OPENAI_API_KEY is missing", 500);
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

export const generateCoverLetter = async ({
  resumeSummary,
  resumeExperience,
  resumeSkills,
  jobTitle,
  company,
  jobDescription,
}) => {
  const openai = getOpenAIClient();

  const prompt = `
You are a professional cover letter writer.

Write a compelling, tailored cover letter for the following job application.

Candidate Profile:
- Summary: ${resumeSummary || "Not provided"}
- Key Skills: ${resumeSkills?.length ? resumeSkills.join(", ") : "Not provided"}
- Experience: ${resumeExperience?.length ? resumeExperience.map(e => `${e.role} at ${e.company}`).join(", ") : "Not provided"}

Job Details:
- Title: ${jobTitle}
- Company: ${company}
- Description: ${jobDescription}

Rules:
- Professional tone, 3-4 paragraphs
- Reference specific skills and experience that match the job
- Show enthusiasm for the company
- No placeholders like [Your Name] — write it as-is
- Do NOT include date, address headers, or signature block
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
