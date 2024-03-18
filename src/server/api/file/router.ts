import { createProcedureSearch } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";

import { files } from "@/server/api/file/schema";
import { type File, updateFileZodSchema } from "@/server/api/file/validator";
import { eq } from "drizzle-orm";
import { z } from "zod";
import fileService from "@/server/api/file/service";

const baseUrl = "/api/files/";

export const fileRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await fileService.getById(id)),

  getManyByIds: employeeProcedure
    .input(z.number().array())
    .query(async ({ input: ids }) => await fileService.getManyByIds(ids)),

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
