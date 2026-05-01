import { getGroqResponse } from "./ai.service.js";

export const roastResume = async (resumeData) => {
  const prompt = `
    You are a brutal, sarcastic, but highly intelligent resume critic.
    Roast the following resume data. Be funny, mean, and extremely honest, but keep it constructive in a hidden way.
    Highlight ridiculous bullet points, generic summaries, and overused buzzwords.
    Format your response in a fun, shareable way with a final "Roast Score" out of 100.
    
    RESUME DATA:
    ${JSON.stringify(resumeData)}
  `;

  return getGroqResponse(prompt);
};
