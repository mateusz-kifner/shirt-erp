import { ImapFlow } from "imapflow";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { Stream } from "node:stream";

import { env } from "@/env.mjs";
import NodeClam from "clamscan";
import { omit } from "lodash";
import { ParsedMail, simpleParser } from "mailparser";
import { createHash } from "node:crypto";
import sharp from "sharp";

const mailDir = "./cache/email/";

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
    // @ts-ignore this exists but not added to TS def
    const noModseq = mailboxObj?.noModseq;
    console.log(mailboxObj);
    const messages = [];
    let query: number[] | string;

    const last_message = await client.fetchOne("*", { envelope: true });

    let start = last_message.seq - take - skip;
    let stop = last_message.seq - skip;
    if (start < 1) start = 1;
    if (stop < 1) stop = 1;

    console.log(last_message, `${start}:${stop}`);

    for await (const msg of client.fetch(
      { seq: `${start}:${stop}` },
      {
        envelope: true,
      },
    )) {
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

    if (!client.authenticated)
      throw new Error("Email server authentication failed");

    const auth: { user: string; pass?: string; accessToken?: string } =
      // @ts-ignore
      client.options.auth;

    if (auth.user.indexOf("•") !== -1)
      throw new Error("Forbidden characters in user");

    const hashString = auth.pass ?? auth.accessToken;
    if (hashString === undefined)
      throw new Error(
        "Cannot generate hash, password or accessToken not found",
      );

    const hash = createHash("md5")
      .update(hashString)
      .digest("hex")
      .substring(0, 12);

    const outputFileName = `email•${auth.user}•${uid}•${hash}.eml`;
    const outputFilePath = `${mailDir}${outputFileName}`;

    try {
      await fsp.access(outputFilePath);
      console.log(`Email with ID ${uid} found in cache`);
    } catch {
      console.log(`Email with ID ${uid} not found in cache, downloading`);
      let emailStream = await client.download(uid as string, undefined, {
        uid: true,
      });

      if (!emailStream)
        throw new Error(`Email with ID ${uid} not found on server`);

      await writeStreamAsync(outputFilePath, emailStream.content);
    }
    if (env.ENABLE_CLAMAV) {
      try {
        const clamscan = await new NodeClam().init({ removeInfected: true });
        const scanResult = await clamscan.scanDir(outputFilePath);
        if (scanResult.badFiles.length > 0) {
          await fsp.writeFile(
            outputFilePath,
            `[clamav deleted]: File Infected, viruses found:  ${scanResult.viruses}`,
          );
          return {
            avIsInfected: true,
            viruses: scanResult.viruses,
          } as {
            avIsInfected: true;
            viruses: string[];
          };
        }
      } catch (err) {
        console.log("ClamAV:", err);
      }
    }

    const emailFileStream = fs.createReadStream(outputFilePath);
    const parsed = await simpleParser(emailFileStream);

    if (!parsed) {
      throw new Error("Email not found.");
    }
    if (parsed.headerLines[0]?.key.startsWith("[clamav deleted]")) {
      return {
        avIsInfected: true,
        viruses: ["file deleted"],
      } as {
        avIsInfected: true;
        viruses: string[];
      };
    }
    const result: Omit<ParsedMail, "attachments"> & { avIsInfected?: false } = {
      ...omit(parsed, ["attachments"]),
    };
    if (env.ENABLE_CLAMAV) result["avIsInfected"] = false;

    const files = parsed.attachments.map(async (attachment, index) => {
      let preview;
      if (attachment.contentType == "image/jpeg") {
        preview = await sharp(attachment.content)
          .resize(100, 100, {
            fit: "cover",
            background: { r: 150, g: 150, b: 150 },
          })
          .jpeg()
          .toBuffer();
      }

      return {
        name: attachment.filename,
        preview: preview ? preview.toString("base64") : null,
        mimetype: attachment.contentType,
        size: attachment.size,
      };
    });
    const data = await Promise.allSettled(files);
    return {
      ...result,
      attachments: data.map((val, index) =>
        val.status === "fulfilled"
          ? val.value
          : {
              name: "[UNKNOWN]",
            },
      ) as {
        name?: string;
        preview?: string;
        mimetype?: string;
        size?: number;
      }[],
    };
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
