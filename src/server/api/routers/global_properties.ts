import { z } from "zod";
import { createProcedureGetById } from "@/server/api/procedures";
import {
  employeeProcedure,
  createTRPCRouter,
  managerProcedure,
} from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { global_properties } from "@/db/schema/global_properties";
import {
  insertGlobalPropertiesZodSchema,
  updateGlobalPropertiesZodSchema,
} from "@/schema/globalPropertiesZodSchema";

export const globalPropertiesRouter = createTRPCRouter({
  getById: createProcedureGetById(global_properties),
  getAll: employeeProcedure.query(async ({ ctx }) => {
    const properties = await ctx.db.select().from(global_properties);
    return properties;
  }),
  create: managerProcedure
    .input(insertGlobalPropertiesZodSchema)
    .mutation(async ({ input: globalPropertiesData, ctx }) => {
      const newGlobalProperties = await ctx.db
        .insert(global_properties)
        .values(globalPropertiesData)
        .returning();
      if (newGlobalProperties[0] === undefined) {
        throw new Error("Could not create Global Properties");
      }
      return newGlobalProperties[0];
    }),
  deleteById: managerProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      const deletedGlobalProperties = await ctx.db
        .delete(global_properties)
        .where(eq(global_properties.id, id))
        .returning();
      return deletedGlobalProperties[0];
    }),
  update: employeeProcedure
    .input(updateGlobalPropertiesZodSchema)
    .mutation(async ({ input: globalPropertiesData, ctx }) => {
      const { id, ...dataToUpdate } = globalPropertiesData;
      const updatedGlobalProperties = await ctx.db
        .update(global_properties)
        .set(dataToUpdate)
        .where(eq(global_properties.id, id))
        .returning();
      if (updatedGlobalProperties[0] === undefined)
        throw new Error("Expense: Expense could not be updated");
      return updatedGlobalProperties[0];
    }),
});
