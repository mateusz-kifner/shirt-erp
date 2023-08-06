import { productSchema } from "@/schema/productSchema";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import {
  downloadEmailByUid,
  fetchEmails,
  fetchFolderTree,
  fetchFolders,
} from "@/server/email";
import { TRPCError } from "@trpc/server";
import { ImapFlow } from "imapflow";
import { omit } from "lodash";
import { z } from "zod";

const LOG_LEVEL: "DEBUG" | "WARN" | "INFO" | "ERROR" = "INFO";

const logDebug = (obj: any) => {
  //@ts-ignore
  if (LOG_LEVEL === "WARN" || LOG_LEVEL === "ERROR" || LOG_LEVEL === "INFO")
    return;
  console.log("Debug: ", JSON.stringify(obj, undefined, 2));
};

const logInfo = (obj: any) => {
  //@ts-ignore
  if (LOG_LEVEL === "WARN" || LOG_LEVEL === "ERROR") return;
  console.log("Info: ", JSON.stringify(obj, undefined, 2));
};

const logWarn = (obj: any) => {
  //@ts-ignore
  if (LOG_LEVEL === "ERROR") return;
  console.log("Warn: ", JSON.stringify(obj, undefined, 2));
};

const logError = (obj: any) => {
  console.log("Error: ", JSON.stringify(obj, undefined, 2));
};

export const emailRouter = createTRPCRouter({
  getAllConfigs: authenticatedProcedure.query(async ({ ctx }) => {
    const data = await prisma.user.findUnique({
      where: { id: ctx.session!.user!.id },
      include: { emailCredentials: true },
    });
    return data?.emailCredentials.map((val) => omit(val, ["password"]));
  }),

  getFolders: authenticatedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const data = await prisma.user.findUnique({
        where: { id: ctx.session!.user!.id },
        include: { emailCredentials: true },
      });

      const auth = data?.emailCredentials
        .filter((val) => val.id === input)
        .filter((auth) => auth.protocol === "imap")[0];

      if (auth === undefined)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "emailCredentials not found",
        });

      const client = new ImapFlow({
        host: auth.host ?? "",
        port: auth.port ?? 993,
        auth: {
          user: auth.user ?? "",
          pass: auth.password ?? "",
        },
        secure: auth.secure ?? true,
        logger: {
          debug: logDebug,
          info: logInfo,
          warn: logWarn,
          error: logError,
        },
      });
      return await fetchFolders(client);
    }),

  getFolderTree: authenticatedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const data = await prisma.user.findUnique({
        where: { id: ctx.session!.user!.id },
        include: { emailCredentials: true },
      });

      const auth = data?.emailCredentials
        .filter((val) => val.id === input)
        .filter((auth) => auth.protocol === "imap")[0];

      if (auth === undefined)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "emailCredentials not found",
        });

      const client = new ImapFlow({
        host: auth.host ?? "",
        port: auth.port ?? 993,
        auth: {
          user: auth.user ?? "",
          pass: auth.password ?? "",
        },
        secure: auth.secure ?? true,
        logger: {
          debug: logDebug,
          info: logInfo,
          warn: logWarn,
          error: logError,
        },
      });
      return await fetchFolderTree(client);
    }),

  getAll: authenticatedProcedure
    .input(
      z.object({
        mailbox: z.string().default("INBOX"),
        emailClientId: z.number(),
        take: z.number(),
        skip: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { mailbox, emailClientId, take, skip } = input;
      const data = await prisma.user.findUnique({
        where: { id: ctx.session!.user!.id },
        include: { emailCredentials: true },
      });

      const auth = data?.emailCredentials
        .filter((val) => val.id === emailClientId)
        .filter((auth) => auth.protocol === "imap")[0];

      if (auth === undefined)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "emailCredentials not found",
        });

      const client = new ImapFlow({
        host: auth.host ?? "",
        port: auth.port ?? 993,
        auth: {
          user: auth.user ?? "",
          pass: auth.password ?? "",
        },
        secure: auth.secure ?? true,
        logger: {
          debug: logDebug,
          info: logInfo,
          warn: logWarn,
          error: logError,
        },
      });
      return await fetchEmails(client, mailbox, take, skip);
    }),

  getByUid: authenticatedProcedure
    .input(
      z.object({
        mailbox: z.string().default("INBOX"),
        emailClientId: z.number(),
        emailId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { mailbox, emailClientId, emailId } = input;
      const data = await prisma.user.findUnique({
        where: { id: ctx.session!.user!.id },
        include: { emailCredentials: true },
      });

      const auth = data?.emailCredentials
        .filter((val) => val.id === emailClientId)
        .filter((auth) => auth.protocol === "imap")[0];

      if (auth === undefined)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "emailCredentials not found",
        });

      const client = new ImapFlow({
        host: auth.host ?? "",
        port: auth.port ?? 993,
        auth: {
          user: auth.user ?? "",
          pass: auth.password ?? "",
        },
        secure: auth.secure ?? true,
        logger: {
          debug: logDebug,
          info: logInfo,
          warn: logWarn,
          error: logError,
        },
      });
      // const mail = await fetchEmailByUid(client, emailId.toString(), mailbox);
      const meta = await downloadEmailByUid(
        client,
        emailId.toString(),
        mailbox,
      );
      return meta;
    }),

  create: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: productData }) => {
      return {};
    }),
  deleteById: authenticatedProcedure

    .input(z.number())
    .mutation(async ({ input: id }) => {
      return {};
    }),
  update: authenticatedProcedure
    .input(productSchema)
    .mutation(async ({ input: productData }) => {
      return {};
    }),
  search: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    return {};
  }),
});
