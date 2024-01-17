import { db } from "@/db";
import { email_credentials } from "@/db/schema/email_credentials";
import { email_credentials_to_users } from "@/db/schema/email_credentials_to_users";
import { insertEmailCredentialZodSchema } from "@/schema/emailCredentialZodSchema";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  getAllMailCredentials: employeeProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, currentUserId),
      with: { emailCredentials: { with: { emailCredentials: true } } },
    });
    return result?.emailCredentials.map((v) => v.emailCredentials);
  }),

  createMailCredential: employeeProcedure
    .input(insertEmailCredentialZodSchema)
    .mutation(async ({ ctx, input: emailCredentialData }) => {
      const currentUserId = ctx.session.user.id;
      const EmailCredential = await db
        .insert(email_credentials)
        .values({
          ...emailCredentialData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      if (EmailCredential[0] === undefined)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR: could not create email credential",
        });
      await db.insert(email_credentials_to_users).values({
        userId: currentUserId,
        emailCredentialsId: EmailCredential[0].id,
      });
      return EmailCredential[0];
    }),
  // updateMailCredential: employeeProcedure
  //   .input(emailCredentialSchema)
  //   .mutation(async ({ input: mailCredential }) => {
  //     const updatedProduct = await prisma.product.update({
  //       where: { id: mailCredential.id },
  //       data: { ...mailCredential },
  //     });
  //     return updatedProduct;
  //   }),
  deleteMailCredential: employeeProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      const currentUserId = ctx.session.user.id;
      const result = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, currentUserId),
        with: { emailCredentials: true },
      });

      const found = result?.emailCredentials.findIndex(
        (credential) => credential.emailCredentialsId === id,
      );
      if (found === undefined) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permissions to delete this credential",
        });
      }
      await db
        .delete(email_credentials_to_users)
        .where(eq(email_credentials_to_users.emailCredentialsId, id));

      const deletedEmailCredential = await db
        .delete(email_credentials)
        .where(eq(email_credentials.id, id))
        .returning();
      return deletedEmailCredential[0];
    }),
});
