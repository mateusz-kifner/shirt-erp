import { DBType, db } from "@/db";
import { addresses } from "@/db/schema/addresses";
import { Address, UpdatedAddress } from "@/schema/addressZodSchema";
import { eq, sql } from "drizzle-orm";

// compile query ahead of time
const addressPrepareGetById = db.query.addresses
  .findFirst({
    where: eq(addresses.id, sql.placeholder("id")),
  })
  .prepare("addressPrepareGetById");

async function getById(id: number) {
  const address = await addressPrepareGetById.execute({ id });
  if (!address) throw new Error("[AddressService]: Could not find address");
  return address;
}

async function create(addressData: Partial<Address>, tx: DBType = db) {
  const newAddress = await tx.insert(addresses).values(addressData).returning();
  if (!newAddress[0])
    throw new Error("[AddressService]: Could not create address");
  return newAddress[0];
}

async function deleteById(id: number, tx: DBType = db) {
  const deletedAddress = await tx
    .delete(addresses)
    .where(eq(addresses.id, id))
    .returning();
  if (!deletedAddress[0])
    throw new Error("[AddressService]: Could not delete address");
  return deletedAddress[0];
}

async function update(addressData: UpdatedAddress, tx: DBType = db) {
  const { id, ...dataToUpdate } = addressData;
  const updatedProduct = await tx
    .update(addresses)
    .set(dataToUpdate)
    .where(eq(addresses.id, id))
    .returning();
  if (!updatedProduct[0])
    throw new Error("[AddressService]: Could not update address");
  return updatedProduct[0];
}

const addressService = { getById, create, deleteById, update };

export default addressService;
