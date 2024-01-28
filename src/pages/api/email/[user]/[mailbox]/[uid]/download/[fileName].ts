import { db } from "@/db";
import { getServerAuthSession } from "@/server/auth";
import IMAPService from "@/server/services/imap";
import HTTPError from "@/utils/HTTPError";
import { ImapFlow } from "imapflow";
import Logger from "js-logger";
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";

export default async function Files(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      throw new HTTPError(405, `Method ${req.method as string} not allowed`);
    }
    const session = await getServerAuthSession({ req, res });

    // const session: IronSession = await getIronSession(req, res, sessionOptions);

    if (!session?.user) throw new HTTPError(401, `Unauthenticated`);
    console.log(req.query);

    if (req.query.fileName === undefined || Array.isArray(req.query.fileName)) {
      throw new HTTPError(422, `FileName cannot be processed`);
    }
    if (req.query.user === undefined || Array.isArray(req.query.user)) {
      throw new HTTPError(422, `User cannot be processed`);
    }

    if (req.query.mailbox === undefined || Array.isArray(req.query.mailbox)) {
      throw new HTTPError(422, `Mailbox cannot be processed`);
    }
    if (req.query.uid === undefined || Array.isArray(req.query.uid)) {
      throw new HTTPError(422, `Uid cannot be processed`);
    }

    const { fileName, user, mailbox, uid } = req.query;

    const currentUserId = session.user.id;
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, currentUserId),
      with: { emailCredentials: { with: { emailCredentials: true } } },
    });

    const auth = result?.emailCredentials
      .map((val) => val.emailCredentials)
      .find((val) => val.user === user && val.protocol === "imap");

    if (!auth) throw new Error("emailCredentials not found");

    const client = new ImapFlow({
      host: auth.host ?? "",
      port: auth.port ?? 993,
      auth: {
        user: auth.user ?? "",
        pass: auth.password ?? "",
      },
      secure: auth.secure ?? true,
      logger: Logger,
    });

    const attachment = await IMAPService.downloadEmailAttachment(
      client,
      uid,
      mailbox,
      fileName,
    );

    // Download headers
    // console.log(attachment);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(attachment.filename ?? "")}"`,
    );
    res.setHeader("Content-Type", "application/octet-stream");

    try {
      const attachmentStream = Readable.from(attachment.content);
      attachmentStream.pipe(res);
    } catch (e) {
      throw new HTTPError(404, `File not found`);
    }
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
