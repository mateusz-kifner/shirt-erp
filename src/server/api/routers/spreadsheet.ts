// import Vector2Schema from "@/schema/Vector2Schema";
import { createProcedureSearch } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";

import { db } from "@/db";
import { spreadsheets } from "@/db/schema/spreadsheets";
import {
  insertSpreadsheetZodSchema,
  updateSpreadsheetZodSchema,
} from "@/schema/spreadsheetZodSchema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// const partialSpreadsheetData = z.object({
//   id: z.number(),
//   partialData: z.array(
//     z.object({ position: Vector2Schema, data: z.record(z.any()) }),
//   ),
// });

// type typePartialSpreadsheetData = z.infer<typeof partialSpreadsheetData>;

export const spreadsheetRouter = createTRPCRouter({
  getById: employeeProcedure.input(z.number()).query(async ({ input: id }) => {
    const data = await db.query.spreadsheets.findFirst({
      where: (schema, { eq }) => eq(schema.id, id),
    });
    return data;
  }),
  create: employeeProcedure
    .input(insertSpreadsheetZodSchema)
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
  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const deletedSpreadsheet = await db
        .delete(spreadsheets)
        .where(eq(spreadsheets.id, id))
        .returning();
      return deletedSpreadsheet[0];
    }),
  update: employeeProcedure
    .input(updateSpreadsheetZodSchema)
    .mutation(async ({ input: userData, ctx }) => {
      const { id, ...dataToUpdate } = userData;
      const currentUserId = ctx.session!.user!.id;
      const updatedUser = await db
        .update(spreadsheets)
        .set({
          ...dataToUpdate,
          updatedById: currentUserId,
          updatedAt: new Date(),
        })
        .where(eq(spreadsheets.id, id))
        .returning();
      return updatedUser[0];
    }),
  search: createProcedureSearch(spreadsheets),

  // updatePartial: employeeProcedure
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
