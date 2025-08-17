import { z, ZodError } from "zod";

import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
})

export type env = z.infer<typeof envSchema>;

let env: env;

try {
  env = envSchema.parse(process.env);
} catch (error: any) {
  if (error instanceof ZodError) {
    console.error("Environment variable validation failed:", error);
    process.exit(1);
  }
  throw error;
}

export default env;
