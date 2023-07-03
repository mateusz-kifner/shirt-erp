import { omit } from "lodash";

import { spreadsheetSchema } from "@/schema/spreadsheetSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureGetById,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { prisma } from "@/server/db";

const spreadsheetSchemaWithoutId = spreadsheetSchema.omit({ id: true });

export const spreadsheetRouter = createTRPCRouter({
  getAll: createProcedureGetAll("spreadsheet"),
  getById: createProcedureGetById("spreadsheet"),
  create: authenticatedProcedure
    .input(spreadsheetSchemaWithoutId)
    .mutation(async ({ input: spreadsheetData }) => {
      const newSpreadsheet = await prisma.spreadsheet.create({
        data: { ...spreadsheetData },
      });
      return newSpreadsheet;
    }),
  deleteById: createProcedureDeleteById("spreadsheet"),
  update: authenticatedProcedure
    .input(spreadsheetSchema)
    .mutation(async ({ input: spreadsheetData }) => {
      const updatedSpreadsheet = await prisma.spreadsheet.update({
        where: { id: spreadsheetData.id },
        data: omit({ ...spreadsheetData }, ["id"]),
      });
      return updatedSpreadsheet;
    }),
  search: createProcedureSearch("spreadsheet"),
  searchWithPagination: createProcedureSearchWithPagination("spreadsheet"),
});
