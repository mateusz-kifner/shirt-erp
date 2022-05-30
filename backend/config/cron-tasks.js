const { ImapFlow } = require("imapflow");
const simpleParser = require("mailparser").simpleParser;
const { Readable } = require("stream");

let mail_lock = 0;
const FLAG = "ShirtERP";

const logDebug = (obj) => {
  return;
  strapi.log.debug(JSON.stringify(obj, undefined, 2));
};

const logInfo = (obj) => {
  strapi.log.info(JSON.stringify(obj, undefined, 2));
};

const logWarn = (obj) => {
  strapi.log.warn(JSON.stringify(obj, undefined, 2));
};

const logError = (obj) => {
  strapi.log.error(JSON.stringify(obj, undefined, 2));
};
// 0 0/5 * * ? * *
module.exports = {
  "0 0/2 * ? * *": async ({ strapi }) => {
    // EMAIL FETCH
    logInfo("Mail locked: " + (mail_lock ? "yes" : "no"));
    if (mail_lock) return;

    const setFlagShirtERP = async ({
      id,
      host,
      port,
      secure,
      user,
      password,
    }) => {
      mail_lock++;

      const client = await new ImapFlow({
        host: host,
        port: port,
        secure: secure,
        auth: {
          user: user,
          pass: password,
        },
        logger: {
          debug: logDebug,
          info: logInfo,
          warn: logWarn,
          error: logError,
        },
      });
      await client.connect();
      let lock = await client.getMailboxLock("INBOX");

      try {
        let list = await client.search({
          unKeyword: FLAG,
        });
        list.length > 0 &&
          strapi.log.debug("new mails found: [ " + list.join(",") + " ]");

        await client.messageFlagsAdd(list, [FLAG]);
      } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
      }
      // log out and close connection
      await client.logout();
      mail_lock--;
    };

    let auth = await strapi
      .service("api::email-auth.email-auth")
      .find({ populate: "*" });

    const autoReferenceEmailForMinutes = auth?.autoReferenceEmailForMinutes
      ? auth.autoReferenceEmailForMinutes
      : 4320;

    const getMails = async ({ host, port, secure, user, password }) => {
      mail_lock++;

      const client = await new ImapFlow({
        host: host,
        port: port,
        secure: secure,
        auth: {
          user: user,
          pass: password,
        },
        logger: {
          debug: logDebug,
          info: logInfo,
          warn: logWarn,
          error: logError,
        },
      });

      // Wait until client connects and authorizes
      await client.connect();

      // Select and lock a mailbox. Throws if mailbox does not exist
      let lock = await client.getMailboxLock("INBOX");
      try {
        // fetch latest message source
        // client.mailbox includes information about currently selected mailbox
        // "exists" value is also the largest sequence number available in the mailbox
        // let message = await client.fetchOne(client.mailbox.exists, { source: true })
        // console.log(message.source.toString())

        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        let list = await client.search({
          unKeyword: FLAG,
        });
        list.length > 0 &&
          strapi.log.debug("new mails found: [ " + list.join(",") + " ]");

        await client.messageFlagsAdd(list, [FLAG]);

        // console.log(list.join(","));
        for (let mail_index of list) {
          let { content } = await client.download(mail_index);
          // console.log(content);
          let parsed = await simpleParser(content);
          // console.log(parsed.attachments);
          let new_attachments = [];
          for (let file of parsed.attachments) {
            const formattedFile =
              await strapi.plugins.upload.services.upload.formatFileInfo(
                {
                  filename: file.filename,
                  type: file.contentType,
                  size: file.size,
                },
                { name: file.filename },
                {}
              );
            formattedFile["buffer"] = file.content;
            formattedFile["getStream"] = () => Readable.from(file.content);
            formattedFile["path"] = "./" + file.filename;
            formattedFile["tmpWorkingDirectory"] = "./public/uploads";
            // console.log(formattedFile);

            const upload =
              await strapi.plugins.upload.services.upload.uploadFileAndPersist(
                formattedFile
              );

            strapi.log.debug(JSON.stringify(upload, undefined, 2));
            new_attachments.push(upload);
          }
          const headerLines = parsed.headerLines.reduce(
            (obj, data) => ({
              ...obj,
              [data.key]: data.line.substring(data.key.length + 1).trimStart(),
            }),
            {}
          );

          const references =
            headerLines.references && headerLines.references.length > 0
              ? headerLines.references
                  .replace("\n", " ")
                  .split(" ")
                  .filter((val) => val.length > 0)
                  .map((val) => val.trim())
                  .reverse()
              : [];

          let mails = [];
          for (let ref of references) {
            let mess = await strapi.services[
              "api::email-message.email-message"
            ].find({
              filters: { messageId: { $eq: ref } },
              populate: "*",
            });
            if (mess.results.length > 0) {
              mails.push(mess.results[0]);
            }
          }

          const current_mail_date = new Date(parsed.date).getTime();
          let id = null;
          let time = Number.MAX_SAFE_INTEGER;
          let orderIds = [];
          for (let mail of mails) {
            const autoReferenceTime = parseInt(
              (current_mail_date - new Date(mail.date).getTime()) / 60000
            );
            if (time > autoReferenceTime) {
              time = autoReferenceTime;
              id = mail.id;
              orderIds = mail.orders.map((val) => val.id);
            }
          }
          if (time > autoReferenceEmailForMinutes) orderIds = [];
          const createdMail = await strapi.entityService.create(
            `api::email-message.email-message`,
            {
              data: {
                subject: parsed.subject,
                to: parsed.to.text,
                from: parsed.from.text,
                date: parsed.date,
                messageId: parsed.messageId,
                text: parsed.text,
                textAsHtml: parsed.textAsHtml,
                html: parsed.html,
                headerLines: headerLines,
                attachments: new_attachments,
                orders: orderIds,
              },
            }
          );

          if (id !== null) {
            await strapi.services["api::email-message.email-message"].update(
              id,
              {
                data: { nextMessageId: createdMail.id },
              }
            );
          }

          strapi.log.debug(
            JSON.stringify(
              { subject: createdMail.subject, text: createdMail.text },
              undefined,
              2
            )
          );
        }
      } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
      }
      // log out and close connection
      await client.logout();
      mail_lock--;
    };

    if (auth?.auth) {
      if (auth?.initialized !== true) {
        for (let emailAuth of auth.auth) {
          await setFlagShirtERP({ ...emailAuth });
        }
        await strapi.service("api::email-auth.email-auth").createOrUpdate({
          data: { initialized: true },
        });
      }
      for (let emailAuth of auth.auth) {
        // console.log(emailAuth);
        await getMails({ ...emailAuth }).catch((err) => console.error(err));
      }
    }
  },
};
