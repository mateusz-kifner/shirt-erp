import { db } from "@/db";
import { files } from "@/db/schema/files";
import { eq, sql } from "drizzle-orm";
import { NewFile, UpdatedFile } from "@/schema/fileZodSchema";
import { MetadataType } from "@/schema/MetadataType";

const baseUrl = "/api/files/";

// compile query ahead of time
const dbPrepareGetById = db.query.files
  .findFirst({
    where: eq(files.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetById");

async function getById(id: number) {
  const data = await dbPrepareGetById.execute({ id });
  if (!data) return null;
  return {
    ...data,
    url: `${baseUrl}${data?.filename}?token=${data?.token}`,
  };
}

async function create(fileData: NewFile & MetadataType) {
  // const newFile = await db.insert(files).values(fileData).returning();
  // if (newFile[0] === undefined)
  //   throw new Error("[FileService]: Could not create file");
  // return newFile[0];
  throw new Error("[ NOT IMPLEMENTED ]"); // file upload is handled by dedicated route
}

async function deleteById(id: number) {
  return await db.delete(files).where(eq(files.id, id));
}

async function update(fileData: UpdatedFile & MetadataType) {
  const { id, ...dataToUpdate } = fileData;
  const updatedFile = await db
    .update(files)
    .set(dataToUpdate)
    .where(eq(files.id, id))
    .returning();
  if (updatedFile[0] === undefined)
    throw new Error("[FileService]: Could not update file");
  return updatedFile[0];
}

const fileServices = { getById, create, deleteById, update };

export default fileServices;
