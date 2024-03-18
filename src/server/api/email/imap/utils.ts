import fs from "node:fs";
import { Readable, type Stream } from "node:stream";
import { createHash } from "node:crypto";
import { mailDir } from "./config";

export async function writeStreamAsync(outputFilePath: string, stream: Stream) {
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

export function resolveEmailCacheFileName(
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

export function bufferToReadable(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null); // Mark the end of the stream
  return readable;
}
