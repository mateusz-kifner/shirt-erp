import { addresses } from "@/db/schema/addresses";
import {
  insertAddressZodSchema,
  updateAddressZodSchema,
} from "@/schema/addressZodSchema";
import {
  createProcedureGetById,
  createProcedureDeleteById,
  createProcedureSearch,
} from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";

export const addressRouter = createTRPCRouter({
  getById: createProcedureGetById(addresses),
  create: employeeProcedure
    .input(insertAddressZodSchema)
    .mutation(async ({ input: addressData, ctx }) => {
      const newAddress = await ctx.db
        .insert(addresses)
        .values(addressData ?? {})
        .returning();
      if (newAddress[0] === undefined)
        throw new Error("Could not create address");
      return newAddress[0];
    }),
  deleteById: createProcedureDeleteById(addresses),
  update: employeeProcedure
    .input(updateAddressZodSchema)
    .mutation(async ({ input: addressData, ctx }) => {
      const updatedAddress = await ctx.db
        .update(addresses)
        .set(addressData)
        .where(eq(addresses.id, addressData.id))
        .returning();
      if (updatedAddress[0] === undefined) throw new Error("Could not update");
      return updatedAddress[0];
    }),

  search: createProcedureSearch(addresses),
});
