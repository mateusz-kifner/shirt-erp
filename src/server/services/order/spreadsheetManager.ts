import { DBType, db } from "@/db";
import { spreadsheets } from "@/db/schema/spreadsheets";
import { eq } from "drizzle-orm";
import spreadsheetService from "../spreadsheets";

async function deleteAllRelated(orderId: number, tx: DBType = db) {
  return await tx
    .delete(spreadsheets)
    .where(eq(spreadsheets.orderId, orderId))
    .returning();
}

async function addOrDelete(
  orderId: number,
  spreadsheetIds: (number | null)[],
  userId?: string,
  tx: DBType = db,
): Promise<number[]> {
  const spreadsheetRelationsRaw = await tx
    .select()
    .from(spreadsheets)
    .where(eq(spreadsheets.orderId, orderId));
  const spreadsheetRelationIds = spreadsheetRelationsRaw.map((v) => v.orderId);
  const finalIds: number[] = spreadsheetIds.filter(
    (v): v is number => v !== null,
  );

  const toBeDeleted = spreadsheetRelationIds.filter(
    (id): id is number => id !== null && !spreadsheetIds.includes(id),
  );
  if (toBeDeleted.length > 0) {
    await spreadsheetService.deleteManyById(toBeDeleted, tx);
  }
  const toBeCreated = spreadsheetIds.filter((id) => id === null);
  if (toBeCreated.length > 0) {
    const created = await spreadsheetService.createMany(
      toBeCreated.map(() => ({
        orderId,
        createdById: userId,
        updatedById: userId,
      })),
      tx,
    );
    finalIds.push(...created.map((v) => v.id));
  }

  return finalIds;
}

export default {
  addOrDelete,
  deleteAllRelated,
};
