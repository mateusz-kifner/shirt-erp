import fs from "fs";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { Stream } from "stream";

export async function fetchEmailByUid(
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
      // bodyStructure: true,
    });
    // console.log(message);

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

// cache emails

export async function downloadEmailByUid(
  client: ImapFlow,
  uid?: string,
  mailbox: string = "INBOX",
) {
  try {
    await client.connect();
    await client.mailboxOpen(mailbox);

    let emailStream = await client.download(uid as string, undefined, {
      uid: true,
    });
    console.log(client.id);
    if (!client.authenticated)
      throw new Error("Email server authentication failed");
    // @ts-ignore  client.options is not in type
    const outputFilePath = `./email_cache/email-${client.options.auth.user}-${uid}.eml`;

    if (emailStream) {
      await writeStreamAsync(outputFilePath, emailStream.content);

      const parsed = await simpleParser(fs.createReadStream(outputFilePath));
      console.log(parsed);
    } else {
      console.log(`Email with ID ${uid} not found.`);
    }
    return {};
    // if (!parsed) {
    //   throw new Error("Email not found.");
    // }

    // return parsed;
  } catch (error) {
    console.error("Error fetching email:", error);
    throw new Error("Failed to fetch email.");
  } finally {
    await client.logout();
  }
}

async function writeStreamAsync(outputFilePath: string, stream: Stream) {
  return new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputFilePath);

    stream.pipe(writeStream);

    stream.on("end", () => {
      writeStream.end();
    });

    writeStream.on("finish", () => {
      resolve();
    });

    writeStream.on("error", (writeError) => {
      console.error("Error saving stream:", writeError);
      reject(writeError);
    });
  });
}
