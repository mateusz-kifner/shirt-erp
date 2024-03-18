import { z } from "zod";
import { createProcedureSearch } from "@/server/api/procedures";
import {
  employeeProcedure,
  createTRPCRouter,
  managerProcedure,
} from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { global_properties } from "./schema";
import {
  insertGlobalPropertiesZodSchema,
  updateGlobalPropertiesZodSchema,
} from "./validator";
import globalPropertyService from "./service";
import { db } from "@/server/db";

export const globalPropertyRouter = createTRPCRouter({
  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await globalPropertyService.getById(id)),

  getAll: employeeProcedure.query(
    async () => await db.select().from(global_properties),
  ),

  getByCategory: employeeProcedure
    .input(z.string())
    .query(async ({ input: category, ctx }) => {
      const propertiesArray = await db
        .select()
        .from(global_properties)
        .where(eq(global_properties.category, category));
      return propertiesArray;
    }),

  create: managerProcedure
    .input(insertGlobalPropertiesZodSchema)
    .mutation(
      async ({ input: globalPropertyData }) =>
        await globalPropertyService.create(globalPropertyData),
    ),

  deleteById: managerProcedure
    .input(z.number())
    .mutation(
      async ({ input: id }) => await globalPropertyService.deleteById(id),
    ),

  update: employeeProcedure
    .input(updateGlobalPropertiesZodSchema)
    .mutation(
      async ({ input: globalPropertyData }) =>
        await globalPropertyService.update(globalPropertyData),
    ),

  search: createProcedureSearch(global_properties),
});
