import { DBType, db } from "@/db";
import { orders } from "@/db/schema/orders";
import { and, eq, inArray, sql } from "drizzle-orm";
import { NewOrder, UpdatedOrder } from "@/schema/orderZodSchema";
import { MetadataType } from "@/schema/MetadataType";
import { orders_to_products } from "@/db/schema/orders_to_products";
import { orders_to_files } from "@/db/schema/orders_to_files";
import { orders_to_users } from "@/db/schema/orders_to_users";
import { orders_to_email_messages } from "@/db/schema/orders_to_email_messages";
import addressService from "./address";
import { spreadsheets as spreadsheetsSchema } from "@/db/schema/spreadsheets";
import spreadsheetService from "./spreadsheets";

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

async function create(orderData: NewOrder, tx: DBType = db) {
  const newOrder = await tx.insert(orders).values(orderData).returning();
  if (!newOrder[0])
    throw new Error(
      `[OrderService]: Could not create order with name ${orderData?.name}`,
    );

  return newOrder[0];
}

// TODO: make this transaction
async function createFull(orderData: NewOrder, tx: DBType = db) {
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
    await setProductRelations(
      orderId,
      products.map((v) => v.id).filter((v) => !!v) as number[],
    );

  if (emails?.length && emails.length > 0)
    await setEmailMessageRelations(
      orderId,
      emails.map((v) => v.id).filter((v) => !!v) as number[],
    );

  if (employees?.length && employees.length > 0)
    await setUserRelations(
      orderId,
      employees.map((v) => v.id).filter((v) => !!v) as string[],
    );

  if (files?.length && files.length > 0)
    await setProductRelations(
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
  await disconnectAllUsers(id);
  await disconnectAllProducts(id);
  await disconnectAllFiles(id);
  await disconnectAllEmailMessages(id);

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
    throw new Error(
      `[OrderService]: Could not connect product with id ${productId} to order with id ${orderId}`,
    );
  return orderToProductRelation[0];
}

async function connectManyProducts(
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
    throw new Error(
      `[OrderService]: Could not disconnect product with id ${productId} to order with id ${orderId}`,
    );
  return orderToProductRelation[0];
}

async function disconnectManyProducts(
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

async function disconnectAllProducts(orderId: number, tx: DBType = db) {
  return await tx
    .delete(orders_to_products)
    .where(eq(orders_to_products.orderId, orderId))
    .returning();
}

async function setProductRelations(
  orderId: number,
  productIds: number[],
  tx: DBType = db,
) {
  const productRelationsRaw = await tx
    .select()
    .from(orders_to_products)
    .where(eq(orders_to_products.orderId, orderId));
  const productRelationIds = productRelationsRaw.map((v) => v.productId);

  const toBeDisconnected = productRelationIds.filter(
    (id) => !productIds.includes(id),
  );
  await disconnectManyProducts(orderId, toBeDisconnected);

  const toBeConnected = productIds.filter(
    (id) => !productRelationIds.includes(id),
  );
  await connectManyProducts(orderId, toBeConnected);

  return productIds;
}

async function connectFile(orderId: number, fileId: number, tx: DBType = db) {
  const orderToFileRelation = await tx
    .insert(orders_to_files)
    .values({ orderId, fileId })
    .returning();
  if (!orderToFileRelation[0])
    throw new Error(
      `[OrderService]: Could not connect file with id ${fileId} to order with id ${orderId}`,
    );
  return orderToFileRelation[0];
}

async function connectManyFiles(
  orderId: number,
  fileIds: number[],
  tx: DBType = db,
) {
  if (fileIds.length === 0)
    throw new Error(
      `[OrderService]: Could not connect files with ids ${fileIds} to order with id ${orderId}`,
    );
  const orderToFileRelation = await tx
    .insert(orders_to_files)
    .values(fileIds.map((fileId) => ({ orderId, fileId })))
    .returning();
  if (orderToFileRelation.length !== fileIds.length)
    throw new Error(
      `[OrderService]: Could not connect files with ids ${fileIds} to order with id ${orderId}`,
    );
  return orderToFileRelation;
}

async function disconnectFile(
  orderId: number,
  fileId: number,
  tx: DBType = db,
) {
  const orderToFileRelation = await tx
    .delete(orders_to_files)
    .where(
      and(
        eq(orders_to_files.orderId, orderId),
        eq(orders_to_files.fileId, fileId),
      ),
    )
    .returning();
  if (!orderToFileRelation[0])
    throw new Error(
      `[OrderService]: Could not disconnect file with id ${fileId} to order with id ${orderId}`,
    );
  return orderToFileRelation[0];
}

async function disconnectManyFiles(
  orderId: number,
  fileIds: number[],
  tx: DBType = db,
) {
  if (fileIds.length === 0)
    throw new Error(
      `[OrderService]: Could not disconnect files with ids ${fileIds} to order with id ${orderId}`,
    );

  const orderToFileRelation = await tx
    .delete(orders_to_files)
    .where(
      and(
        eq(orders_to_files.orderId, orderId),
        inArray(orders_to_files.fileId, fileIds),
      ),
    )
    .returning();
  if (orderToFileRelation.length !== fileIds.length)
    throw new Error(
      `[OrderService]: Could not disconnect files with ids ${fileIds} to order with id ${orderId}`,
    );
  return orderToFileRelation;
}

async function disconnectAllFiles(orderId: number, tx: DBType = db) {
  return await tx
    .delete(orders_to_files)
    .where(eq(orders_to_files.orderId, orderId))
    .returning();
}

async function setFileRelations(
  orderId: number,
  fileIds: number[],
  tx: DBType = db,
) {
  const fileRelationsRaw = await tx
    .select()
    .from(orders_to_files)
    .where(eq(orders_to_files.orderId, orderId));
  const fileRelationIds = fileRelationsRaw.map((v) => v.fileId);

  const toBeDisconnected = fileRelationIds.filter(
    (id) => !fileIds.includes(id),
  );
  await disconnectManyFiles(orderId, toBeDisconnected);

  const toBeConnected = fileIds.filter((id) => !fileRelationIds.includes(id));
  await connectManyFiles(orderId, toBeConnected);

  return fileIds;
}

// User <=> Employee
async function connectUser(orderId: number, userId: string, tx: DBType = db) {
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
async function connectManyUsers(
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
async function disconnectUser(
  orderId: number,
  userId: string,
  tx: DBType = db,
) {
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

async function disconnectManyUsers(
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

async function disconnectAllUsers(orderId: number, tx: DBType = db) {
  return await tx
    .delete(orders_to_users)
    .where(eq(orders_to_users.orderId, orderId))
    .returning();
}

async function setUserRelations(
  orderId: number,
  userIds: string[],
  tx: DBType = db,
) {
  const userRelationsRaw = await tx
    .select()
    .from(orders_to_users)
    .where(eq(orders_to_users.orderId, orderId));
  const userRelationIds = userRelationsRaw.map((v) => v.userId);

  const toBeDisconnected = userRelationIds.filter(
    (id) => !userIds.includes(id),
  );
  await disconnectManyUsers(orderId, toBeDisconnected);

  const toBeConnected = userIds.filter((id) => !userRelationIds.includes(id));
  await connectManyUsers(orderId, toBeConnected);

  return userIds;
}

async function connectEmailMessage(
  orderId: number,
  emailMessageId: number,
  tx: DBType = db,
) {
  const orderToEmailMessageRelation = await tx
    .insert(orders_to_email_messages)
    .values({ orderId, emailMessageId })
    .returning();
  if (!orderToEmailMessageRelation[0])
    throw new Error(
      `[OrderService]: Could not connect email message with id ${emailMessageId} to order with id ${orderId}`,
    );
  return orderToEmailMessageRelation[0];
}

async function connectManyEmailMessages(
  orderId: number,
  emailMessageIds: number[],
  tx: DBType = db,
) {
  if (emailMessageIds.length === 0)
    throw new Error(
      `[OrderService]: Could not connect email_messages with ids ${emailMessageIds} to order with id ${orderId}`,
    );
  const orderToEmailMessageRelation = await tx
    .insert(orders_to_email_messages)
    .values(
      emailMessageIds.map((emailMessageId) => ({ orderId, emailMessageId })),
    )
    .returning();
  if (orderToEmailMessageRelation.length !== emailMessageIds.length)
    throw new Error(
      `[OrderService]: Could not connect email_messages with ids ${emailMessageIds} to order with id ${orderId}`,
    );
  return orderToEmailMessageRelation;
}

async function disconnectEmailMessage(
  orderId: number,
  emailMessageId: number,
  tx: DBType = db,
) {
  const orderToEmailMessageRelation = await tx
    .delete(orders_to_email_messages)
    .where(
      and(
        eq(orders_to_email_messages.orderId, orderId),
        eq(orders_to_email_messages.emailMessageId, emailMessageId),
      ),
    )
    .returning();
  if (!orderToEmailMessageRelation[0])
    throw new Error(
      `[OrderService]: Could not disconnect email message with id ${emailMessageId} to order with id ${orderId}`,
    );
  return orderToEmailMessageRelation[0];
}

async function disconnectManyEmailMessages(
  orderId: number,
  emailMessageIds: number[],
  tx: DBType = db,
) {
  if (emailMessageIds.length === 0)
    throw new Error(
      `[OrderService]: Could not disconnect email messages with ids ${emailMessageIds} to order with id ${orderId}`,
    );

  const orderToEmailMessageRelation = await tx
    .delete(orders_to_email_messages)
    .where(
      and(
        eq(orders_to_email_messages.orderId, orderId),
        inArray(orders_to_email_messages.emailMessageId, emailMessageIds),
      ),
    )
    .returning();
  if (orderToEmailMessageRelation.length !== emailMessageIds.length)
    throw new Error(
      `[OrderService]: Could not disconnect email messages with ids ${emailMessageIds} to order with id ${orderId}`,
    );
  return orderToEmailMessageRelation;
}

async function disconnectAllEmailMessages(orderId: number, tx: DBType = db) {
  return await tx
    .delete(orders_to_email_messages)
    .where(eq(orders_to_email_messages.orderId, orderId))
    .returning();
}

async function setEmailMessageRelations(
  orderId: number,
  emailMessageIds: number[],
  tx: DBType = db,
) {
  const emailMessageRelationsRaw = await tx
    .select()
    .from(orders_to_email_messages)
    .where(eq(orders_to_email_messages.orderId, orderId));
  const emailMessageRelationIds = emailMessageRelationsRaw.map(
    (v) => v.emailMessageId,
  );

  const toBeDisconnected = emailMessageRelationIds.filter(
    (id) => !emailMessageIds.includes(id),
  );
  await disconnectManyEmailMessages(orderId, toBeDisconnected);

  const toBeConnected = emailMessageIds.filter(
    (id) => !emailMessageRelationIds.includes(id),
  );
  await connectManyEmailMessages(orderId, toBeConnected);

  return emailMessageIds;
}

const orderService = {
  getFullById,
  getById,
  create,
  createFull,
  update,
  deleteById,
  productRelation: {
    set: setProductRelations,
    connect: connectProduct,
    connectMany: connectManyProducts,
    disconnect: disconnectProduct,
    disconnectMany: disconnectManyProducts,
    disconnectAll: disconnectAllProducts,
  },
  fileRelation: {
    set: setFileRelations,
    connect: connectFile,
    connectMany: connectManyFiles,
    disconnect: disconnectFile,
    disconnectMany: disconnectManyFiles,
    disconnectAll: disconnectAllFiles,
  },
  userRelation: {
    set: setUserRelations,
    connect: connectUser,
    connectMany: connectManyUsers,
    disconnect: disconnectUser,
    disconnectMany: disconnectManyUsers,
    disconnectAll: disconnectAllUsers,
  },
  emailMessageRelation: {
    set: setEmailMessageRelations,
    connect: connectEmailMessage,
    connectMany: connectManyEmailMessages,
    disconnect: disconnectEmailMessage,
    disconnectMany: disconnectManyEmailMessages,
    disconnectAll: disconnectAllEmailMessages,
  },
};

export default orderService;
