import { omit } from "lodash";

import { fileSchema } from "@/schema/fileSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureGetById,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";

// const clientSchemaWithoutId = clientSchema.omit({ id: true });

export const fileRouter = createTRPCRouter({
  getAll: createProcedureGetAll("file"),
  getById: createProcedureGetById("file"),
  deleteById: createProcedureDeleteById("file"),
  update: authenticatedProcedure
    .input(fileSchema)
    .mutation(async ({ input: fileData }) => {
      const updatedFile = await prisma.file.update({
        where: { id: fileData.id },
        data: omit({ ...fileData }, ["id"]),
      });
      return updatedFile;
    }),
  search: createProcedureSearch("file"),
  searchWithPagination: createProcedureSearchWithPagination("file"),
});
