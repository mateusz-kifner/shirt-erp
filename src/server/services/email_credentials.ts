import { DBType, db } from "@/db";
import { email_credentials } from "@/db/schema/email_credentials";
import { eq, sql } from "drizzle-orm";
import {
  EmailCredential,
  UpdatedEmailCredential,
} from "@/schema/emailCredentialZodSchema";
import { MetadataType } from "@/schema/MetadataType";

// compile query ahead of time
const emailCredentialPrepareGetById = db.query.email_credentials
  .findFirst({
    where: eq(email_credentials.id, sql.placeholder("id")),
  })
  .prepare("emailCredentialPrepareGetById");

async function getById(id: number) {
  return await emailCredentialPrepareGetById.execute({ id });
}

async function create(
  emailCredentialData: Partial<EmailCredential>,
  tx: DBType = db,
) {
  const newEmailCredential = await tx
    .insert(email_credentials)
    .values(emailCredentialData)
    .returning();
  if (!newEmailCredential[0])
    throw new Error(
      "[EmailCredentialService]: Could not create email credentials",
    );
  return newEmailCredential[0];
}

async function deleteById(id: number, tx: DBType = db) {
  const deletedEmailCredential = await tx
    .delete(email_credentials)
    .where(eq(email_credentials.id, id))
    .returning();
  if (!deletedEmailCredential[0])
    throw new Error(
      "[EmailCredentialService]: Could not delete email credentials",
    );
  return deletedEmailCredential[0];
}

async function update(
  emailCredentialData: UpdatedEmailCredential & MetadataType,
  tx: DBType = db,
) {
  const { id, ...dataToUpdate } = emailCredentialData;
  const updatedEmailCredential = await tx
    .update(email_credentials)
    .set(dataToUpdate)
    .where(eq(email_credentials.id, id))
    .returning();
  if (!updatedEmailCredential[0])
    throw new Error(
      "[EmailCredentialService]: Could not update email credentials",
    );
  return updatedEmailCredential[0];
}

const emailCredentialService = { getById, create, deleteById, update };

export default emailCredentialService;
