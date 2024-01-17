import { db } from "@/db";
import { global_properties } from "@/db/schema/global_properties";
import { eq, sql } from "drizzle-orm";
import { MetadataType } from "@/schema/MetadataType";
import {
  NewGlobalProperties,
  UpdateGlobalProperties,
} from "@/schema/globalPropertiesZodSchema";

// compile query ahead of time
const dbPrepareGetById = db.query.global_properties
  .findFirst({
    where: eq(global_properties.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetById");

async function getById(id: number) {
  return await dbPrepareGetById.execute({ id });
}

async function create(globalPropertyData: NewGlobalProperties) {
  const newGlobalProperty = await db
    .insert(global_properties)
    .values(globalPropertyData)
    .returning();
  if (newGlobalProperty[0] === undefined)
    throw new Error(
      "[GlobalPropertyService]: Could not create global property",
    );
  return newGlobalProperty[0];
}

async function deleteById(id: number) {
  return await db.delete(global_properties).where(eq(global_properties.id, id));
}

async function update(
  globalPropertyData: UpdateGlobalProperties & MetadataType,
) {
  const { id, ...dataToUpdate } = globalPropertyData;
  const updatedGlobalProperty = await db
    .update(global_properties)
    .set(dataToUpdate)
    .where(eq(global_properties.id, id))
    .returning();
  if (updatedGlobalProperty[0] === undefined)
    throw new Error(
      "[GlobalPropertyService]: Could not update global property",
    );
  return updatedGlobalProperty[0];
}

const globalPropertyServices = { getById, create, deleteById, update };

export default globalPropertyServices;
