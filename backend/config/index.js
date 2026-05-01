import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  groqApiKey: process.env.GROQ_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};

export default config;
