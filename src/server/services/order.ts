import { DBType, db } from "@/db";
import { orders } from "@/db/schema/orders";
import { and, eq, sql } from "drizzle-orm";
import { NewOrder, Order, UpdatedOrder } from "@/schema/orderZodSchema";
import { MetadataType } from "@/schema/MetadataType";
import { orders_to_products } from "@/db/schema/orders_to_products";

// compile query ahead of time
const orderPrepareGetFullById = db.query.orders
  .findFirst({
    where: eq(orders.id, sql.placeholder("id")),
    with: {
      address: true,
      client: true,
      emails: { with: { emailMessages: true } },
      employees: { with: { users: true } },
      files: { with: { files: true } },
      products: { with: { products: true } },
      spreadsheets: true,
    },
  })
  .prepare("orderPrepareGetFullById");

async function getFullById(id: number) {
  const order = await orderPrepareGetFullById.execute({ id });
  if (!order) throw new Error("[OrderService]: Could not find order");
  const { emails, employees, files, products, ...moreData } = order;
  return {
    ...moreData,
    emails: emails.map((v) => v.emailMessages),
    employees: employees.map((v) => v.users),
    files: files.map((v) => v.files),
    products: products.map((v) => v.products),
  };
}

// compile query ahead of time
const dbPrepareGetById = db.query.orders
  .findFirst({
    where: eq(orders.id, sql.placeholder("id")),
    with: {
      emails: true,
      employees: true,
      files: true,
      products: true,
      spreadsheets: true,
    },
  })
  .prepare("orderPrepareGetById");

async function getById(id: number) {
  const order = await dbPrepareGetById.execute({ id });
  if (!order) throw new Error("[OrderService]: Could not find order");
  const { emails, employees, files, products, ...moreData } = order;
  return {
    ...moreData,
    emails: emails.map((v) => v.emailMessagesId),
    employees: employees.map((v) => v.userId),
    files: files.map((v) => v.fileId),
    products: products.map((v) => v.productId),
  };
}

async function create(orderData: NewOrder, tx: DBType = db) {
  const newOrder = await tx.insert(orders).values(orderData).returning();
  if (!newOrder[0]) throw new Error("[OrderService]: Could not create order");
  return newOrder[0];
}

async function deleteById(id: number, tx: DBType = db) {
  const deletedOrder = await tx
    .delete(orders)
    .where(eq(orders.id, id))
    .returning();
  if (!deletedOrder[0])
    throw new Error("[OrderService]: Could not delete order");
  return deletedOrder[0];
}

async function update(orderData: UpdatedOrder & MetadataType, tx: DBType = db) {
  const { id, ...dataToUpdate } = orderData;
  const updatedOrder = await tx
    .update(orders)
    .set(dataToUpdate)
    .where(eq(orders.id, id))
    .returning();
  if (!updatedOrder[0])
    throw new Error("[OrderService]: Could not update order");
  return updatedOrder[0];
}

async function connectProduct(
  orderId: number,
  productId: number,
  tx: DBType = db,
) {
  const orderToProductRelation = await tx
    .insert(orders_to_products)
    .values({ orderId, productId })
    .returning();
  if (!orderToProductRelation[0])
    throw new Error("[OrderService]: Could not connect product");
  return orderToProductRelation[0];
}

async function disconnectProduct(
  orderId: number,
  productId: number,
  tx: DBType = db,
) {
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
    throw new Error("[OrderService]: Could not disconnect product");
  return orderToProductRelation[0];
}

const orderService = {
  getFullById,
  getById,
  create,
  update,
  deleteById,
  connectProduct,
  disconnectProduct,
};

export default orderService;
