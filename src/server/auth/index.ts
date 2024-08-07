import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";

import { env } from "@/env";
import { db } from "@/server/db";
import { sendVerificationRequest } from "./email";
import { type UserRole, users } from "@/server/api/user/schema";
import { eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import type { Provider } from "next-auth/providers/index";
import type { IncomingMessage } from "http";
import type ws from "ws";
import { getSession } from "next-auth/react";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role?: UserRole;
  }
}

export const authDBAdapter = DrizzleAdapter(db);

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

const providers: Provider[] = [];

if (
  env.DISCORD_CLIENT_ID !== undefined &&
  env.DISCORD_CLIENT_SECRET !== undefined
) {
  providers.push(
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  );
}

if (
  env.EMAIL_SERVER_HOST !== undefined &&
  env.EMAIL_SERVER_PORT !== undefined &&
  env.EMAIL_SERVER_USER !== undefined &&
  env.EMAIL_SERVER_PASSWORD !== undefined &&
  env.EMAIL_FROM !== undefined
) {
  providers.push(
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number.parseInt(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      sendVerificationRequest,
      generateVerificationToken: env.NEXT_PUBLIC_DEMO
        ? () => {
            return "testuser";
          }
        : undefined,
      maxAge: env.NEXT_PUBLIC_DEMO ? 30 : 86400,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      const userData = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id));

      console.log(userData[0]);
      return (user as unknown as { role: UserRole }).role !== "normal";
    },

    session: async ({ session, user }) => {
      const userData = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, user.id));
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: userData[0]?.role,
        },
      };
    },
  },
  adapter: authDBAdapter as Adapter, // fix bug with drizzle adapter
  providers,
  theme: {
    colorScheme: "dark",
    brandColor: "#3355ff",
    buttonText: "#eee",
    logo: `${
      env.NEXTAUTH_URL.slice(-1) !== "/"
        ? `${env.NEXTAUTH_URL}/`
        : env.NEXTAUTH_URL
    }logo.png`,
  },
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
