import { DBType, db } from "@/db";
import { email_messages } from "@/db/schema/email_messages";
import { eq, sql } from "drizzle-orm";
import {
  EmailMessage,
  UpdatedEmailMessage,
} from "@/schema/emailMessageZodSchema";
import { MetadataType } from "@/schema/MetadataType";
import { orders_to_email_messages } from "@/db/schema/orders_to_email_messages";
import { email_messages_to_files } from "@/db/schema/email_messages_to_files";

// compile query ahead of time
const emailMessagePrepareGetById = db.query.email_messages
  .findFirst({
    where: eq(email_messages.id, sql.placeholder("id")),
  })
  .prepare("emailMessagePrepareGetById");

async function getById(id: number): Promise<EmailMessage> {
  const emailMessage = await emailMessagePrepareGetById.execute({ id });
  if (!emailMessage)
    throw new Error(
      `[EmailMessageService]: Could not find email message with id ${id}`,
    );
  return emailMessage;
}

async function create(
  emailMessageData: Partial<EmailMessage>,
  tx: DBType = db,
): Promise<EmailMessage> {
  const newEmailMessage = await tx
    .insert(email_messages)
    .values(emailMessageData)
    .returning();
  if (!newEmailMessage[0])
    throw new Error(
      `[EmailMessageService]: Could not create email message with subject ${emailMessageData?.subject}`,
    );
  return newEmailMessage[0];
}

async function deleteById(id: number, tx: DBType = db): Promise<EmailMessage> {
  await tx
    .delete(orders_to_email_messages)
    .where(eq(orders_to_email_messages.emailMessageId, id));
  await tx
    .delete(email_messages_to_files)
    .where(eq(email_messages_to_files.emailMessageId, id));
  const deletedEmailMessage = await tx
    .delete(email_messages)
    .where(eq(email_messages.id, id))
    .returning();
  if (!deletedEmailMessage[0])
    throw new Error(
      `[EmailMessageService]: Could not delete email message with id ${id}`,
    );
  return deletedEmailMessage[0];
}

async function update(
  emailMessageData: UpdatedEmailMessage & MetadataType,
  tx: DBType = db,
): Promise<EmailMessage> {
  const { id, ...dataToUpdate } = emailMessageData;
  const updatedEmailMessage = await tx
    .update(email_messages)
    .set(dataToUpdate)
    .where(eq(email_messages.id, id))
    .returning();
  if (!updatedEmailMessage[0])
    throw new Error(
      `[EmailMessageService]: Could not update email message with id ${id}`,
    );
  return updatedEmailMessage[0];
}

const emailMessageService = { getById, create, deleteById, update };

export default emailMessageService;