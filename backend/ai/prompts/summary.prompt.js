const summaryPrompt = ({ role, experience, skills }) => `
You are a professional resume writer.

Write a concise, ATS-optimized professional summary.

Role: ${role}
Experience: ${experience} years
Skills: ${skills.join(", ")}

Rules:
- Max 3–4 lines
- Professional tone
- No emojis
- No first-person words
`;

export default summaryPrompt;
