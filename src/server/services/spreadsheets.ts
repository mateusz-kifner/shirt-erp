import { DBType, db } from "@/db";
import { spreadsheets } from "@/db/schema/spreadsheets";
import { eq, sql } from "drizzle-orm";
import { Spreadsheet, UpdatedSpreadsheet } from "@/schema/spreadsheetZodSchema";
import { MetadataType } from "@/schema/MetadataType";

// compile query ahead of time
const spreadsheetPrepareGetById = db.query.spreadsheets
  .findFirst({
    where: eq(spreadsheets.id, sql.placeholder("id")),
  })
  .prepare("spreadsheetPrepareGetById");

async function getById(id: number): Promise<Spreadsheet> {
  const spreadsheet = await spreadsheetPrepareGetById.execute({ id });
  if (!spreadsheet)
    throw new Error("[SpreadsheetService]: Could not find spreadsheet");
  return spreadsheet;
}

async function create(spreadsheetData: Partial<Spreadsheet>, tx: DBType = db) {
  const newSpreadsheet = await tx
    .insert(spreadsheets)
    .values(spreadsheetData)
    .returning();
  if (newSpreadsheet[0] === undefined)
    throw new Error("[SpreadsheetService]: Could not create spreadsheet");
  return newSpreadsheet[0];
}

async function deleteById(id: number, tx: DBType = db): Promise<Spreadsheet> {
  const deletedSpreadSheet = await tx
    .delete(spreadsheets)
    .where(eq(spreadsheets.id, id))
    .returning();
  if (!deletedSpreadSheet[0])
    throw new Error("[SpreadsheetService]: Could not delete spreadsheet");
  return deletedSpreadSheet[0];
}

async function update(
  spreadsheetData: UpdatedSpreadsheet & MetadataType,
  tx: DBType = db,
): Promise<Spreadsheet> {
  const { id, ...dataToUpdate } = spreadsheetData;
  const updatedSpreadsheet = await tx
    .update(spreadsheets)
    .set(dataToUpdate)
    .where(eq(spreadsheets.id, id))
    .returning();
  if (updatedSpreadsheet[0] === undefined)
    throw new Error("[SpreadsheetService]: Could not update spreadsheet");
  return updatedSpreadsheet[0];
}

const spreadsheetService = { getById, create, deleteById, update };

export default spreadsheetService;
