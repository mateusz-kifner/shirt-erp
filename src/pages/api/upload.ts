import { sessionOptions } from "@/lib/session";
import { prisma } from "@/server/db";
import HTTPError from "@/utils/HTTPError";
import { genRandomStringServerOnly } from "@/utils/genRandomString";
import { type Prisma } from "@prisma/client";
import formidable from "formidable";
import type IncomingForm from "formidable/Formidable";
import type { IncomingMessage, ServerResponse } from "http";
import imageSize from "image-size";
import { getIronSession, type IronSession } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Upload using multiform data, requires using name file
 */

// TODO: make size calculation async

let form: IncomingForm;

// disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function Upload(
  req: IncomingMessage & NextApiRequest,
  res: ServerResponse & NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      throw new HTTPError(405, `Method ${req.method as string} not allowed`);
    }
    const session: IronSession = await getIronSession(req, res, sessionOptions);
    if (!session.isLoggedIn) throw new HTTPError(401, `Unauthenticated`);

    form = new formidable.IncomingForm({
      multiples: true,
      uploadDir: "./uploads/",
      maxFileSize: 10 * 1024 * 1024 * 1024, // 10Gb
      maxFieldsSize: 10 * 1024 * 1024 * 1024, // 10Gb
      maxFiles: 1024,
      // hashAlgorithm: "sha1",
    });

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

    const newFiles: Prisma.FileCreateInput[] = fileArray.map((file) => {
      const originalFilenameExtDot = file.originalFilename!.lastIndexOf(".");
      const extWithDot = file.originalFilename!.substring(
        originalFilenameExtDot
      );
      const fileName = file.originalFilename!.substring(
        0,
        originalFilenameExtDot
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

    await prisma.file.createMany({ data: newFiles, skipDuplicates: false });

    const filenames = newFiles.map((val) => val.filename) as string[];

    const filesFromDb = await prisma.file.findMany({
      where: { filename: { in: filenames } },
    });

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
