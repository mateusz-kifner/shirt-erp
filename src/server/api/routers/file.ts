import { createProcedureSearch } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";

import { files } from "@/db/schema/files";
import { type File, updateFileZodSchema } from "@/schema/fileZodSchema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import fileService from "@/server/services/file";

const baseUrl = "/api/files/";

export const fileRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await fileService.getById(id)),

  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => fileService.deleteById(id)),

  update: employeeProcedure
    .input(updateFileZodSchema)
    .mutation(async ({ input: fileData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await fileService.update({
        ...fileData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });
    }),

  search: createProcedureSearch(files),
});
