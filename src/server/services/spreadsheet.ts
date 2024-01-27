import { DBType, db } from "@/db";
import { spreadsheets } from "@/db/schema/spreadsheets";
import { eq, inArray, sql } from "drizzle-orm";
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
    throw new Error(
      `[SpreadsheetService]: Could not find spreadsheet with id ${id}`,
    );
  return spreadsheet;
}

async function create(spreadsheetData: Partial<Spreadsheet>, tx: DBType = db) {
  const newSpreadsheet = await tx
    .insert(spreadsheets)
    .values(spreadsheetData)
    .returning();
  if (newSpreadsheet[0] === undefined)
    throw new Error(
      `[SpreadsheetService]: Could not create spreadsheet with name ${spreadsheetData?.name}`,
    );
  return newSpreadsheet[0];
}

async function createMany(
  spreadsheetData: Partial<Spreadsheet>[],
  tx: DBType = db,
) {
  const newSpreadsheet = await tx
    .insert(spreadsheets)
    .values(spreadsheetData)
    .returning();
  if (newSpreadsheet.length !== spreadsheetData.length)
    throw new Error(
      `[SpreadsheetService]: Could not create spreadsheets, created ${newSpreadsheet?.length} expected ${spreadsheetData?.length}`,
    );
  return newSpreadsheet;
}

async function deleteById(id: number, tx: DBType = db): Promise<Spreadsheet> {
  const deletedSpreadSheet = await tx
    .delete(spreadsheets)
    .where(eq(spreadsheets.id, id))
    .returning();
  if (!deletedSpreadSheet[0])
    throw new Error(
      `[SpreadsheetService]: Could not delete spreadsheet with id ${id}`,
    );
  return deletedSpreadSheet[0];
}

async function deleteManyById(
  ids: number[],
  tx: DBType = db,
): Promise<Spreadsheet[]> {
  const deletedSpreadSheet = await tx
    .delete(spreadsheets)
    .where(inArray(spreadsheets.id, ids))
    .returning();
  if (deletedSpreadSheet.length !== ids.length)
    throw new Error(
      `[SpreadsheetService]: Could not delete spreadsheets with ids ${ids}`,
    );
  return deletedSpreadSheet;
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
    throw new Error(
      `[SpreadsheetService]: Could not update spreadsheet with id ${id}`,
    );
  return updatedSpreadsheet[0];
}

const spreadsheetService = {
  getById,
  create,
  createMany,
  deleteById,
  deleteManyById,
  update,
};

export default spreadsheetService;
