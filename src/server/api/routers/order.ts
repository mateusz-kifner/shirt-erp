import { orderSchema } from "@/schema/orderSchema";
import {
  createProcedureDeleteById,
  createProcedureGetAll,
  createProcedureSearch,
  createProcedureSearchWithPagination,
} from "@/server/api/procedures";
import { z } from "zod";

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
  emails: true,
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
        emails,
        ...simpleOrderData
      } = orderData;

      const createData: Prisma.OrderCreateInput = { ...simpleOrderData };

      if (files?.length && files.length > 0)
        createData.files = { connect: [...files] };

      // not working and not needed
      // if (emails?.length && emails.length > 0)
      //   createData.emails = { connect: [...emails] };

      if (products?.length && products.length > 0)
        createData.products = {
          connect: [...products.map((val) => ({ id: val.id }))],
        };

      if (spreadsheets?.length && spreadsheets.length > 0)
        createData.spreadsheets = { create: { ...spreadsheets } };

      if (designs?.length && designs.length > 0)
        createData.designs = { create: { ...designs } };

      if (client?.id) createData.client = { connect: { id: client.id } };

      createData.address = { create: address ?? {} };

      if (employees?.length && employees.length > 0)
        createData.employees = {
          connect: [...employees.map((val) => ({ id: val.id }))],
        };

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
        emails,
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

      if (emails && Array.isArray(emails))
        updateData.emails = { set: emails.map((val) => ({ id: val.id })) };

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
  archiveById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: orderId }) => {
      const orderData = await prisma.order.findUniqueOrThrow({
        where: { id: orderId },
        include: includeAll,
      });

      const {
        id,
        address,
        emails,
        files,
        employees,
        client,
        designs,
        products,
        spreadsheets,
        clientId,
        addressId,
        ...simpleOrderData
      } = orderData;

      const newOrderArchiveData: Prisma.OrderArchiveCreateInput = {
        ...simpleOrderData,
      };

      if (address?.id !== undefined)
        newOrderArchiveData.address = { connect: { id: address.id } };
      newOrderArchiveData.emails = {
        connect: emails.map((v) => ({ id: v.id })),
      };
      newOrderArchiveData.files = { connect: files.map((v) => ({ id: v.id })) };
      newOrderArchiveData.employees = {
        connect: employees.map((v) => ({ id: v.id })),
      };
      if (client?.id !== undefined)
        newOrderArchiveData.client = { connect: { id: client.id } };
      newOrderArchiveData.designs = {
        connect: designs.map((v) => ({ id: v.id })),
      };
      newOrderArchiveData.products = {
        connect: products.map((v) => ({ id: v.id })),
      };
      newOrderArchiveData.spreadsheets = {
        connect: spreadsheets.map((v) => ({ id: v.id })),
      };

      const orderArchiveData = await prisma.orderArchive.create({
        data: newOrderArchiveData,
      });
      if (orderArchiveData) {
        await prisma.order.delete({
          where: { id },
        });
      }
      return orderArchiveData;
    }),
});
