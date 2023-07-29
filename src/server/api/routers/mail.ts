import { productSchema } from "@/schema/productSchema";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { fetchEmailById, fetchEmails, fetchFolders } from "@/server/mail";
import { ImapFlow } from "imapflow";
import { z } from "zod";

const productSchemaWithoutId = productSchema.omit({ id: true });

export const mailRouter = createTRPCRouter({
  getFolders: authenticatedProcedure
    // .input(
    //   z.object({
    //     sortColumn: z.string().default("id"),
    //     sort: z.enum(["desc", "asc"]).default("desc"),
    //   })
    // )
    .query(async ({ ctx, input }) => {
      const data = await prisma.user.findUnique({
        where: { id: ctx.session!.user!.id },
        include: { emailCredentials: true },
      });

      const folders = (data?.emailCredentials ?? [])
        .filter((auth) => auth.protocol === "imap")
        .map(async (auth) => {
          const client = new ImapFlow({
            host: auth.host ?? "",
            port: auth.port ?? 993,
            auth: {
              user: auth.user ?? "",
              pass: auth.password ?? "",
            },
            secure: auth.secure ?? true,
          });
          return await fetchFolders(client);
        });

      return await Promise.all(folders);
    }),
  getAll: authenticatedProcedure
    .input(
      z.object({
        take: z.number(),
        skip: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await prisma.user.findUnique({
        where: { id: ctx.session!.user!.id },
        include: { emailCredentials: true },
      });

      const mails = (data?.emailCredentials ?? [])
        .filter((auth) => auth.protocol === "imap")
        .map(async (auth) => {
          const client = new ImapFlow({
            host: auth.host ?? "",
            port: auth.port ?? 993,
            auth: {
              user: auth.user ?? "",
              pass: auth.password ?? "",
            },
            secure: auth.secure ?? true,
          });
          return await fetchEmails(client, input.take, input.skip);
        });
      return await Promise.all(mails);
    }),
  getById: authenticatedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      const data = await prisma.user.findUnique({
        where: { id: ctx.session!.user!.id },
        include: { emailCredentials: true },
      });

      const mails = (data?.emailCredentials ?? [])
        .filter((auth) => auth.protocol === "imap")
        .map(async (auth) => {
          const client = new ImapFlow({
            host: auth.host ?? "",
            port: auth.port ?? 993,
            auth: {
              user: auth.user ?? "",
              pass: auth.password ?? "",
            },
            secure: auth.secure ?? true,
          });
          return await fetchEmailById(client, input);
        });
      return await Promise.all(mails);
    }),
  create: authenticatedProcedure
    .input(productSchemaWithoutId)
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
