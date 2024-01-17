import { db } from "@/db";
import { spreadsheets } from "@/db/schema/spreadsheets";
import { eq, sql } from "drizzle-orm";
import { Spreadsheet, UpdatedSpreadsheet } from "@/schema/spreadsheetZodSchema";
import { MetadataType } from "@/schema/MetadataType";

// compile query ahead of time
const dbPrepareGetById = db.query.spreadsheets
  .findFirst({
    where: eq(spreadsheets.id, sql.placeholder("id")),
  })
  .prepare("dbPrepareGetById");

async function getById(id: number) {
  return await dbPrepareGetById.execute({ id });
}

async function create(spreadsheetData: Partial<Spreadsheet>) {
  const newSpreadsheet = await db
    .insert(spreadsheets)
    .values(spreadsheetData)
    .returning();
  if (newSpreadsheet[0] === undefined)
    throw new Error("[SpreadsheetService]: Could not create spreadsheet");
  return newSpreadsheet[0];
}

async function deleteById(id: number) {
  return await db.delete(spreadsheets).where(eq(spreadsheets.id, id));
}

async function update(spreadsheetData: UpdatedSpreadsheet & MetadataType) {
  const { id, ...dataToUpdate } = spreadsheetData;
  const updatedSpreadsheet = await db
    .update(spreadsheets)
    .set(dataToUpdate)
    .where(eq(spreadsheets.id, id))
    .returning();
  if (updatedSpreadsheet[0] === undefined)
    throw new Error("[SpreadsheetService]: Could not update spreadsheet");
  return updatedSpreadsheet[0];
}

const spreadsheetServices = { getById, create, deleteById, update };

export default spreadsheetServices;
