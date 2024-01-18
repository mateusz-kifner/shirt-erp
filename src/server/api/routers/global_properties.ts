import { z } from "zod";
import { createProcedureSearch } from "@/server/api/procedures";
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
import globalPropertyService from "@/server/services/global_properties";
import { db } from "@/db";

export const globalPropertiesRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await globalPropertyService.getById(id)),

  getAll: employeeProcedure.query(
    async () => await db.select().from(global_properties),
  ),

  getByCategory: employeeProcedure
    .input(z.string())
    .query(async ({ input: category, ctx }) => {
      const properties = await db
        .select()
        .from(global_properties)
        .where(eq(global_properties.category, category));
      return properties;
    }),

  create: managerProcedure
    .input(insertGlobalPropertiesZodSchema)
    .mutation(
      async ({ input: globalPropertiesData }) =>
        await globalPropertyService.create(globalPropertiesData),
    ),

  deleteById: managerProcedure
    .input(z.number())
    .mutation(
      async ({ input: id }) => await globalPropertyService.deleteById(id),
    ),

  update: employeeProcedure
    .input(updateGlobalPropertiesZodSchema)
    .mutation(
      async ({ input: globalPropertiesData }) =>
        await globalPropertyService.update(globalPropertiesData),
    ),

  search: createProcedureSearch(global_properties),
});
