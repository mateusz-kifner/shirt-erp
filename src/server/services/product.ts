import { DBType, db } from "@/db";
import { products } from "@/db/schema/products";
import { eq, sql } from "drizzle-orm";
import { Product, UpdatedProduct } from "@/schema/productZodSchema";
import { MetadataType } from "@/schema/MetadataType";
import { orders_to_products } from "@/db/schema/orders_to_products";

// compile query ahead of time
const productPrepareGetById = db.query.products
  .findFirst({
    where: eq(products.id, sql.placeholder("id")),
  })
  .prepare("productPrepareGetById");

async function getById(id: number): Promise<Product> {
  const product = await productPrepareGetById.execute({ id });
  if (product === undefined)
    throw new Error("[ProductService]: Could not find product");
  return product;
}

async function create(
  productData: Partial<Product>,
  tx: DBType = db,
): Promise<Product> {
  const newProduct = await tx.insert(products).values(productData).returning();
  if (newProduct[0] === undefined)
    throw new Error("[ProductService]: Could not create product");
  return newProduct[0];
}

async function deleteById(id: number, tx: DBType = db): Promise<Product> {
  await tx
    .delete(orders_to_products)
    .where(eq(orders_to_products.productId, id));
  const deletedProduct = await tx
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  if (deletedProduct[0] === undefined)
    throw new Error("[ProductService]: Could not delete product");
  return deletedProduct[0];
}

async function update(
  productData: UpdatedProduct & MetadataType,
  tx: DBType = db,
): Promise<Product> {
  const { id, ...dataToUpdate } = productData;
  const updatedProduct = await tx
    .update(products)
    .set(dataToUpdate)
    .where(eq(products.id, id))
    .returning();
  if (updatedProduct[0] === undefined)
    throw new Error("[ProductService]: Could not update product");
  return updatedProduct[0];
}

const productService = { getById, create, deleteById, update };

export default productService;
