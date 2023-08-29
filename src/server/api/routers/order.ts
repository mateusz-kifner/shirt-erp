import { createProcedureSearch } from "@/server/api/procedures";
import { z } from "zod";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { db } from "@/db/db";
import { eq, inArray } from "drizzle-orm";
import {
  orders,
} from "@/db/schema/orders";
import { orders_to_files } from "@/db/schema/orders_to_files";
import { orders_to_email_messages } from "@/db/schema/orders_to_email_messages";
import {
  orders_to_products,
  orders_to_products_relations,
} from "@/db/schema/orders_to_products";
import {
  orders_to_users,
  orders_to_users_relations,
} from "@/db/schema/orders_to_users";
import { spreadsheets as spreadsheetsSchema } from "@/db/schema/spreadsheets";
import { addresses as addressesSchema } from "@/db/schema/addresses";
import { orders_to_spreadsheets } from "@/db/schema/orders_to_spreadsheets";
import { isEqual } from "lodash";
import { insertOrderSchema, insertOrderSchemaWithRelations } from "@/db/validators/orders";

export const orderRouter = createTRPCRouter({
  getById: authenticatedProcedure
    .input(z.number())
    .query(async ({ input: id }) => {
      const data = await db.query.orders.findFirst({
        where: eq(orders.id, id),
        with: {
          address: true,
          client: true,
          emails: { with: { emailMessages: true } },
          employees: { with: { users: true } },
          files: { with: { files: true } },
          products: { with: { products: true } },
          spreadsheets: { with: { spreadsheets: true } },
        },
      });
      if (!data) return undefined;
      const { emails, employees, files, products, spreadsheets, ...moreData } =
        data;
      return {
        ...moreData,
        emails: emails.map((v) => v.emailMessages),
        employees: employees.map((v) => v.users),
        files: files.map((v) => v.files),
        products: products.map((v) => v.products),
        spreadsheets: spreadsheets.map((v) => v.spreadsheets),
      };
    }),
  create: authenticatedProcedure
    .input(insertOrderSchemaWithRelations)
    .mutation(async ({ input: orderData }) => {
      const {
        spreadsheets,
        files,
        client,
        address,
        products,
        employees,
        emails,
        ...simpleOrderData
      } = orderData;

      const newAddress = await db
        .insert(addressesSchema)
        .values(address ?? {})
        .returning();
      if (newAddress[0] === undefined)
        throw new Error("Could not create address in order");

      const result = await db
        .insert(orders)
        .values({
          ...simpleOrderData,
          clientId: client ? client.id : undefined,
          addressId: newAddress[0].id,
        })
        .returning();
      if (result[0] === undefined) throw new Error("Could not create order");
      const newOrder = result[0];

      if (files?.length && files.length > 0) {
        const newFilesRelation = await db
          .insert(orders_to_files)
          .values(files.map((v) => ({ fileId: v.id!, orderId: newOrder.id })));
        console.log(newFilesRelation);
      }

      if (emails?.length && emails.length > 0) {
        const newEmailsRelation = await db
          .insert(orders_to_email_messages)
          .values(
            emails.map((v) => ({
              emailMessagesId: v.id!,
              orderId: newOrder.id,
            })),
          );
        console.log(newEmailsRelation);
      }

      if (products?.length && products.length > 0) {
        const newProductsRelation = await db.insert(orders_to_products).values(
          products.map((v) => ({
            productId: v.id!,
            orderId: newOrder.id,
          })),
        );
        console.log(newProductsRelation);
      }

      if (employees?.length && employees.length > 0) {
        const newEmployeesRelation = await db.insert(orders_to_users).values(
          employees.map((v) => ({
            userId: v.id!,
            orderId: newOrder.id,
          })),
        );
        console.log(newEmployeesRelation);
      }

      if (spreadsheets?.length && spreadsheets.length > 0) {
        const newSpreadsheets = await db
          .insert(spreadsheetsSchema)
          .values(spreadsheets)
          .returning();

        const newSpreadsheetsRelation = await db
          .insert(orders_to_spreadsheets)
          .values(
            newSpreadsheets.map((v) => ({
              spreadsheetId: v.id!,
              orderId: newOrder.id,
            })),
          );
        console.log(newSpreadsheetsRelation);
      }

      return newOrder;
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const order = await db.query.orders.findFirst({
        where: eq(orders.id, id),
      });
      if (!order) throw new Error("Order not found");
      // remove address
      if (order.addressId !== null) {
        await db
          .delete(addressesSchema)
          .where(eq(addressesSchema.id, order.addressId));
      }
      // remove spreadsheet
      const deletedSpreadsheets = await db
        .delete(orders_to_spreadsheets)
        .where(eq(orders_to_spreadsheets.orderId, id))
        .returning();
      await db.delete(spreadsheetsSchema).where(
        inArray(
          spreadsheetsSchema.id,
          deletedSpreadsheets.map((v) => v.spreadsheetId),
        ),
      );
      // remove associated relation
      await db.delete(orders_to_files).where(eq(orders_to_files.orderId, id));
      await db
        .delete(orders_to_email_messages)
        .where(eq(orders_to_email_messages.orderId, id));
      await db
        .delete(orders_to_products)
        .where(eq(orders_to_products.orderId, id));
      await db.delete(orders_to_users).where(eq(orders_to_users.orderId, id));

      // delete order
      const deletedOrder = await db
        .delete(orders)
        .where(eq(orders.id, id))
        .returning();

      return deletedOrder[0];
    }),
  // update: authenticatedProcedure
  //   .input(insertOrderSchemaWithRelations.merge(z.object({ id: z.number() })))
  //   .mutation(async ({ input: orderData }) => {
  //     const {
  //       id,
  //       spreadsheets,
  //       files,
  //       client,
  //       address,
  //       products,
  //       employees,
  //       emails,
  //       ...simpleOrderData
  //     } = orderData;

  //     const order = await db.query.orders.findFirst({
  //       where: eq(orders.id, id),
  //       with: {
  //         address: true,
  //         client: true,
  //         emails: { with: { emailMessages: true } },
  //         employees: { with: { users: true } },
  //         files: { with: { files: true } },
  //         products: { with: { products: true } },
  //         spreadsheets: { with: { spreadsheets: true } },
  //       },
  //     });
  //     if (!order) throw new Error("Order not found");

  //     const {
  //       id: oldId,
  //       spreadsheets: oldSpreadsheets,
  //       files: oldFiles,
  //       client: oldClient,
  //       address: oldAddress,
  //       products: oldProducts,
  //       employees: oldEmployees,
  //       emails: oldEmails,
  //       ...oldSimpleOrderData
  //     } = order;

  //     // if (!isEqual(oldSimpleOrderData, simpleOrderData) || client !== undefined) {
  //     //   await db.update(orders).set({
  //     //     ...simpleOrderData,
  //     //     clientId:
  //     //       client?.id !== undefined ? client.id : simpleOrderData.clientId,
  //     //   });
  //     // }

  //     // if (Array.isArray(products)) {
  //     //   const alreadyInDB = await db.query.orders_to_products.findMany({
  //     //     where: inArray(
  //     //       orders_to_products.productId,
  //     //       products.map((v) => v.id!),
  //     //     ),
  //     //   });
  //     //   // const toBeMade = products.filter((v)=>al)
  //     // }

  //     // if (employees && Array.isArray(employees)) {
  //     //   updateData.employees = {
  //     //     set: employees.map((val) => ({ id: val.id })),
  //     //   };
  //     // }

  //     // if (files && Array.isArray(files))
  //     //   updateData.files = { set: files.map((val) => ({ id: val.id })) };

  //     // if (emails && Array.isArray(emails))
  //     //   updateData.emails = { set: emails.map((val) => ({ id: val.id })) };

  //     // if (address) updateData.address = { update: address };

  //     return {};
  //   }),
  //
  search: createProcedureSearch(orders),
  // archiveById: authenticatedProcedure
  //   .input(z.number())
  //   .mutation(async ({ input: orderId }) => {
  //     const orderData = await prisma.order.findUniqueOrThrow({
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
  //       ...simpleOrderData
  //     } = orderData;

  //     const newOrderArchiveData: Prisma.OrderArchiveCreateInput = {
  //       ...simpleOrderData,
  //     };

  //     if (address?.id !== undefined)
  //       newOrderArchiveData.address = { connect: { id: address.id } };
  //     newOrderArchiveData.emails = {
  //       connect: emails.map((v) => ({ id: v.id })),
  //     };
  //     newOrderArchiveData.files = { connect: files.map((v) => ({ id: v.id })) };
  //     newOrderArchiveData.employees = {
  //       connect: employees.map((v) => ({ id: v.id })),
  //     };
  //     if (client?.id !== undefined)
  //       newOrderArchiveData.client = { connect: { id: client.id } };
  //     newOrderArchiveData.designs = {
  //       connect: designs.map((v) => ({ id: v.id })),
  //     };
  //     newOrderArchiveData.products = {
  //       connect: products.map((v) => ({ id: v.id })),
  //     };
  //     newOrderArchiveData.spreadsheets = {
  //       connect: spreadsheets.map((v) => ({ id: v.id })),
  //     };

  //     const orderArchiveData = await prisma.orderArchive.create({
  //       data: newOrderArchiveData,
  //     });
  //     if (orderArchiveData) {
  //       await prisma.order.delete({
  //         where: { id },
  //       });
  //     }
  //     return orderArchiveData;
  //   }),
});
