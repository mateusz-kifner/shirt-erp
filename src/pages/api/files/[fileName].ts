import { prisma } from "@/server/db";
import HTTPError from "@/utils/HTTPError";
import { createReadStream } from "fs";
import fs from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function Files(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      throw new HTTPError(405, `Method ${req.method as string} not allowed`);
    }

    if (req.query.fileName === undefined || Array.isArray(req.query.fileName)) {
      throw new HTTPError(422, `FileName cannot be processed`);
    }
    if (Array.isArray(req.query.token)) {
      throw new HTTPError(422, `Token cannot be processed`);
    }

    const { fileName, token } = req.query;
    const download = req.query.download === "";

    const file = await prisma.file.findFirst({ where: { filename: fileName } });
    if (!file) {
      throw new HTTPError(404, `File not found`);
    }
    // Check if correct token was provided, public resources have empty token
    if (!!file.token && (file.token ?? "") !== (token ?? "")) {
      throw new HTTPError(404, `File not found`);
    }
    if (download) {
      // Download headers
      console.log(file?.originalFilename);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(
          file?.originalFilename ?? ""
        )}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = createReadStream(
        `./uploads/${file?.newFilename as string}`
      );

      fileStream.pipe(res);
    } else {
      // View headers
      res.setHeader(
        "Content-Type",
        file.mimetype ?? "application/octet-stream"
      );

      const imageData = await fs.readFile(
        `./uploads/${file?.newFilename as string}`
      );

      res.send(imageData);
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      res.status(err.statusCode).json({
        status: "error",
        statusCode: err.statusCode,
        message: err.name + ": " + err.message,
      });
      return;
    } else {
      console.log(err);
      res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "UnknownError",
      });
      return;
    }
  }
}
