import { DBType, db } from "@/db";
import { addresses } from "@/db/schema/addresses";
import { clients } from "@/db/schema/clients";
import {
  Client,
  ClientWithRelations,
  UpdatedClient,
} from "@/schema/clientZodSchema";
import { eq, sql } from "drizzle-orm";
import addressServices from "./address";
import { omit } from "lodash";
import { MetadataType } from "@/schema/MetadataType";

// compile query ahead of time
const clientPrepareGetFullById = db.query.clients
  .findFirst({
    where: eq(clients.id, sql.placeholder("id")),
    with: {
      address: true,
    },
  })
  .prepare("clientPrepareGetFullById");

async function getFullById(id: number) {
  const client = await clientPrepareGetFullById.execute({ id });
  if (!client)
    throw new Error(`[ClientService]: Could not find client with id ${id}`);
  return client;
}

// compile query ahead of time
const clientPrepareGetById = db.query.clients
  .findFirst({
    where: eq(clients.id, sql.placeholder("id")),
  })
  .prepare("clientPrepareGetById");

async function getById(id: number): Promise<Client> {
  const client = await clientPrepareGetById.execute({ id });
  if (!client)
    throw new Error(`[ClientService]: Could not find client with id ${id}`);
  return client;
}

async function create(
  clientData: Partial<ClientWithRelations & MetadataType>,
  tx: DBType = db,
): Promise<Client> {
  const { address, ...simpleClientData } = clientData;
  let newAddress;
  try {
    newAddress = await addressServices.create(omit(address, "id") ?? {}, tx);
  } catch (e) {
    console.log(e);
    throw new Error(
      `[ClientService]: Could not create client with username ${clientData?.username}, address could not be created`,
    );
  }
  const newClient = await tx
    .insert(clients)
    .values({ ...simpleClientData, addressId: newAddress.id })
    .returning();
  if (!newClient[0])
    throw new Error(
      `[ClientService]: Could not create client with username ${clientData?.username}`,
    );
  return newClient[0];
}

async function deleteById(id: number, tx: DBType = db): Promise<Client> {
  const client = await getById(id);
  if (!client) {
    throw new Error(`[ClientService]: Client with id ${id} not found`);
  }
  if (!client.addressId) {
    throw new Error(
      `[ClientService]: Client with id ${id} doesn't have an associated address, this should never happen`,
    );
  }
  // delete client by cascade
  const deletedAddress = await tx
    .delete(addresses)
    .where(eq(addresses.id, client.addressId))
    .returning();
  if (!deletedAddress[0])
    throw new Error(
      `[ClientService]: Could not delete client with id ${id}, associated address could not be deleted`,
    );
  return client;
}

async function update(
  clientData: UpdatedClient & MetadataType,
  tx: DBType = db,
): Promise<Client> {
  const { id, ...dataToUpdate } = clientData;
  const updatedClient = await tx
    .update(clients)
    .set(dataToUpdate)
    .where(eq(clients.id, id))
    .returning();
  if (!updatedClient[0])
    throw new Error(`[ClientService]: Could not update client with id ${id}`);
  return updatedClient[0];
}

const clientService = { getFullById, getById, create, deleteById, update };

export default clientService;
