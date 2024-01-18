import { db } from "@/db";
import { addresses } from "@/db/schema/addresses";
import { Address, UpdatedAddress } from "@/schema/addressZodSchema";
import { eq, sql } from "drizzle-orm";

// compile query ahead of time
const dbPrepareGetByIdFull = db.query.addresses
  .findFirst({
    where: eq(addresses.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetByIdFull");

async function getById(id: number) {
  return await dbPrepareGetByIdFull.execute({ id });
}

async function create(addressData: Partial<Address>) {
  const newAddress = await db.insert(addresses).values(addressData).returning();
  if (newAddress[0] === undefined)
    throw new Error("[AddressService]: Could not create address");
  return newAddress[0];
}

async function deleteById(id: number) {
  return await db.delete(addresses).where(eq(addresses.id, id));
}

async function update(addressData: UpdatedAddress) {
  const { id, ...dataToUpdate } = addressData;
  const updatedProduct = await db
    .update(addresses)
    .set(dataToUpdate)
    .where(eq(addresses.id, id))
    .returning();
  if (updatedProduct[0] === undefined)
    throw new Error("[AddressService]: Could not update address");
  return updatedProduct[0];
}

const addressService = { getById, create, deleteById, update };

export default addressService;
