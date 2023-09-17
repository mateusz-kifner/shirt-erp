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
  type NewOrder,
  type OrderWithoutRelations,
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
          emails: true,
          employees: true,
          files: true,
          products: true,
          spreadsheets: true,
        },
      });
      if (!oldOrder) throw new Error("Order.update: Order not found");

      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id: oldId,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        spreadsheets: oldSpreadsheets,
        files: oldFiles,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        client: oldClient,
        address: oldAddress,
        products: oldProducts,
        employees: oldEmployees,
        emails: oldEmails,
        ...oldSimpleOrderData
      } = oldOrder;

      console.log(oldOrder, simpleOrderData, spreadsheets);
      if (client?.id !== undefined) {
        simpleOrderData.clientId = client?.id;
      }

      const changes = getObjectChanges<Partial<OrderWithoutRelations>>(
        oldSimpleOrderData,
        simpleOrderData,
      );

      console.log(changes);
      if (!!changes) {
        await db
          .update(orders)
          .set({
            ...changes,
            updatedById: currentUserId,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, id));
      }

      // update address
      if (address !== undefined) {
        if (oldAddress === null)
          throw new Error("Order.update: Order doesn't have address");
        await db
          .update(addresses)
          .set(omit(address, ["id"]))
          .where(eq(addresses.id, oldAddress.id));
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
        await Promise.allSettled([
          ordersToProductsAdded,
          ordersToProductsRemoved,
        ]);
      }

      if (employees !== undefined) {
        const employeeIds = employees
          .filter((v) => v.id !== undefined)
          .map((v) => v.id as number);
        const oldEmployeeIds = oldEmployees.map((v) => v.userId);

        const employeesToBeAdded: number[] = employeeIds.filter(
          (employeeId) => !oldEmployeeIds.includes(employeeId),
        );
        const employeesToBeRemoved: number[] = oldEmployeeIds.filter(
          (oldEmployeeId) => !employeeIds.includes(oldEmployeeId),
        );

        const ordersToEmployeesAdded =
          employeesToBeAdded.length > 0
            ? db.insert(orders_to_users).values(
                employeesToBeAdded.map((employeeId) => ({
                  userId: employeeId,
                  orderId: id,
                })),
              )
            : [];
        const ordersToEmployeesRemoved =
          employeesToBeRemoved.length > 0
            ? db
                .delete(orders_to_users)
                .where(
                  and(
                    eq(orders_to_users.orderId, id),
                    inArray(orders_to_users.userId, employeesToBeRemoved),
                  ),
                )
            : [];
        await Promise.allSettled([
          ordersToEmployeesAdded,
          ordersToEmployeesRemoved,
        ]);
      }
      if (emails !== undefined) {
        const emailIds = emails
          .filter((v) => v.id !== undefined)
          .map((v) => v.id as number);
        const oldEmailIds = oldEmails.map((v) => v.emailMessagesId);

        const emailsToBeAdded: number[] = emailIds.filter(
          (emailId) => !oldEmailIds.includes(emailId),
        );
        const emailsToBeRemoved: number[] = oldEmailIds.filter(
          (oldEmailId) => !emailIds.includes(oldEmailId),
        );

        const ordersToEmailsAdded =
          emailsToBeAdded.length > 0
            ? db.insert(orders_to_email_messages).values(
                emailsToBeAdded.map((emailMessagesId) => ({
                  emailMessagesId,
                  orderId: id,
                })),
              )
            : [];

        const ordersToEmailsRemoved =
          emailsToBeRemoved.length > 0
            ? db
                .delete(orders_to_email_messages)
                .where(
                  and(
                    eq(orders_to_email_messages.orderId, id),
                    inArray(
                      orders_to_email_messages.emailMessagesId,
                      emailsToBeRemoved,
                    ),
                  ),
                )
            : [];

        await Promise.allSettled([ordersToEmailsAdded, ordersToEmailsRemoved]);
      }

      if (files !== undefined) {
        const fileIds = files
          .filter((v) => v.id !== undefined)
          .map((v) => v.id as number);
        const oldFileIds = oldFiles.map((v) => v.fileId);

        const filesToBeAdded: number[] = fileIds.filter(
          (fileId) => !oldFileIds.includes(fileId),
        );
        const filesToBeRemoved: number[] = oldFileIds.filter(
          (oldFileId) => !fileIds.includes(oldFileId),
        );

        const ordersToFilesAdded =
          filesToBeAdded.length > 0
            ? db.insert(orders_to_files).values(
                filesToBeAdded.map((fileId) => ({
                  fileId,
                  orderId: id,
                })),
              )
            : [];

        const ordersToFilesRemoved =
          filesToBeRemoved.length > 0
            ? db
                .delete(orders_to_files)
                .where(
                  and(
                    eq(orders_to_files.orderId, id),
                    inArray(orders_to_files.fileId, filesToBeRemoved),
                  ),
                )
            : [];

        await Promise.allSettled([ordersToFilesAdded, ordersToFilesRemoved]);
      }

      return { ok: true };
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
