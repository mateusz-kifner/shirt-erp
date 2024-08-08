import { lucia } from "./auth";
import type { IncomingMessage } from "http";

export const validateWSSession = async (req: IncomingMessage) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  return result;
};
