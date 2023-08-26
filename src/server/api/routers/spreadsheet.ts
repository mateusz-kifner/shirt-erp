import { omit } from "lodash";

import Vector2Schema from "@/schema/Vector2Schema";
import { spreadsheetSchema } from "@/schema/spreadsheetSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { z } from "zod";

const spreadsheetSchemaWithoutId = spreadsheetSchema.omit({ id: true });
const partialSpreadsheetData = z.object({
  id: z.number(),
  partialData: z.array(
    z.object({ position: Vector2Schema, data: z.record(z.any()) }),
  ),
});

type typePartialSpreadsheetData = z.infer<typeof partialSpreadsheetData>;

export const spreadsheetRouter = createTRPCRouter({
  // getAll: createProcedureGetAll("spreadsheet"),

  // getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
  //   const data = await prisma.spreadsheet.findUnique({
  //     where: { id: input },
  //   });
  //   return data;
  // }),

  // create: authenticatedProcedure
  //   .input(
  //     spreadsheetSchemaWithoutId.merge(
  //       z.object({ orderId: z.number().optional() }),
  //     ),
  //   )
  //   .mutation(async ({ input }) => {
  //     const { orderId, data, ...spreadsheetData } = input;
  //     const newSpreadsheet = await prisma.spreadsheet.create({
  //       data: {
  //         ...spreadsheetData,
  //         data: data as Prisma.InputJsonValue,
  //         orders: { connect: { id: orderId } },
  //       },
  //     });
  //     return newSpreadsheet;
  //   }),

  // deleteById: createProcedureDeleteById("spreadsheet"),

  // update: authenticatedProcedure
  //   .input(spreadsheetSchema)
  //   .mutation(async ({ input: spreadsheetData }) => {
  //     const {
  //       id: spreadsheetId,
  //       data,
  //       ...simpleSpreadsheetData
  //     } = spreadsheetData;

  //     const updateData: Prisma.SpreadsheetUpdateInput = {
  //       ...simpleSpreadsheetData,
  //       data: data as Prisma.InputJsonValue,
  //     };

  //     const updatedSpreadsheet = await prisma.spreadsheet.update({
  //       where: { id: spreadsheetId },
  //       data: updateData,
  //     });
  //     return updatedSpreadsheet;
  //   }),

  // updatePartial: authenticatedProcedure
  //   .input(partialSpreadsheetData)
  //   .mutation(async ({ input: partialData }) => {
  //     const dataSpreadsheet = await prisma.spreadsheet.findUnique({
  //       where: { id: partialData.id },
  //     });
  //     if (!dataSpreadsheet?.data)
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "NOT_FOUND",
  //       });
  //     //  eslint-disable-next-line
  //     const dataDecoded = SuperJSON.parse(dataSpreadsheet.data.toString());
  //     console.log(dataDecoded);
  //     for (const cell of partialData.partialData) {
  //     }
  //     const updatedSpreadsheet = await prisma.spreadsheet.update({
  //       where: { id: partialData.id },
  //       data: omit({ ...partialData }, ["id"]),
  //     });
  //     return updatedSpreadsheet;
  //   }),

  // search: createProcedureSearch("spreadsheet"),

  // searchWithPagination: createProcedureSearchWithPagination("spreadsheet"),

});
