import { DBType, db } from "@/db";
import { orders_to_users } from "@/db/schema/orders_to_users";
import { and, eq, inArray } from "drizzle-orm";

// User <=> Employee
async function connect(orderId: number, userId: string, tx: DBType = db) {
  const orderToUserRelation = await tx
    .insert(orders_to_users)
    .values({ orderId, userId })
    .returning();
  if (!orderToUserRelation[0])
    throw new Error(
      `[OrderService]: Could not connect user with id ${userId} to order with id ${orderId}`,
    );
  return orderToUserRelation[0];
}

// User <=> Employee
async function connectMany(
  orderId: number,
  userIds: string[],
  tx: DBType = db,
) {
  if (userIds.length === 0)
    throw new Error(
      `[OrderService]: Could not connect users with ids ${userIds} to order with id ${orderId}`,
    );
  const orderToUserRelation = await tx
    .insert(orders_to_users)
    .values(userIds.map((userId) => ({ orderId, userId })))
    .returning();
  if (orderToUserRelation.length !== userIds.length)
    throw new Error(
      `[OrderService]: Could not connect users with ids ${userIds} to order with id ${orderId}`,
    );
  return orderToUserRelation;
}

// User <=> Employee
async function disconnect(orderId: number, userId: string, tx: DBType = db) {
  const orderToUserRelation = await tx
    .delete(orders_to_users)
    .where(
      and(
        eq(orders_to_users.orderId, orderId),
        eq(orders_to_users.userId, userId),
      ),
    )
    .returning();
  if (!orderToUserRelation[0])
    throw new Error(
      `[OrderService]: Could not disconnect user with id ${userId} to order with id ${orderId}`,
    );
  return orderToUserRelation[0];
}

async function disconnectMany(
  orderId: number,
  userIds: string[],
  tx: DBType = db,
) {
  if (userIds.length === 0)
    throw new Error(
      `[OrderService]: Could not disconnect users with ids ${userIds} to order with id ${orderId}`,
    );

  const orderToUserRelation = await tx
    .delete(orders_to_users)
    .where(
      and(
        eq(orders_to_users.orderId, orderId),
        inArray(orders_to_users.userId, userIds),
      ),
    )
    .returning();
  if (orderToUserRelation.length !== userIds.length)
    throw new Error(
      `[OrderService]: Could not disconnect users with ids ${userIds} to order with id ${orderId}`,
    );
  return orderToUserRelation;
}

async function disconnectAll(orderId: number, tx: DBType = db) {
  return await tx
    .delete(orders_to_users)
    .where(eq(orders_to_users.orderId, orderId))
    .returning();
}

async function set(orderId: number, userIds: string[], tx: DBType = db) {
  const userRelationsRaw = await tx
    .select()
    .from(orders_to_users)
    .where(eq(orders_to_users.orderId, orderId));
  const userRelationIds = userRelationsRaw.map((v) => v.userId);

  const toBeDisconnected = userRelationIds.filter(
    (id) => !userIds.includes(id),
  );
  await disconnectMany(orderId, toBeDisconnected);

  const toBeConnected = userIds.filter((id) => !userRelationIds.includes(id));
  await connectMany(orderId, toBeConnected);

  return userIds;
}

export default {
  set,
  connect,
  connectMany,
  disconnect,
  disconnectMany,
  disconnectAll,
};
