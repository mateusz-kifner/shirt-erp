import { ImapFlow } from "imapflow";

export async function fetchEmailById(client: ImapFlow, id: string) {
  try {
    await client.connect();
    await client.mailboxOpen("INDEX");

    const message = await client.fetchOne(id, {
      bodyStructure: true,
      envelope: true,
    });

    if (!message) {
      throw new Error("Email not found.");
    }

    return message;
  } catch (error) {
    console.error("Error fetching email:", error);
    throw new Error("Failed to fetch email.");
  } finally {
    await client.logout();
  }
}

export async function fetchEmails(
  client: ImapFlow,
  take: number,
  skip: number
) {
  try {
    await client.connect();
    await client.mailboxOpen("INDEX");

    const messages = await client.fetch(`${skip}:${skip + take}`, {
      uid: true,
    });

    if (!messages) {
      throw new Error("Email not found.");
    }

    return messages;
  } catch (error) {
    console.error("Error fetching email:", error);
    throw new Error("Failed to fetch email.");
  } finally {
    await client.logout();
  }
}
