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

export const orderArchiveRouter = createTRPCRouter({
  // getAll: createProcedureGetAll("orderArchive"),
  // getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
  //   const data = await prisma.orderArchive.findUnique({
  //     where: { id: input },
  //     include: includeAll,
  //   });
  //   return data;
  // }),
  // create: authenticatedProcedure
  //   .input(orderSchemaWithoutId)
  //   .mutation(async ({ input: orderData }) => {
  //     const {
  //       spreadsheets,
  //       designs,
  //       files,
  //       client,
  //       address,
  //       products,
  //       employees,
  //       emails,
  //       ...simpleOrderData
  //     } = orderData;

  //     const createData: Prisma.OrderArchiveCreateInput = { ...simpleOrderData };

  //     if (files?.length && files.length > 0)
  //       createData.files = { connect: [...files] };

  //     // not working and not needed
  //     // if (emails?.length && emails.length > 0)
  //     //   createData.emails = { connect: [...emails] };

  //     if (products?.length && products.length > 0)
  //       createData.products = {
  //         connect: [...products.map((val) => ({ id: val.id }))],
  //       };

  //     if (spreadsheets?.length && spreadsheets.length > 0)
  //       createData.spreadsheets = { create: { ...spreadsheets } };

  //     if (designs?.length && designs.length > 0)
  //       createData.designs = { create: { ...designs } };

  //     if (client?.id) createData.client = { connect: { id: client.id } };

  //     createData.address = { create: address ?? {} };

  //     if (employees?.length && employees.length > 0)
  //       createData.employees = {
  //         connect: [...employees.map((val) => ({ id: val.id }))],
  //       };

  //     const newOrder = await prisma.orderArchive.create({
  //       data: createData,
  //     });
  //     return newOrder;
  //   }),
  // deleteById: createProcedureDeleteById("orderArchive"),
  // update: authenticatedProcedure
  //   .input(orderSchema.partial())
  //   .mutation(async ({ input: orderData }) => {
  //     const {
  //       id: orderId,
  //       spreadsheets,
  //       designs,
  //       files,
  //       client,
  //       address,
  //       products,
  //       employees,
  //       emails,
  //       ...simpleOrderData
  //     } = orderData;

  //     const updateData: Prisma.OrderArchiveUpdateInput = { ...simpleOrderData };

  //     if (client?.id) updateData.client = { connect: { id: client?.id } };

  //     if (products && Array.isArray(products))
  //       updateData.products = { set: products.map((val) => ({ id: val.id })) };

  //     if (employees && Array.isArray(employees)) {
  //       updateData.employees = {
  //         set: employees.map((val) => ({ id: val.id })),
  //       };
  //     }

  //     if (files && Array.isArray(files))
  //       updateData.files = { set: files.map((val) => ({ id: val.id })) };

  //     if (emails && Array.isArray(emails))
  //       updateData.emails = { set: emails.map((val) => ({ id: val.id })) };

  //     if (address) updateData.address = { update: address };

  //     const updatedOrder = await prisma.orderArchive.update({
  //       where: { id: orderId },
  //       data: updateData,
  //       include: includeAll,
  //     });

  //     return updatedOrder;
  //   }),
  // search: createProcedureSearch("orderArchive"),
  // searchWithPagination: createProcedureSearchWithPagination("orderArchive"),
  // unarchiveById: authenticatedProcedure
  //   .input(z.number())
  //   .mutation(async ({ input: orderId }) => {
  //     const orderArchiveData = await prisma.orderArchive.findUniqueOrThrow({
  //       where: { id: orderId },
  //       include: includeAll,
  //     });

  //     const {
  //       id,
  //       address,
  //       emails,
  //       files,
  //       employees,
  //       client,
  //       designs,
  //       products,
  //       spreadsheets,
  //       clientId,
  //       addressId,
  //       ...simpleOrderArchiveData
  //     } = orderArchiveData;

  //     const newOrderData: Prisma.OrderCreateInput = {
  //       ...simpleOrderArchiveData,
  //     };

  //     if (address?.id !== undefined)
  //       newOrderData.address = { connect: { id: address.id } };
  //     newOrderData.emails = {
  //       connect: emails.map((v) => ({ id: v.id })),
  //     };
  //     newOrderData.files = { connect: files.map((v) => ({ id: v.id })) };
  //     newOrderData.employees = {
  //       connect: employees.map((v) => ({ id: v.id })),
  //     };
  //     if (client?.id !== undefined)
  //       newOrderData.client = { connect: { id: client.id } };
  //     newOrderData.designs = {
  //       connect: designs.map((v) => ({ id: v.id })),
  //     };
  //     newOrderData.products = {
  //       connect: products.map((v) => ({ id: v.id })),
  //     };
  //     newOrderData.spreadsheets = {
  //       connect: spreadsheets.map((v) => ({ id: v.id })),
  //     };

  //     const orderData = await prisma.order.create({
  //       data: newOrderData,
  //     });
  //     if (orderData) {
  //       await prisma.orderArchive.delete({
  //         where: { id },
  //       });
  //     }
  //     return orderData;
  //   }),
});
