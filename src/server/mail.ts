import { ImapFlow } from "imapflow";

export async function fetchEmailById(client: ImapFlow, id?: string) {
  try {
    await client.connect();
    await client.mailboxOpen("INBOX");

    const message = await client.fetchOne(id ?? "*", {
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
    await client.mailboxOpen("INBOX");
    const messages = [];
    for await (const msg of client.fetch(`${skip}:${skip + take}`, {
      uid: true,
    })) {
      console.log(msg.uid);
      messages.push(msg);
    }

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

export async function fetchFolders(client: ImapFlow) {
  try {
    await client.connect();

    const folders = await client.list();

    if (!folders) {
      throw new Error("Folders not found.");
    }

    return folders;
  } catch (error) {
    console.error("Error fetching Folders:", error);
    throw new Error("Failed to fetch Folders.");
  } finally {
    await client.logout();
  }
}

// export async function fetchEmails2(client: ImapFlow, id?: string) {
//   try {
//     await client.connect();
//     await client.mailboxOpen("INBOX");

//     const message = await client.fetch({seq:{from:-10}}, {
//       envelope: true,
//     });

//     if (!message) {
//       throw new Error("Email not found.");
//     }

//     return message;
//   } catch (error) {
//     console.error("Error fetching email:", error);
//     throw new Error("Failed to fetch email.");
//   } finally {
//     await client.logout();
//   }
// }
