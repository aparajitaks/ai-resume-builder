import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("5001"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

/**
 * Validates all required environment variables at startup.
 * Crashes the app early with a clear message if any are missing.
 */
export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(`\n❌ Environment validation failed:\n${errors}\n`);
    process.exit(1);
  }

  return result.data;
};
