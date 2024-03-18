import { db } from "@/server/db";
import HTTPError from "@/utils/HTTPError";
import { genRandomStringServerOnly } from "@/utils/genRandomString";
import formidable from "formidable";
import type { IncomingMessage, ServerResponse } from "http";
import imageSize from "image-size";
import type { NextApiRequest, NextApiResponse } from "next";
import { files as filesSchema } from "@/server/api/file/schema";
import { getServerAuthSession } from "@/server/auth";

/**
 * Upload using multiform data, requires using name file
 */

// TODO: make size calculation async
// TODO: move to nextjs 13 app router upload

// disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function Upload(
  req: IncomingMessage & NextApiRequest,
  res: ServerResponse & NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      throw new HTTPError(405, `Method ${req.method as string} not allowed`);
    }
    const session = await getServerAuthSession({ req, res });
    console.log(session);

    if (!session?.user) throw new HTTPError(401, `Unauthenticated`);

    const form = new formidable.IncomingForm({
      multiples: true,
      uploadDir: "./uploads/",
      maxFileSize: 2 * 1024 * 1024 * 1024, // 10Gb
      maxFieldsSize: 2 * 1024 * 1024 * 1024, // 10Gb
      maxFiles: 1024,
      // hashAlgorithm: "sha1",
    });
    console.log(form);

    const { files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.File | formidable.File[];
    }>((resolve, reject) => {
      form.parse(req, (err: Error, fields, files) => {
        if (err) {
          reject(new HTTPError(500, err?.message));
          return;
        }
        const { files: unpackedFiles } = files;
        if (unpackedFiles == undefined) {
          reject(new HTTPError(500, "Failed to upload file"));
          return;
        }

        resolve({ fields, files: unpackedFiles });
      });
    });

    const fileArray = Array.isArray(files) ? files : [files];

    const newFiles = fileArray.map((file) => {
      const originalFilenameExtDot = file.originalFilename!.lastIndexOf(".");
      const extWithDot = file.originalFilename!.substring(
        originalFilenameExtDot,
      );
      const fileName = file.originalFilename!.substring(
        0,
        originalFilenameExtDot,
      );
      const hash = genRandomStringServerOnly(10);
      let imgSize = null;
      try {
        imgSize = imageSize(file.filepath);
      } catch {}
      return {
        size: file.size,
        filepath: file.filepath,
        originalFilename: file.originalFilename,
        filename: `${fileName}_${hash}${extWithDot}`,
        newFilename: file.newFilename,
        mimetype: file.mimetype,
        width: imgSize?.width,
        height: imgSize?.height,
        hash,
        token: genRandomStringServerOnly(32),
      };
    });

    const filesFromDb = await db
      .insert(filesSchema)
      .values(newFiles)
      .returning();

    // const filenames = newFiles.map((val) => val.filename) as string[];

    // const filesFromDb = await prisma.file.findMany({
    //   where: { filename: { in: filenames } },
    // });

    // const { originalFilename, filepath: tempFilePath } = file;
    // const ext = (originalFilename ?? "unknown.unknown").split(".").pop();
    // const id = originalFilename;
    // const filePath = `./uploads/${id}.${ext}`;
    // fs.renameSync(tempFilePath, filePath);

    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Success: File uploaded successfully",
      data: filesFromDb,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof HTTPError) {
      res.status(err.statusCode).json({
        status: "error",
        statusCode: err.statusCode,
        message: err.name + ": " + err.message,
      });
      return;
    } else {
      res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "UnknownError",
      });
      return;
    }
  }
}

// function setMetadata(file:formidable.File[]){

// }
