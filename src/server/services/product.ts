import { db } from "@/db";
import { products } from "@/db/schema/products";
import { eq, sql } from "drizzle-orm";
import { Product, UpdatedProduct } from "@/schema/productZodSchema";
import { MetadataType } from "@/schema/MetadataType";

// compile query ahead of time
const dbPrepareGetById = db.query.products
  .findFirst({
    where: eq(products.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetById");

async function getById(id: number) {
  return await dbPrepareGetById.execute({ id });
}

async function create(productData: Partial<Product>) {
  const newProduct = await db.insert(products).values(productData).returning();
  if (newProduct[0] === undefined)
    throw new Error("[ProductService]: Could not create product");
  return newProduct[0];
}

async function deleteById(id: number) {
  return await db.delete(products).where(eq(products.id, id));
}

async function update(productData: UpdatedProduct & MetadataType) {
  const { id, ...dataToUpdate } = productData;
  const updatedProduct = await db
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
