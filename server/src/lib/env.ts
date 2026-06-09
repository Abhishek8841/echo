import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  TOKEN_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);