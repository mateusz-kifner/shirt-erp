import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    EMAIL_FROM: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
