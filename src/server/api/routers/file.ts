import { createProcedureSearch } from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

import { db } from "@/db/db";
import { files } from "@/db/schema/files";
import { File, updateFileZodSchema } from "@/schema/fileZodSchema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const baseUrl = "/api/files/";

export const fileRouter = createTRPCRouter({
  getById: authenticatedProcedure
    .input(z.number())
    .query(async ({ input: id }) => {
      const data = await db.query.files.findFirst({
        where: (schema, { eq }) => eq(schema.id, id),
      });
      if (!data) return null;
      return {
        ...data,
        url: `${baseUrl}${data?.filename}?token=${data?.token}`,
      } as File;
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const deletedClient = await db
        .delete(files)
        .where(eq(files.id, id))
        .returning();
      return deletedClient[0];
    }),
  update: authenticatedProcedure
    .input(updateFileZodSchema)
    .mutation(async ({ input: clientData, ctx }) => {
      const { id, ...dataToUpdate } = clientData;
      const updatedClient = await db
        .update(files)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(files.id, id))
        .returning();
      return updatedClient[0];
    }),

  search: createProcedureSearch(files, "files"),
});
