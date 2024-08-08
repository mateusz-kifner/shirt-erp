import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    SECRET_COOKIE_PASSWORD: z.string().min(32),
    ENABLE_CLAMAV: z.preprocess(
      (v) => v === "true" || v === "1",
      z.boolean().default(false),
    ),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string().optional(),
    DISCORD_CLIENT_SECRET: z.string().optional(),
    EMAIL_SERVER_USER: z.string().optional(),
    EMAIL_SERVER_PASSWORD: z.string().optional(),
    EMAIL_SERVER_HOST: z.string().optional(),
    EMAIL_SERVER_PORT: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    REGISTER_CODE: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_START_MESSAGE: z.string().optional(),
    NEXT_PUBLIC_DEMO: z.preprocess(
      (v) => v === "true" || v === "1",
      z.boolean().default(false),
    ),
    NEXT_PUBLIC_ORGANIZATION_NAME: z.string().default("ShirtERP"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_START_MESSAGE: process.env.NEXT_PUBLIC_START_MESSAGE,
    NEXT_PUBLIC_DEMO: process.env.NEXT_PUBLIC_DEMO,
    ENABLE_CLAMAV: process.env.ENABLE_CLAMAV,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
    REGISTER_CODE: process.env.REGISTER_CODE,
    NEXT_PUBLIC_ORGANIZATION_NAME: process.env.NEXT_PUBLIC_ORGANIZATION_NAME,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
