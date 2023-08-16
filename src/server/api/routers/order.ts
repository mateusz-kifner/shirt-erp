import { orderSchema } from "@/schema/orderSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { z } from "zod";

import { prisma } from "@/server/db";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";

const orderSchemaWithoutId = orderSchema
  .omit({ id: true, address: true })
  .merge(
    z.object({
      address: z
        .object({
          streetName: z.string().max(255).nullable().optional(),
          streetNumber: z.string().max(255).nullable().optional(),
          apartmentNumber: z.string().max(255).nullable().optional(),
          secondLine: z.string().max(255).nullable().optional(),
          postCode: z.string().max(255).nullable().optional(),
          city: z.string().max(255).nullable().optional(),
          province: z.string().max(255).nullable().optional(),
        })
        .optional()
        .nullable(),
    }),
  );

export type OrderTypeWithoutId = z.infer<typeof orderSchemaWithoutId>;

const includeAll = {
  files: true,
  client: { include: { address: true } },
  address: true,
  spreadsheets: true,
  designs: true,
  products: true,
  employees: true,
};

export const orderRouter = createTRPCRouter({
  getAll: createProcedureGetAll("order"),
  getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    const data = await prisma.order.findUnique({
      where: { id: input },
      include: includeAll,
    });
    return data;
  }),
  create: authenticatedProcedure
    .input(orderSchemaWithoutId)
    .mutation(async ({ input: orderData }) => {
      const {
        spreadsheets,
        designs,
        files,
        client,
        address,
        products,
        employees,
        ...simpleOrderData
      } = orderData;

      const createData: Prisma.OrderCreateInput = { ...simpleOrderData };

      if (orderData.files?.length && orderData.files.length > 0)
        createData.files = { connect: [...orderData.files] };

      if (orderData.products?.length && orderData.products.length > 0)
        createData.products = {
          connect: [...orderData.products.map((val) => ({ id: val.id }))],
        };

      if (orderData.spreadsheets?.length && orderData.spreadsheets.length > 0)
        createData.spreadsheets = { create: { ...orderData.spreadsheets } };

      if (orderData.designs?.length && orderData.designs.length > 0)
        createData.designs = { create: { ...orderData.designs } };

      if (orderData?.client?.id)
        createData.client = { connect: { id: orderData.client.id } };

      createData.address = { create: orderData.address ?? {} };

      const newOrder = await prisma.order.create({
        data: createData,
      });
      return newOrder;
    }),
  deleteById: createProcedureDeleteById("order"),
  update: authenticatedProcedure
    .input(orderSchema.partial())
    .mutation(async ({ input: orderData }) => {
      const {
        id: orderId,
        spreadsheets,
        designs,
        files,
        client,
        address,
        products,
        employees,
        ...simpleOrderData
      } = orderData;

      const updateData: Prisma.OrderUpdateInput = { ...simpleOrderData };

      if (client?.id) updateData.client = { connect: { id: client?.id } };

      if (products && Array.isArray(products))
        updateData.products = { set: products.map((val) => ({ id: val.id })) };

      if (employees && Array.isArray(employees)) {
        updateData.employees = {
          set: employees.map((val) => ({ id: val.id })),
        };
      }

      if (files && Array.isArray(files))
        updateData.files = { set: files.map((val) => ({ id: val.id })) };

      if (address) updateData.address = { update: address };

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: includeAll,
      });

      return updatedOrder;
    }),
  search: createProcedureSearch("order"),
  searchWithPagination: createProcedureSearchWithPagination("order"),
});
