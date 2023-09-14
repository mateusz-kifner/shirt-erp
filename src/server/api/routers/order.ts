import { createProcedureSearch } from "@/server/api/procedures";
import { z } from "zod";

import { db } from "@/db/db";
import { addresses, addresses as addressesSchema } from "@/db/schema/addresses";
import { orders } from "@/db/schema/orders";
import { orders_to_email_messages } from "@/db/schema/orders_to_email_messages";
import { orders_to_files } from "@/db/schema/orders_to_files";
import { orders_to_products } from "@/db/schema/orders_to_products";
import { orders_to_users } from "@/db/schema/orders_to_users";
import { spreadsheets as spreadsheetsSchema } from "@/db/schema/spreadsheets";
import {
  NewOrder,
  OrderWithoutRelations,
  insertOrderZodSchema,
  updateOrderZodSchema,
} from "@/schema/orderZodSchema";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import getObjectChanges from "@/utils/getObjectChanges";
import { and, eq, inArray } from "drizzle-orm";
import { omit } from "lodash";

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
          spreadsheets: true,
        },
      });
      if (!data) return undefined;
      console.log(data);
      const { emails, employees, files, products, ...moreData } = data;
      return {
        ...moreData,
        emails: emails.map((v) => v.emailMessages),
        employees: employees.map((v) => v.users),
        files: files.map((v) => v.files),
        products: products.map((v) => v.products),
      };
    }),
  create: authenticatedProcedure
    .input(insertOrderZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
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
      const currentUserId = ctx.session!.user!.id;
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
          createdById: currentUserId,
          updatedById: currentUserId,
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
          .values({
            ...spreadsheets,
            orderId: newOrder.id,
            updatedById: currentUserId,
            createdById: currentUserId,
          })
          .returning();
        console.log(newSpreadsheets);
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
      await db
        .delete(spreadsheetsSchema)
        .where(eq(spreadsheetsSchema.orderId, id));

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
  update: authenticatedProcedure
    .input(updateOrderZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const {
        id,
        spreadsheets,
        files,
        client,
        address,
        products,
        employees,
        emails,
        ...simpleOrderData
      } = orderData;
      const currentUserId = ctx.session!.user!.id;
      const oldOrder = await db.query.orders.findFirst({
        where: eq(orders.id, id),
        with: {
          address: true,
          client: { with: { address: true } },
          emails: { with: { emailMessages: true } },
          employees: { with: { users: true } },
          files: { with: { files: true } },
          products: { with: { products: true } },
          spreadsheets: true,
        },
      });
      if (!oldOrder) throw new Error("Order.update: Order not found");

      const {
        id: oldId,
        spreadsheets: oldSpreadsheets,
        files: oldFiles,
        client: oldClient,
        address: oldAddress,
        products: oldProducts,
        employees: oldEmployees,
        emails: oldEmails,
        ...oldSimpleOrderData
      } = oldOrder;

      console.log(oldOrder, simpleOrderData, spreadsheets);

      const changes = getObjectChanges<Partial<OrderWithoutRelations>>(
        oldSimpleOrderData,
        simpleOrderData,
      );
      console.log(changes);
      let result: Partial<NewOrder> = {};
      if (!!changes) {
        const updated = await db
          .update(orders)
          .set({
            ...changes,
            updatedById: currentUserId,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, id))
          .returning();
        if (!!updated[0]) result = updated[0];
      }

      // update address
      if (address !== undefined) {
        if (oldAddress === null)
          throw new Error("Order.update: Order doesn't have address");
        const addressResult = await db
          .update(addresses)
          .set(omit(address, ["id"]))
          .where(eq(addresses.id, oldAddress.id))
          .returning();
        if (addressResult[0] === undefined)
          throw new Error("Order.update: address doesn't return value");
        result.address = addressResult[0];
      }

      if (products !== undefined) {
        const productIds = products
          .filter((v) => v.id !== undefined)
          .map((v) => v.id as number);
        const oldProductIds = oldProducts.map((v) => v.productId);

        const productsToBeAdded: number[] = productIds.filter(
          (productId) => !oldProductIds.includes(productId),
        );
        const productsToBeRemoved: number[] = oldProductIds.filter(
          (oldProductId) => !productIds.includes(oldProductId),
        );

        const ordersToProductsAdded =
          productsToBeAdded.length > 0
            ? db.insert(orders_to_products).values(
                productsToBeAdded.map((productId) => ({
                  productId,
                  orderId: id,
                })),
              )
            : [];
        const ordersToProductsRemoved =
          productsToBeRemoved.length > 0
            ? db
                .delete(orders_to_products)
                .where(
                  and(
                    eq(orders_to_products.orderId, id),
                    inArray(orders_to_products.productId, productsToBeRemoved),
                  ),
                )
            : [];
        const productResult = await Promise.allSettled([
          ordersToProductsAdded,
          ordersToProductsRemoved,
        ]);
        console.log(productResult);
      }
      // if (Array.isArray(products)) {
      //   const alreadyInDB = await db.query.orders_to_products.findMany({
      //     where: inArray(
      //       orders_to_products.productId,
      //       products.map((v) => v.id!),
      //     ),
      //   });
      //   // const toBeMade = products.filter((v)=>al)
      // }

      // if (employees && Array.isArray(employees)) {
      //   updateData.employees = {
      //     set: employees.map((val) => ({ id: val.id })),
      //   };
      // }

      // if (files && Array.isArray(files))
      //   updateData.files = { set: files.map((val) => ({ id: val.id })) };

      // if (emails && Array.isArray(emails))
      //   updateData.emails = { set: emails.map((val) => ({ id: val.id })) };

      return result;
    }),

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
