import { createProcedureSearch } from "@/server/api/procedures";
import { z } from "zod";

import { db } from "@/db/db";
import { addresses, addresses as addressesSchema } from "@/db/schema/addresses";
import { archive_orders, orders } from "@/db/schema/orders";
import {
  archive_orders_to_email_messages,
  orders_to_email_messages,
} from "@/db/schema/orders_to_email_messages";
import {
  archive_orders_to_files,
  orders_to_files,
} from "@/db/schema/orders_to_files";
import {
  archive_orders_to_products,
  orders_to_products,
} from "@/db/schema/orders_to_products";
import {
  archive_orders_to_users,
  orders_to_users,
} from "@/db/schema/orders_to_users";
import { spreadsheets as spreadsheetsSchema } from "@/db/schema/spreadsheets";
import {
  insertOrderZodSchema,
  updateOrderZodSchema,
  type OrderWithoutRelations,
} from "@/schema/orderZodSchema";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import getObjectChanges from "@/utils/getObjectChanges";
import { and, eq, inArray } from "drizzle-orm";
import { omit } from "lodash";

export const orderArchiveRouter = createTRPCRouter({
  getById: authenticatedProcedure
    .input(z.number())
    .query(async ({ input: id }) => {
      const data = await db.query.archive_orders.findFirst({
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
        .insert(archive_orders)
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
          .insert(archive_orders_to_files)
          .values(files.map((v) => ({ fileId: v.id!, orderId: newOrder.id })));
        console.log(newFilesRelation);
      }

      if (emails?.length && emails.length > 0) {
        const newEmailsRelation = await db
          .insert(archive_orders_to_email_messages)
          .values(
            emails.map((v) => ({
              emailMessagesId: v.id!,
              orderId: newOrder.id,
            })),
          );
        console.log(newEmailsRelation);
      }

      if (products?.length && products.length > 0) {
        const newProductsRelation = await db
          .insert(archive_orders_to_products)
          .values(
            products.map((v) => ({
              productId: v.id!,
              orderId: newOrder.id,
            })),
          );
        console.log(newProductsRelation);
      }

      if (employees?.length && employees.length > 0) {
        const newEmployeesRelation = await db
          .insert(archive_orders_to_users)
          .values(
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
            archiveOrderId: newOrder.id,
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
      const archiveOrder = await db.query.archive_orders.findFirst({
        where: eq(archive_orders.id, id),
      });
      if (!archiveOrder) throw new Error("Order not found");
      // remove address
      if (archiveOrder.addressId !== null) {
        await db
          .delete(addressesSchema)
          .where(eq(addressesSchema.id, archiveOrder.addressId));
      }
      // remove spreadsheet
      await db
        .delete(spreadsheetsSchema)
        .where(eq(spreadsheetsSchema.orderId, id));

      // remove associated relation
      await db
        .delete(archive_orders_to_files)
        .where(eq(archive_orders_to_files.orderId, id));
      await db
        .delete(archive_orders_to_email_messages)
        .where(eq(archive_orders_to_email_messages.orderId, id));
      await db
        .delete(archive_orders_to_products)
        .where(eq(archive_orders_to_products.orderId, id));
      await db
        .delete(archive_orders_to_users)
        .where(eq(archive_orders_to_users.orderId, id));

      // delete order
      const deletedArchiveOrder = await db
        .delete(archive_orders)
        .where(eq(archive_orders.id, id))
        .returning();

      return deletedArchiveOrder[0];
    }),
  update: authenticatedProcedure
    .input(updateOrderZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const {
        id,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const oldArchiveOrder = await db.query.archive_orders.findFirst({
        where: eq(archive_orders.id, id),
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
      if (!oldArchiveOrder) throw new Error("Order.update: Order not found");

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
      } = oldArchiveOrder;

      if (client?.id !== undefined) {
        simpleOrderData.clientId = client?.id;
      }

      const changes = getObjectChanges<Partial<OrderWithoutRelations>>(
        oldSimpleOrderData,
        simpleOrderData,
      );

      if (!!changes) {
        await db
          .update(archive_orders)
          .set({
            ...changes,
            updatedById: currentUserId,
            updatedAt: new Date(),
          })
          .where(eq(archive_orders.id, id));
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
            ? db.insert(archive_orders_to_products).values(
                productsToBeAdded.map((productId) => ({
                  productId,
                  orderId: id,
                })),
              )
            : [];
        const ordersToProductsRemoved =
          productsToBeRemoved.length > 0
            ? db
                .delete(archive_orders_to_products)
                .where(
                  and(
                    eq(archive_orders_to_products.orderId, id),
                    inArray(
                      archive_orders_to_products.productId,
                      productsToBeRemoved,
                    ),
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
            ? db.insert(archive_orders_to_users).values(
                employeesToBeAdded.map((employeeId) => ({
                  userId: employeeId,
                  orderId: id,
                })),
              )
            : [];
        const ordersToEmployeesRemoved =
          employeesToBeRemoved.length > 0
            ? db
                .delete(archive_orders_to_users)
                .where(
                  and(
                    eq(archive_orders_to_users.orderId, id),
                    inArray(
                      archive_orders_to_users.userId,
                      employeesToBeRemoved,
                    ),
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
            ? db.insert(archive_orders_to_email_messages).values(
                emailsToBeAdded.map((emailMessagesId) => ({
                  emailMessagesId,
                  orderId: id,
                })),
              )
            : [];

        const ordersToEmailsRemoved =
          emailsToBeRemoved.length > 0
            ? db
                .delete(archive_orders_to_email_messages)
                .where(
                  and(
                    eq(archive_orders_to_email_messages.orderId, id),
                    inArray(
                      archive_orders_to_email_messages.emailMessagesId,
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
            ? db.insert(archive_orders_to_files).values(
                filesToBeAdded.map((fileId) => ({
                  fileId,
                  orderId: id,
                })),
              )
            : [];

        const ordersToFilesRemoved =
          filesToBeRemoved.length > 0
            ? db
                .delete(archive_orders_to_files)
                .where(
                  and(
                    eq(archive_orders_to_files.orderId, id),
                    inArray(archive_orders_to_files.fileId, filesToBeRemoved),
                  ),
                )
            : [];

        await Promise.allSettled([ordersToFilesAdded, ordersToFilesRemoved]);
      }

      return { ok: true };
    }),

  search: createProcedureSearch(archive_orders),
  unarchiveById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: orderId }) => {
      const archiveOrderData = await db.query.archive_orders.findFirst({
        where: eq(archive_orders.id, orderId),
        with: {
          emails: true,
          employees: true,
          files: true,
          products: true,
          spreadsheets: true,
        },
      });
      if (!archiveOrderData) throw new Error("Order.update: Order not found");

      const {
        id,
        emails,
        files,
        employees,
        products,
        spreadsheets,
        ...simpleOrderData
      } = archiveOrderData;
      await db.transaction(async (tx) => {
        // create archive order
        const newOrderData = await tx
          .insert(orders)
          .values(simpleOrderData)
          .returning();
        if (newOrderData[0] === undefined)
          throw new Error("Could not create archive order");

        // reconnect all files
        if (files.length > 0) {
          await tx.delete(archive_orders_to_files).where(
            and(
              eq(archive_orders_to_files.orderId, id),
              inArray(
                archive_orders_to_files.fileId,
                files.map((v) => v.fileId),
              ),
            ),
          );
          await tx.insert(orders_to_files).values(files);
        }
        // reconnect all emails
        if (emails.length > 0) {
          await tx.delete(archive_orders_to_email_messages).where(
            and(
              eq(archive_orders_to_email_messages.orderId, id),
              inArray(
                archive_orders_to_email_messages.emailMessagesId,
                emails.map((v) => v.emailMessagesId),
              ),
            ),
          );
          await tx.insert(orders_to_email_messages).values(emails);
        }
        // reconnect all employees
        if (employees.length > 0) {
          await tx.delete(archive_orders_to_users).where(
            and(
              eq(archive_orders_to_users.orderId, id),
              inArray(
                archive_orders_to_users.userId,
                employees.map((v) => v.userId),
              ),
            ),
          );
          await tx.insert(orders_to_users).values(employees);
        }
        // reconnect all products
        if (products.length > 0) {
          await tx.delete(archive_orders_to_products).where(
            and(
              eq(archive_orders_to_products.orderId, id),
              inArray(
                archive_orders_to_products.productId,
                products.map((v) => v.productId),
              ),
            ),
          );
          await tx.insert(orders_to_products).values(products);
        }

        // change all spreadsheets
        await tx
          .update(spreadsheetsSchema)
          .set({ archiveOrderId: null, orderId: newOrderData[0].id });

        // delete original order
        await tx.delete(archive_orders).where(eq(archive_orders.id, id));
        return newOrderData;
      });
    }),
});
