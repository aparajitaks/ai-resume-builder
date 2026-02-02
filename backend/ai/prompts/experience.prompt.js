const experiencePrompt = ({ role, rawPoints }) => `
You are an ATS resume expert.

Improve the following resume bullet points for the role: ${role}

Raw Points:
${rawPoints.map((p) => `- ${p}`).join("\n")}

Rules:
- Use action verbs
- Quantify impact where possible
- ATS-friendly keywords
- Keep bullet points concise
`;

export default experiencePrompt;
