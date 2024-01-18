import { db } from "@/db";
import { addresses } from "@/db/schema/addresses";
import { clients } from "@/db/schema/clients";
import { ClientWithRelations, UpdatedClient } from "@/schema/clientZodSchema";
import { eq, sql } from "drizzle-orm";
import addressServices from "./address";
import { omit } from "lodash";
import { MetadataType } from "@/schema/MetadataType";

// compile query ahead of time
const dbPrepareGetByIdFull = db.query.clients
  .findFirst({
    where: eq(clients.id, sql.placeholder("id")),
    with: {
      address: true,
    },
  })
  .prepare("dbPrepareGetByIdFull");

// compile query ahead of time
const dbPrepareGetById = db.query.clients
  .findFirst({
    where: eq(clients.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetById");

async function getByIdFull(id: number) {
  return await dbPrepareGetByIdFull.execute({ id });
}

async function getById(id: number) {
  return await dbPrepareGetById.execute({ id });
}

async function create(clientData: Partial<ClientWithRelations & MetadataType>) {
  const { address, ...simpleClientData } = clientData;
  let newAddress;
  try {
    newAddress = await addressServices.create(omit(address, "id") ?? {});
  } catch (e) {
    console.log(e);
    throw new Error(
      "[ClientService]: Could not create client, address could not be created",
    );
  }
  const newClient = await db
    .insert(clients)
    .values({ ...simpleClientData, addressId: newAddress.id })
    .returning();
  if (newClient[0] === undefined)
    throw new Error("[ClientService]: Could not create client");
  return newClient[0];
}

async function deleteById(id: number) {
  const client = await getById(id);
  if (!client) {
    throw new Error(`Client with ID ${id} not found`);
  }
  if (!client.addressId) {
    throw new Error(
      `Client with ID ${id} doesn't have an associated address, this should never happen`,
    );
  }
  // delete client by cascade
  return await db.delete(addresses).where(eq(addresses.id, client.addressId));
}

async function update(clientData: UpdatedClient & MetadataType) {
  const { id, ...dataToUpdate } = clientData;
  const updatedClient = await db
    .update(clients)
    .set(dataToUpdate)
    .where(eq(clients.id, id))
    .returning();
  if (updatedClient[0] === undefined) throw new Error("Could not update");
  return updatedClient[0];
}

const clientService = { getByIdFull, getById, create, deleteById, update };

export default clientService;
