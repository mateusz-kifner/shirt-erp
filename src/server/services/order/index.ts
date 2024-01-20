import { DBType, db } from "@/db";
import { orders } from "@/db/schema/orders";
import { eq, sql } from "drizzle-orm";
import { NewOrder, UpdatedOrder } from "@/schema/orderZodSchema";
import { MetadataType } from "@/schema/MetadataType";
import addressService from "../address";
import { spreadsheets as spreadsheetsSchema } from "@/db/schema/spreadsheets";
import spreadsheetService from "../spreadsheets";
import productRelation from "./productRelation";
import userRelation from "./userRelation";
import fileRelation from "./fileRelation";
import emailMessageRelation from "./emailMessageRelation";

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
  if (!order)
    throw new Error(`[OrderService]: Could not find order with id ${id}`);
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
  if (!order)
    throw new Error(`[OrderService]: Could not find order with id ${id}`);
  const { emails, employees, files, products, ...moreData } = order;
  return {
    ...moreData,
    emails: emails.map((v) => v.emailMessageId),
    employees: employees.map((v) => v.userId),
    files: files.map((v) => v.fileId),
    products: products.map((v) => v.productId),
  };
}

async function create(orderData: NewOrder & MetadataType, tx: DBType = db) {
  const newOrder = await tx.insert(orders).values(orderData).returning();
  if (!newOrder[0])
    throw new Error(
      `[OrderService]: Could not create order with name ${orderData?.name}`,
    );

  return newOrder[0];
}

// TODO: make this transaction
async function createFull(orderData: NewOrder & MetadataType, tx: DBType = db) {
  const {
    products,
    emails,
    employees,
    files,
    address,
    addressId,
    spreadsheets,
    ...moreData
  } = orderData;

  let newAddressId: number | undefined;
  if (!!address) {
    const newAddress = await addressService.create({
      ...address,
      id: undefined,
    });
    if (!newAddress)
      throw new Error(
        `[OrderService]: Could not create order with name ${orderData?.name}, provided address could not be created`,
      );
    newAddressId = newAddress.id;
  }
  const newOrder = await tx
    .insert(orders)
    .values(
      newAddressId === undefined
        ? moreData
        : { ...moreData, addressId: newAddressId },
    )
    .returning();
  if (!newOrder[0])
    throw new Error(
      `[OrderService]: Could not create order with name ${orderData?.name}`,
    );
  const orderId = newOrder[0].id;
  if (products?.length && products.length > 0)
    await productRelation.set(
      orderId,
      products.map((v) => v.id).filter((v) => !!v) as number[],
    );

  if (emails?.length && emails.length > 0)
    await emailMessageRelation.set(
      orderId,
      emails.map((v) => v.id).filter((v) => !!v) as number[],
    );

  if (employees?.length && employees.length > 0)
    await userRelation.set(
      orderId,
      employees.map((v) => v.id).filter((v) => !!v) as string[],
    );

  if (files?.length && files.length > 0)
    await productRelation.set(
      orderId,
      files.map((v) => v.id).filter((v) => !!v) as number[],
    );

  if (spreadsheets?.length && spreadsheets.length > 0)
    await spreadsheetService.create({
      ...spreadsheets,
      orderId,
    });

  return newOrder[0];
}

// TODO: make this transaction
async function deleteById(id: number, tx: DBType = db) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });
  if (!order)
    throw new Error(`[OrderService]: Could not find order with id ${id}`);
  if (order.addressId !== null)
    await addressService.deleteById(order.addressId);

  // remove all spreadsheets
  await db.delete(spreadsheetsSchema).where(eq(spreadsheetsSchema.orderId, id));
  await userRelation.disconnectAll(id);
  await productRelation.disconnectAll(id);
  await fileRelation.disconnectAll(id);
  await emailMessageRelation.disconnectAll(id);

  const deletedOrder = await tx
    .delete(orders)
    .where(eq(orders.id, id))
    .returning();
  if (!deletedOrder[0])
    throw new Error(`[OrderService]: Could not delete order with id ${id}`);
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
    throw new Error(`[OrderService]: Could not update order with id ${id}`);
  return updatedOrder[0];
}

const orderService = {
  getFullById,
  getById,
  create,
  createFull,
  update,
  deleteById,
  productRelation,
  userRelation,
  emailMessageRelation,
  fileRelation,
};

export default orderService;
