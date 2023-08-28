import { z } from "zod";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";

export const orderArchiveRouter = createTRPCRouter({
  // getById: createProcedureGetById("order_archives")
  getById: authenticatedProcedure.input(z.number()).query(async ({ input }) => {
    return {} as any;
  }),
  create: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: orderData }) => {
      return {} as any;
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: orderData }) => {
      return {} as any;
    }),
  update: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: orderData }) => {
      return {} as any;
    }),
  search: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: orderData }) => {
      return {} as any;
    }),
  unarchiveById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: orderData }) => {
      return {} as any;
    }),
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
