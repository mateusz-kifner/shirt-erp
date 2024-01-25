import { z } from "zod";

import { orders } from "@/db/schema/orders";

import {
  insertOrderByValueZodSchema,
  insertOrderZodSchema,
  updateOrderZodSchema,
} from "@/schema/orderZodSchema";
import { employeeProcedure, createTRPCRouter } from "@/server/api/trpc";
import { and, asc, desc, eq, ilike, sql, or, not, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import orderService from "@/server/services/order";

export const orderRouter = createTRPCRouter({
  getFullById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await orderService.getFullById(id)),

  getById: employeeProcedure
    .input(z.number())
    .query(async ({ input: id }) => await orderService.getById(id)),

  create: employeeProcedure
    .input(insertOrderZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await orderService.createFull({
        ...orderData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),
  createFull: employeeProcedure
    .input(insertOrderByValueZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await orderService.createFullByValue({
        ...orderData,
        createdById: currentUserId,
        updatedById: currentUserId,
      });
    }),
  deleteById: employeeProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => orderService.deleteById(id)),

  update: employeeProcedure
    .input(updateOrderZodSchema)
    .mutation(async ({ input: orderData, ctx }) => {
      const currentUserId = ctx.session.user.id;
      return await orderService.update({
        ...orderData,
        updatedById: currentUserId,
        updatedAt: new Date(),
      });

      // const {
      //   id,
      //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   spreadsheets,
      //   files,
      //   customer,
      //   address,
      //   products,
      //   employees,
      //   emails,
      //   ...simpleOrderData
      // } = orderData;

      // const oldOrder = await db.query.orders.findFirst({
      //   where: eq(orders.id, id),
      //   with: {
      //     address: true,
      //     customer: { with: { address: true } },
      //     emails: true,
      //     employees: true,
      //     files: true,
      //     products: true,
      //     spreadsheets: true,
      //   },
      // });
      // if (!oldOrder) throw new Error("Order.update: Order not found");

      // const {
      //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   id: oldId,
      //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   spreadsheets: oldSpreadsheets,
      //   files: oldFiles,
      //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   customer: oldCustomer,
      //   address: oldAddress,
      //   products: oldProducts,
      //   employees: oldEmployees,
      //   emails: oldEmails,
      //   ...oldSimpleOrderData
      // } = oldOrder;

      // if (customer?.id !== undefined) {
      //   simpleOrderData.customerId = customer?.id;
      // }

      // const changes = getObjectChanges<Partial<OrderWithoutRelations>>(
      //   oldSimpleOrderData,
      //   simpleOrderData,
      // );

      // if (!!changes) {
      //   await db
      //     .update(orders)
      //     .set({
      //       ...changes,
      //       updatedById: currentUserId,
      //       updatedAt: new Date(),
      //     })
      //     .where(eq(orders.id, id));
      // }

      // // update address
      // if (address !== undefined) {
      //   if (oldAddress === null)
      //     throw new Error("Order.update: Order doesn't have address");
      //   await db
      //     .update(addresses)
      //     .set(omit(address, ["id"]))
      //     .where(eq(addresses.id, oldAddress.id));
      // }

      // if (products !== undefined) {
      //   const productIds = products
      //     .filter((v) => v.id !== undefined)
      //     .map((v) => v.id as number);
      //   const oldProductIds = oldProducts.map((v) => v.productId);

      //   const productsToBeAdded: number[] = productIds.filter(
      //     (productId) => !oldProductIds.includes(productId),
      //   );
      //   const productsToBeRemoved: number[] = oldProductIds.filter(
      //     (oldProductId) => !productIds.includes(oldProductId),
      //   );

      //   const ordersToProductsAdded =
      //     productsToBeAdded.length > 0
      //       ? db.insert(orders_to_products).values(
      //           productsToBeAdded.map((productId) => ({
      //             productId,
      //             orderId: id,
      //           })),
      //         )
      //       : [];
      //   const ordersToProductsRemoved =
      //     productsToBeRemoved.length > 0
      //       ? db
      //           .delete(orders_to_products)
      //           .where(
      //             and(
      //               eq(orders_to_products.orderId, id),
      //               inArray(orders_to_products.productId, productsToBeRemoved),
      //             ),
      //           )
      //       : [];
      //   await Promise.allSettled([
      //     ordersToProductsAdded,
      //     ordersToProductsRemoved,
      //   ]);
      // }

      // if (employees !== undefined) {
      //   const employeeIds = employees
      //     .filter((v) => v.id !== undefined)
      //     .map((v) => v.id);
      //   const oldEmployeeIds = oldEmployees.map((v) => v.userId);

      //   const employeesToBeAdded: string[] = employeeIds.filter(
      //     (employeeId) => !oldEmployeeIds.includes(employeeId),
      //   );
      //   const employeesToBeRemoved: string[] = oldEmployeeIds.filter(
      //     (oldEmployeeId) => !employeeIds.includes(oldEmployeeId),
      //   );

      //   const ordersToEmployeesAdded =
      //     employeesToBeAdded.length > 0
      //       ? db.insert(orders_to_users).values(
      //           employeesToBeAdded.map((employeeId) => ({
      //             userId: employeeId,
      //             orderId: id,
      //           })),
      //         )
      //       : [];
      //   const ordersToEmployeesRemoved =
      //     employeesToBeRemoved.length > 0
      //       ? db
      //           .delete(orders_to_users)
      //           .where(
      //             and(
      //               eq(orders_to_users.orderId, id),
      //               inArray(orders_to_users.userId, employeesToBeRemoved),
      //             ),
      //           )
      //       : [];
      //   await Promise.allSettled([
      //     ordersToEmployeesAdded,
      //     ordersToEmployeesRemoved,
      //   ]);
      // }
      // if (emails !== undefined) {
      //   const emailIds = emails
      //     .filter((v) => v.id !== undefined)
      //     .map((v) => v.id as number);
      //   const oldEmailIds = oldEmails.map((v) => v.emailMessageId);

      //   const emailsToBeAdded: number[] = emailIds.filter(
      //     (emailId) => !oldEmailIds.includes(emailId),
      //   );
      //   const emailsToBeRemoved: number[] = oldEmailIds.filter(
      //     (oldEmailId) => !emailIds.includes(oldEmailId),
      //   );

      //   const ordersToEmailsAdded =
      //     emailsToBeAdded.length > 0
      //       ? db.insert(orders_to_email_messages).values(
      //           emailsToBeAdded.map((emailMessageId) => ({
      //             emailMessageId,
      //             orderId: id,
      //           })),
      //         )
      //       : [];

      //   const ordersToEmailsRemoved =
      //     emailsToBeRemoved.length > 0
      //       ? db
      //           .delete(orders_to_email_messages)
      //           .where(
      //             and(
      //               eq(orders_to_email_messages.orderId, id),
      //               inArray(
      //                 orders_to_email_messages.emailMessageId,
      //                 emailsToBeRemoved,
      //               ),
      //             ),
      //           )
      //       : [];

      //   await Promise.allSettled([ordersToEmailsAdded, ordersToEmailsRemoved]);
      // }

      // if (files !== undefined) {
      //   const fileIds = files
      //     .filter((v) => v.id !== undefined)
      //     .map((v) => v.id as number);
      //   const oldFileIds = oldFiles.map((v) => v.fileId);

      //   const filesToBeAdded: number[] = fileIds.filter(
      //     (fileId) => !oldFileIds.includes(fileId),
      //   );
      //   const filesToBeRemoved: number[] = oldFileIds.filter(
      //     (oldFileId) => !fileIds.includes(oldFileId),
      //   );

      //   const ordersToFilesAdded =
      //     filesToBeAdded.length > 0
      //       ? db.insert(orders_to_files).values(
      //           filesToBeAdded.map((fileId) => ({
      //             fileId,
      //             orderId: id,
      //           })),
      //         )
      //       : [];

      //   const ordersToFilesRemoved =
      //     filesToBeRemoved.length > 0
      //       ? db
      //           .delete(orders_to_files)
      //           .where(
      //             and(
      //               eq(orders_to_files.orderId, id),
      //               inArray(orders_to_files.fileId, filesToBeRemoved),
      //             ),
      //           )
      //       : [];

      //   await Promise.allSettled([ordersToFilesAdded, ordersToFilesRemoved]);
      // }

      // return { ok: true };
    }),

  getByCompletionDateRange: employeeProcedure
    .input(
      z.object({
        rangeStart: z.string(),
        rangeEnd: z.string(),
        isArchived: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { rangeStart, rangeEnd, isArchived } = input;
      const results = await db
        .select()
        .from(orders)
        .where(
          and(
            gte(orders.dateOfCompletion, rangeStart),
            lte(orders.dateOfCompletion, rangeEnd),
            eq(orders.isArchived, isArchived),
          ),
        );
      return results;
    }),

  search: employeeProcedure
    .input(
      z.object({
        keys: z.array(z.string()),
        query: z.string().optional(),
        sort: z.enum(["desc", "asc"]).default("desc"),
        sortColumn: z.string().default("name"),
        excludeKey: z.string().optional(),
        excludeValue: z.string().optional(),
        currentPage: z.number().default(1),
        itemsPerPage: z.number().default(10),
        isArchived: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      const {
        keys,
        query,
        sort,
        sortColumn,
        excludeKey,
        excludeValue,
        currentPage,
        itemsPerPage,
        isArchived,
      } = input;

      const queryParam = query && query.length > 0 ? `%${query}%` : undefined;

      const search = queryParam
        ? keys.map((key) =>
            ilike(orders[key as keyof typeof orders.$inferSelect], queryParam),
          )
        : [];
      const results = await db
        .select()
        .from(orders)
        .where(
          and(
            queryParam
              ? or(...search)
              : excludeKey && excludeValue
                ? not(
                    ilike(
                      orders[excludeKey as keyof typeof orders.$inferSelect],
                      `${excludeValue}%`,
                    ),
                  )
                : undefined,
            eq(orders.isArchived, isArchived),
          ),
        )
        .limit(itemsPerPage)
        .offset((currentPage - 1) * itemsPerPage)
        .orderBy(
          (sort === "asc" ? asc : desc)(
            orders[sortColumn as keyof typeof orders.$inferSelect],
          ),
        );
      // console.log(results);
      const totalItems = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders);

      return {
        results,
        totalItems: totalItems?.[0]?.count ?? 0,
      };
    }),
});
