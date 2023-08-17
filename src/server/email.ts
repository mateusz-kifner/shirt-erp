import { ImapFlow } from "imapflow";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { Readable, Stream } from "node:stream";

import { env } from "@/env.mjs";
import { genRandomStringServerOnly } from "@/utils/genRandomString";
import { isMimeImage } from "@/utils/isMimeImage";
import NodeClam from "clamscan";
import imageSize from "image-size";
import Logger from "js-logger";
import { omit } from "lodash";
import { ParsedMail, simpleParser } from "mailparser";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { prisma } from "./db";

const mailDir = "./cache/email/";
const uploadDir = "./uploads/";

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

    // console.log(mailboxObj);
    const messages = [];
    let query: number[] | string;

    const last_message = await client.fetchOne("*", { envelope: true });

    let start = last_message.seq - take - skip;
    let stop = last_message.seq - skip;
    if (start < 1) start = 1;
    if (stop < 1) stop = 1;

    // console.log(last_message, `${start}:${stop}`);

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

    return { results: messages, totalItems: messagesCount };
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
  uid: string,
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

    const { outputFilePath } = resolveEmailCacheFileName(auth, uid);

    try {
      await fsp.access(outputFilePath);
      Logger.info(`Email with ID ${uid} found in cache`);
    } catch {
      Logger.info(`Email with ID ${uid} not found in cache, downloading`);
      let emailStream = await client.download(uid, undefined, {
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
        Logger.warn("ClamAV:", err);
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
      if (isMimeImage(attachment.contentType)) {
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

export async function downloadEmailAttachment(
  client: ImapFlow,
  uid: string,
  mailbox: string = "INBOX",
  attachment: string = "",
) {
  try {
    await client.connect();
    await client.mailboxOpen(mailbox);

    if (!client.authenticated)
      throw new Error("Email server authentication failed");

    const auth: { user: string; pass?: string; accessToken?: string } =
      // @ts-ignore
      client.options.auth;
    const { outputFilePath } = resolveEmailCacheFileName(auth, uid);

    try {
      await fsp.access(outputFilePath);
      Logger.info(`Email with ID ${uid} found in cache`);
    } catch {
      Logger.info(`Email with ID ${uid} not found in cache, downloading`);
      let emailStream = await client.download(uid, undefined, {
        uid: true,
      });

      if (!emailStream)
        throw new Error(`Email with ID ${uid} not found on server`);

      await writeStreamAsync(outputFilePath, emailStream.content);
    }

    const emailFileStream = fs.createReadStream(outputFilePath);
    const parsed = await simpleParser(emailFileStream);

    if (!parsed) {
      throw new Error("Email not found.");
    }

    if (parsed.headerLines[0]?.key.startsWith("[clamav deleted]"))
      throw new Error("Virus detected");

    const file = parsed.attachments.find((val) => val.filename === attachment);
    if (!file) throw new Error("NOT FOUND");

    if (env.ENABLE_CLAMAV) {
      const clamscan = await new NodeClam().init({});
      const scanResult = await clamscan.scanStream(
        bufferToReadable(file.content),
      );
      if (scanResult.isInfected) throw new Error("Virus detected");
    }
    return file;
  } catch (error) {
    console.error("Error fetching email attachment:", error);
    throw new Error("Failed to fetch email attachment.");
  } finally {
    await client.logout();
  }
}

export async function transferEmailToDbByUId(
  client: ImapFlow,
  uid: string,
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
    const { outputFilePath } = resolveEmailCacheFileName(auth, uid);

    try {
      await fsp.access(outputFilePath);
      Logger.info(`Email with ID ${uid} found in cache`);
    } catch {
      Logger.info(`Email with ID ${uid} not found in cache, downloading`);
      let emailStream = await client.download(uid, undefined, {
        uid: true,
      });

      if (!emailStream)
        throw new Error(`Email with ID ${uid} not found on server`);

      await writeStreamAsync(outputFilePath, emailStream.content);
    }

    const emailFileStream = fs.createReadStream(outputFilePath);
    const parsed = await simpleParser(emailFileStream);

    if (!parsed) {
      throw new Error("Email not found.");
    }

    if (parsed.headerLines[0]?.key.startsWith("[clamav deleted]"))
      throw new Error("Virus detected");

    const absolutePath = path.resolve(uploadDir);

    const newFiles = parsed.attachments.map(async (attachment) => {
      if (env.ENABLE_CLAMAV) {
        const clamscan = await new NodeClam().init({});
        const scanResult = await clamscan.scanStream(
          bufferToReadable(attachment.content),
        );
        if (scanResult.isInfected) throw new Error("Virus detected");
      }
      const scrambledFileName = genRandomStringServerOnly(25);
      const filePath = `${absolutePath}/${scrambledFileName}`;
      await fsp.writeFile(filePath, attachment.content);
      const originalFilenameExtDot = attachment.filename!.lastIndexOf(".");
      const extWithDot = attachment.filename!.substring(originalFilenameExtDot);
      const fileName = attachment.filename!.substring(
        0,
        originalFilenameExtDot,
      );
      const hash = genRandomStringServerOnly(10);
      let imgSize = null;
      try {
        imgSize = imageSize(filePath);
      } catch {}
      return {
        size: attachment.size,
        filepath: filePath,
        originalFilename: attachment.filename,
        filename: `${fileName}_${hash}${extWithDot}`,
        newFilename: scrambledFileName,
        mimetype: attachment.contentType,
        width: imgSize?.width,
        height: imgSize?.height,
        hash,
        token: genRandomStringServerOnly(32),
      };
    });
    const resolvedFiles: {
      size: number;
      filepath: string;
      originalFilename: string | undefined;
      filename: string;
      newFilename: string;
      mimetype: string;
      width: number | undefined;
      height: number | undefined;
      hash: string;
      token: string;
    }[] = (await Promise.allSettled(newFiles))
      .filter((val) => val.status === "fulfilled")
      .map((val) => (val as any).value);
    console.log(resolvedFiles);
    // await prisma.file.createMany({ data: resolvedFiles, skipDuplicates: false });
    // const filenames = resolvedFiles.map((val) => val.filename) as string[];
    // const filesFromDb = await prisma.file.findMany({
    //   where: { filename: { in: filenames } },
    // });

    const newMail = await prisma.emailMessage.create({
      data: {
        to: Array.isArray(parsed.to)
          ? parsed.to.map((v) => v.text).reduce((p, n, i) => `${p}, ${n}`, "")
          : parsed.to?.text,
        from: parsed.from?.text,
        subject: parsed.subject,
        date: parsed.date,
        html: parsed.html ? parsed.html : null,
        mailbox,
        text: parsed.text,
        textAsHtml: parsed.textAsHtml,
        messageUid: parseInt(uid),
        headerLines: parsed.headerLines.map((val) => val.line),
        clientUser: auth.user,
        messageId: parsed.messageId,
        attachments: { create: resolvedFiles },
      },
    });

    return newMail;
  } catch (error) {
    console.error("Error fetching email attachment:", error);
    throw new Error("Failed to fetch email attachment.");
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

function resolveEmailCacheFileName(
  auth: { user: string; pass?: string; accessToken?: string },
  uid: string,
) {
  if (auth.user.indexOf("•") !== -1)
    throw new Error("Forbidden characters in user");

  const hashString = auth.pass ?? auth.accessToken;
  if (hashString === undefined)
    throw new Error("Cannot generate hash, password or accessToken not found");

  const hash = createHash("md5")
    .update(hashString)
    .digest("hex")
    .substring(0, 12);

  const outputFileName = `email•${auth.user}•${uid}•${hash}.eml`;
  const outputFilePath = `${mailDir}${outputFileName}`;
  return { outputFileName, outputFilePath };
}

function bufferToReadable(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null); // Mark the end of the stream
  return readable;
}
