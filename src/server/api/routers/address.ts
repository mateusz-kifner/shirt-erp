import { addresses } from "@/db/schema/addresses";
import {
  insertAddressZodSchema,
  updateAddressZodSchema,
} from "@/schema/addressZodSchema";
import { createProcedureGetAll } from "@/server/api/procedures";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import addressService from "@/server/services/address";
import { z } from "zod";

export const addressRouter = createTRPCRouter({
  getAll: createProcedureGetAll(addresses),

  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await addressService.getById(id)),

  create: employeeProcedure
    .input(insertAddressZodSchema)
    .mutation(
      async ({ input: addressData }) =>
        await addressService.create(addressData),
    ),

  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => addressService.deleteById(id)),

  update: employeeProcedure
    .input(updateAddressZodSchema)
    .mutation(
      async ({ input: addressData }) =>
        await addressService.update(addressData),
    ),
});
