import { DBType, db } from "@/db";
import { files } from "@/db/schema/files";
import { eq, sql } from "drizzle-orm";
import { File, NewFile, UpdatedFile } from "@/schema/fileZodSchema";
import { MetadataType } from "@/schema/MetadataType";

const baseUrl = "/api/files/";

// compile query ahead of time
const filePrepareGetById = db.query.files
  .findFirst({
    where: eq(files.id, sql.placeholder("id")),
  })
  .prepare("filePrepareGetById");

async function getById(id: number): Promise<File> {
  const file = await filePrepareGetById.execute({ id });
  if (!file) throw new Error("[FileService]: Could not find file");
  return {
    ...file,
    url: `${baseUrl}${file?.filename}?token=${file?.token}`,
  };
}

// async function create(fileData: NewFile & MetadataType): Promise<File>;
async function create(fileData: NewFile & MetadataType, tx: DBType = db) {
  // const newFile = await db.insert(files).values(fileData).returning();
  // if (newFile[0] === undefined)
  //   throw new Error("[FileService]: Could not create file");
  // return newFile[0];
  throw new Error("[ NOT IMPLEMENTED ]"); // file upload is handled by dedicated route
}

async function deleteById(id: number, tx: DBType = db): Promise<File> {
  const deletedFile = await tx
    .delete(files)
    .where(eq(files.id, id))
    .returning();
  if (!deletedFile[0]) throw new Error("[FileService]: Could not delete file");
  const file = deletedFile[0];
  return {
    ...file,
    url: `${baseUrl}${file?.filename}?token=${file?.token}`,
  };
}

async function update(
  fileData: UpdatedFile & MetadataType,
  tx: DBType = db,
): Promise<File> {
  const { id, ...dataToUpdate } = fileData;
  const updatedFile = await tx
    .update(files)
    .set(dataToUpdate)
    .where(eq(files.id, id))
    .returning();
  if (!updatedFile[0]) throw new Error("[FileService]: Could not update file");
  const file = updatedFile[0];
  return {
    ...file,
    url: `${baseUrl}${file?.filename}?token=${file?.token}`,
  };
}

const fileService = { getById, create, deleteById, update };

export default fileService;
