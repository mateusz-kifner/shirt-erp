const { ImapFlow } = require("imapflow");
const simpleParser = require("mailparser").simpleParser;
const { Readable } = require("stream");

let mail_lock = 0;

module.exports = {
  "0 0/5 * ? * *": async ({ strapi }) => {
    // console.log(mail_lock);
    if (mail_lock) return;
    mail_lock++;
    let { auth } = await strapi
      .service("api::email-auth.email-auth")
      .find({ populate: "*" });

    const getMails = async ({ host, port, secure, user, password }) => {
      const client = await new ImapFlow({
        host: host,
        port: port,
        secure: secure,
        auth: {
          user: user,
          pass: password,
        },
        logger: {
          debug: (obj) => {
            return;
            strapi.log.debug(JSON.stringify(obj, undefined, 2));
          },
          info: (obj) => {
            strapi.log.info(JSON.stringify(obj, undefined, 2));
          },
          warn: (obj) => {
            strapi.log.warn(JSON.stringify(obj, undefined, 2));
          },
          error: (obj) => {
            strapi.log.error(JSON.stringify(obj, undefined, 2));
          },
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
          unKeyword: "$ShirtDipERP",
        });
        list.length > 0 &&
          strapi.log.debug("new mails found: [ " + list.join(",") + " ]");

        await client.messageFlagsAdd(list, ["$ShirtDipERP"]);

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
                headerLines: parsed.headerLines.reduce(
                  (obj, data) => ({
                    ...obj,
                    [data.key]: data.line
                      .substring(data.key.length + 1)
                      .trimStart(),
                  }),
                  {}
                ),
                attachments: new_attachments,
              },
            }
          );
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
      mail_lock--;
      // log out and close connection
      await client.logout();
    };
    for (let emailAuth of auth) {
      // console.log(emailAuth);
      getMails({ ...emailAuth }).catch((err) => console.error(err));
    }
  },
};
