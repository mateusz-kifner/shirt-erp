import { omit } from "lodash";

import { fileSchema } from "@/schema/fileSchema";
import {
  createProcedureDeleteById
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

// const clientSchemaWithoutId = clientSchema.omit({ id: true });

const baseUrl = "/api/files/"

export const fileRouter = createTRPCRouter({
  getAll: authenticatedProcedure
  .input(
    z.object({
      sort: z.enum(["desc", "asc"]).default("desc"),
    })
  )
  .query(async ({ input }) => {
    const sortParam = { orderBy: { originalFilename: input.sort } };
    const data = await 
      prisma.file.findMany({
      ...sortParam,
    });
    return data.map((file)=>({...omit(file,["filepath"]),url:`${baseUrl}${file.filename}?token=${file.token}`}));
  }),
  getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    const data = await prisma.file.findUnique({
      where: { id: input },
    });
    if (!data) return null
    return {...data,url:`${baseUrl}${data?.filename}?token=${data?.token}`};
  }),
  deleteById: createProcedureDeleteById("file"),
  update: authenticatedProcedure
    .input(fileSchema)
    .mutation(async ({ input: fileData }) => {
      const updatedFile = await prisma.file.update({
        where: { id: fileData.id },
        data: omit({ ...fileData }, ["id","filepath"]),
      });
      return updatedFile;
    }),
  // search: createProcedureSearch("file"),
  // searchWithPagination: createProcedureSearchWithPagination("file"),
});
