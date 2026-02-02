import OpenAI from "openai";

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export const generateSummary = async (data) => {
  const client = getClient();

  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: `Write resume summary: ${JSON.stringify(data)}` }
    ],
  });

  return res.choices[0].message.content;
};

export const improveExperience = async (data) => {
  const client = getClient();

  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: `Improve experience: ${JSON.stringify(data)}` }
    ],
  });

  return res.choices[0].message.content;
};
