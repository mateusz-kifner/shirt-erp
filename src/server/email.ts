import { ImapFlow } from "imapflow";

export async function fetchEmailById(
  client: ImapFlow,
  uid?: string,
  mailbox: string = "INBOX",
) {
  try {
    await client.connect();
    await client.mailboxOpen(mailbox);

    const message = await client.fetchOne(uid as string, {
      envelope: true,
      uid: true,
    });
    console.log(message);

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
  mailbox: string = "INBOX",
  take: number = 10,
  skip: number = 0,
) {
  try {
    await client.connect();
    const mailboxObj = await client.mailboxOpen(mailbox);
    console.log(mailboxObj);
    const messagesCount = mailboxObj.exists;
    // @ts-ignore this exists but not added to TS
    const noModseq = mailboxObj?.noModseq;
    const messages = [];
    let query: number[] | string;

    // use generic seq for fetching messages
    if (noModseq === true) {
      query = Array.from({ length: take }, (_, i) => skip + i);
    } else {
      const newTake = messagesCount < take ? messagesCount : take;
      const newSkip = skip + 1;
      query = take > 1 ? `${newSkip}:${newSkip + newTake}` : `${newSkip}`;
    }
    for await (const msg of client.fetch(query, {
      uid: true,
      envelope: true,
    })) {
      // console.log(msg.uid);
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

export async function fetchFolderTree(client: ImapFlow) {
  try {
    await client.connect();

    const folderTree = await client.listTree();

    if (!folderTree) {
      throw new Error("FolderTree not found.");
    }

    return folderTree;
  } catch (error) {
    console.error("Error fetching FolderTree:", error);
    throw new Error("Failed to fetch FolderTree.");
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
