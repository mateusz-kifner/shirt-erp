import { type ImapFlow } from "imapflow";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { env } from "@/env.mjs";
import { genRandomStringServerOnly } from "@/utils/genRandomString";
import NodeClam from "clamscan";
import imageSize from "image-size";
import Logger from "js-logger";
import { simpleParser } from "mailparser";
import path from "node:path";
import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { files as filesSchema } from "@/server/api/file/schema";
import {
  email_messages,
  email_messages_to_files,
} from "../../email-message/schema";
import {
  bufferToReadable,
  resolveEmailCacheFileName,
  writeStreamAsync,
} from "./utils";
import { uploadDir } from "./config";

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

    const auth = (
      client as unknown as {
        options: {
          auth: {
            user: string;
            pass?: string;
            accessToken?: string;
          };
        };
      }
    ).options.auth;

    if (!auth.user) {
      throw new Error("User was not attached to imapFlow Client");
    }
    const alreadyTransferred = await db.query.email_messages.findFirst({
      where: and(
        eq(email_messages.messageUid, parseInt(uid)),
        eq(email_messages.clientUser, auth.user),
        eq(email_messages.mailbox, mailbox),
      ),
      with: { attachments: { with: { files: true } }, messageFile: true },
    });

    if (alreadyTransferred !== undefined) {
      return {
        ...alreadyTransferred,
        attachments: alreadyTransferred.attachments.map((v) => v.files),
      };
    }

    const { outputFilePath } = resolveEmailCacheFileName(auth, uid);

    try {
      await fsp.access(outputFilePath);
      Logger.info(`Email with ID ${uid} found in cache`);
    } catch {
      Logger.info(`Email with ID ${uid} not found in cache, downloading`);
      const emailStream = await client.download(uid, undefined, {
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

    type ResolvedFile = {
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
    };
    const resolvedFiles: ResolvedFile[] = (await Promise.allSettled(newFiles))
      .filter(
        (val): val is PromiseFulfilledResult<ResolvedFile> =>
          val.status === "fulfilled",
      )
      .map((val) => val.value);

    const newMail = (
      await db
        .insert(email_messages)
        .values({
          to: Array.isArray(parsed.to)
            ? parsed.to.map((v) => v.text).reduce((p, n) => `${p}, ${n}`, "")
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
          // attachments: { create: resolvedFiles },
        })
        .returning()
    )[0];
    if (newMail === undefined) throw new Error("email failed to be created");
    const attachments = await db
      .insert(filesSchema)
      .values(resolvedFiles)
      .returning();
    console.log(attachments);
    const attachmentsRelation = await db
      .insert(email_messages_to_files)
      .values(
        attachments.map((val) => ({
          emailMessageId: newMail.id,
          fileId: val.id,
        })),
      )
      .returning();
    console.log(attachmentsRelation);

    return { ...newMail, attachments };
  } catch (error) {
    console.error("Error fetching email attachment:", error);
    throw new Error("Failed to fetch email attachment.");
  } finally {
    await client.logout();
  }
}
