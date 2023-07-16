import { omit } from "lodash";

import Vector2Schema from "@/schema/Vector2Schema";
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
import { TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { z } from "zod";

const spreadsheetSchemaWithoutId = spreadsheetSchema.omit({ id: true });
const partialSpreadsheetData = z.object({
  id: z.number(),
  partialData: z.array(
    z.object({ position: Vector2Schema, data: z.record(z.any()) })
  ),
});

type typepartialSpreadsheetData = z.infer<typeof partialSpreadsheetData>;

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

  updatePartial: authenticatedProcedure
    .input(partialSpreadsheetData)
    .mutation(async ({ input: partialData }) => {
      const dataSpreadsheet = await prisma.spreadsheet.findUnique({
        where: { id: partialData.id },
      });
      if (!dataSpreadsheet?.data)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "NOT_FOUND",
        });
      const dataDecoded = SuperJSON.parse(dataSpreadsheet.data.toString());
      console.log(dataDecoded);
      for (const cell of partialData.partialData) {
      }
      const updatedSpreadsheet = await prisma.spreadsheet.update({
        where: { id: partialData.id },
        data: omit({ ...partialData }, ["id"]),
      });
      return updatedSpreadsheet;
    }),

  search: createProcedureSearch("spreadsheet"),

  searchWithPagination: createProcedureSearchWithPagination("spreadsheet"),
});
