import Vector2Schema from "@/schema/Vector2Schema";
import {
  createProcedureGetById,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

import { z } from "zod";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import {
  insertSpreadsheetSchema,
  spreadsheets,
} from "@/db/schema/spreadsheets";

const partialSpreadsheetData = z.object({
  id: z.number(),
  partialData: z.array(
    z.object({ position: Vector2Schema, data: z.record(z.any()) }),
  ),
});

type typePartialSpreadsheetData = z.infer<typeof partialSpreadsheetData>;

export const spreadsheetRouter = createTRPCRouter({
  getById: createProcedureGetById("spreadsheet"),
  create: authenticatedProcedure
    .input(insertSpreadsheetSchema)
    .mutation(async ({ input: userData, ctx }) => {
      const currentUserId = ctx.session!.user!.id;
      const newUser = await db
        .insert(spreadsheets)
        .values({
          ...userData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      return newUser[0];
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const deletedSpreadsheet = await db
        .delete(spreadsheets)
        .where(eq(spreadsheets.id, id))
        .returning();
      return deletedSpreadsheet[0];
    }),
  update: authenticatedProcedure
    .input(insertSpreadsheetSchema.merge(z.object({ id: z.number() })))
    .mutation(async ({ input: userData, ctx }) => {
      const { id, ...dataToUpdate } = userData;
      const updatedUser = await db
        .update(spreadsheets)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(spreadsheets.id, id))
        .returning();
      return updatedUser[0];
    }),
  search: createProcedureSearchWithPagination(spreadsheets),

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
});
