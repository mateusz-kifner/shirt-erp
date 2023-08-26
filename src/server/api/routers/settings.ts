import { emailCredentialSchema } from "@/schema/emailCredential";
import {
  authenticatedProcedure,
  createTRPCRouter,
  privilegedProcedure,
} from "@/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { omit } from "lodash";
import { z } from "zod";

const emailCredentialSchemaWithoutId = emailCredentialSchema.omit({ id: true });

export const settingsRouter = createTRPCRouter({
  // getAll: privilegedProcedure.query(({ ctx }) => {
  //   return { message: "privilegedProcedure" };
  // }),

  // getAllMailCredentials: authenticatedProcedure.query(async ({ ctx }) => {
  //   const data = await prisma.user.findUnique({
  //     where: { id: ctx.session!.user!.id },
  //     include: { emailCredentials: true },
  //   });
  //   return data?.emailCredentials.map((val) => omit(val, ["password"]));
  // }),

  // createMailCredential: authenticatedProcedure
  //   .input(
  //     emailCredentialSchemaWithoutId.merge(
  //       z.object({ password: z.string().max(255) }),
  //     ),
  //   )
  //   .mutation(async ({ ctx, input: mailCredential }) => {
  //     const newMailCredential = await prisma.emailCredential.create({
  //       data: {
  //         ...mailCredential,
  //         secure: mailCredential.secure ?? false,
  //         users: { connect: [{ id: ctx.session!.user!.id }] },
  //       },
  //     });
  //     return newMailCredential;
  //   }),
  // updateMailCredential: authenticatedProcedure
  //   .input(emailCredentialSchema)
  //   .mutation(async ({ input: mailCredential }) => {
  //     const updatedProduct = await prisma.product.update({
  //       where: { id: mailCredential.id },
  //       data: { ...mailCredential },
  //     });
  //     return updatedProduct;
  //   }),
  // deleteMailCredential: authenticatedProcedure
  //   .input(z.number())
  //   .mutation(async ({ ctx, input: id }) => {
  //     const data = await prisma.user.findUnique({
  //       where: { id: ctx.session!.user!.id },
  //       include: { emailCredentials: true },
  //     });

  //     const found = data?.emailCredentials.findIndex(
  //       (credential) => credential.id === id,
  //     );
  //     if (found === undefined) {
  //       throw new TRPCError({
  //         code: "FORBIDDEN",
  //         message: "You don't have permissions to delete this credential",
  //       });
  //     }
  //     const deleted = await prisma.emailCredential.delete({ where: { id } });
  //     return deleted;
  //   }),
});
