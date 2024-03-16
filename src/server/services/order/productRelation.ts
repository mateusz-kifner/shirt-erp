import { DBType, db } from "@/server/db";
import { orders_to_products } from "@/server/db/schema/orders_to_products";
import { and, eq, inArray } from "drizzle-orm";

async function connect(orderId: number, productId: number, tx: DBType = db) {
  const orderToProductRelation = await tx
    .insert(orders_to_products)
    .values({ orderId, productId })
    .returning();
  if (!orderToProductRelation[0])
    throw new Error(
      `[OrderService]: Could not connect product with id ${productId} to order with id ${orderId}`,
    );
  return orderToProductRelation[0];
}

async function connectMany(
  orderId: number,
  productIds: number[],
  tx: DBType = db,
) {
  if (productIds.length === 0)
    throw new Error(
      `[OrderService]: Could not connect products with ids ${productIds} to order with id ${orderId}`,
    );
  const orderToProductRelation = await tx
    .insert(orders_to_products)
    .values(productIds.map((productId) => ({ orderId, productId })))
    .returning();
  if (orderToProductRelation.length !== productIds.length)
    throw new Error(
      `[OrderService]: Could not connect products with ids ${productIds} to order with id ${orderId}`,
    );
  return orderToProductRelation;
}

async function disconnect(orderId: number, productId: number, tx: DBType = db) {
  const orderToProductRelation = await tx
    .delete(orders_to_products)
    .where(
      and(
        eq(orders_to_products.orderId, orderId),
        eq(orders_to_products.productId, productId),
      ),
    )
    .returning();
  if (!orderToProductRelation[0])
    throw new Error(
      `[OrderService]: Could not disconnect product with id ${productId} to order with id ${orderId}`,
    );
  return orderToProductRelation[0];
}

async function disconnectMany(
  orderId: number,
  productIds: number[],
  tx: DBType = db,
) {
  if (productIds.length === 0)
    throw new Error(
      `[OrderService]: Could not disconnect products with ids ${productIds} to order with id ${orderId}`,
    );

  const orderToProductRelation = await tx
    .delete(orders_to_products)
    .where(
      and(
        eq(orders_to_products.orderId, orderId),
        inArray(orders_to_products.productId, productIds),
      ),
    )
    .returning();
  if (orderToProductRelation.length !== productIds.length)
    throw new Error(
      `[OrderService]: Could not disconnect products with ids ${productIds} to order with id ${orderId}`,
    );
  return orderToProductRelation;
}

async function disconnectAll(orderId: number, tx: DBType = db) {
  return await tx
    .delete(orders_to_products)
    .where(eq(orders_to_products.orderId, orderId))
    .returning();
}

async function set(orderId: number, productIds: number[], tx: DBType = db) {
  const productRelationsRaw = await tx
    .select()
    .from(orders_to_products)
    .where(eq(orders_to_products.orderId, orderId));
  const productRelationIds = productRelationsRaw.map((v) => v.productId);

  const toBeDisconnected = productRelationIds.filter(
    (id) => !productIds.includes(id),
  );
  await disconnectMany(orderId, toBeDisconnected);

  const toBeConnected = productIds.filter(
    (id) => !productRelationIds.includes(id),
  );
  await connectMany(orderId, toBeConnected);

  return productIds;
}

export default {
  set,
  connect,
  connectMany,
  disconnect,
  disconnectMany,
  disconnectAll,
};
