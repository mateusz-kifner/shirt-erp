"use strict";

import { factories } from "@strapi/strapi";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { Readable } from "stream";

const FLAG = "$ShirtERP";
const autoReferenceEmailTime = 3 * 24 * 60 * 60;
// const refreshMinWaitTime = 5 * 60;
const refreshMinWaitTime = 10;

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

let last_update = Math.floor(Date.now() / 1000);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default factories.createCoreController(
  "api::email-message.email-message",
  ({ strapi }) => {
    return {
      async refresh(ctx) {
        const now = Math.floor(Date.now() / 1000);
        if (last_update > now) {
          return {
            data: {
              success: false,
              error:
                "refreshed too fast, next refresh will be available in " +
                (last_update - now).toString() +
                "s",
              timeToNextRefresh: (last_update - now).toString(),
            },
          };
        }
        last_update = now + refreshMinWaitTime;
        /**
         * sets flag on every mail in INDEX mailbox
         * @param {
         * id,
         * host,
         * port,
         * secure,
         * user,
         * password,
         * }
         */
        const setFlagShirtERP = async ({
          id,
          host,
          port,
          secure,
          user,
          password,
        }) => {
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
            console.log()
            //let res = await client.messageFlagsAdd("1:10",[FLAG])
           //let res = await client.messageFlagsAdd("*", ["\\Seen"]);
            let lastMsg = await client.fetchOne("*",{uid:true,flags:true})
            console.log(lastMsg)
            // let list = await client.search({
            //   unKeyword: FLAG,
            // });
            // console.log(list)
            // list.length > 0 &&
            //   strapi.log.debug("new mails found: [ " + list.join(",") + " ]");
            // console.log(list)
            //   await client.messageFlagsAdd(list, [FLAG]);

          } finally {
            // Make sure lock is released, otherwise next `getMailboxLock()` never returns
            lock.release();
          }
         

        
          // log out and close connection
          await client.logout();
        }

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
          let list;
          try {
            // fetch latest message source
            // client.mailbox includes information about currently selected mailbox
            // "exists" value is also the largest sequence number available in the mailbox
            // let message = await client.fetchOne(client.mailbox.exists, { source: true })
            // console.log(message.source.toString())
            // list subjects for all messages
            // uid value is always included in FETCH response, envelope strings are in unicode.
            list = await client.search({
              seen: false,
            });
            list.length > 0 &&
              strapi.log.debug("new mails found: [ " + list.join(",") + " ]");
            await client.messageFlagsAdd(list, ["\\Seen"]);
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
                  [data.key]: data.line
                    .substring(data.key.length + 1)
                    .trimStart(),
                }),
                {}
              );
              console.log(headerLines.references);

              const references =
                headerLines.references && headerLines.references.length > 0
                  ? headerLines.references
                      .replace("\n", " ")
                      .split(" ")
                      .filter((val) => val.length > 0)
                      .map((val) => val.trim())
                      .reverse()
                  : [];
              console.log(references);

              let mails = [];
              for (let ref of references) {
                console.log(ref);
                let mess = await strapi.services[
                  "api::email-message.email-message"
                ].find({
                  filters: { messageId: { $eq: ref } },
                  populate: "*",
                });
                console.log(mess);

                if (mess.results.length > 0) {
                  mails.push(mess.results[0]);
                }
              }
              const current_mail_date = new Date(parsed.date).getTime();
              let id = null;
              let time = Number.MAX_SAFE_INTEGER;
              let orderIds: number[] = [];

              for (let mail of mails) {
                console.log(mail);
                const autoReferenceTime: number = Math.trunc(
                  (current_mail_date - new Date(mail.date).getTime()) / 60000.0
                );
                if (time > autoReferenceTime) {
                  time = autoReferenceTime;
                  id = mail.id;
                  orderIds = mail.orders.map((val) => val.id);
                }
              }
              if (time > autoReferenceEmailTime) orderIds = [];
              const createdMail = await strapi.entityService.create(
                "api::email-message.email-message",
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
                const updateData = await strapi.services[
                  "api::email-message.email-message"
                ].update(id, {
                  data: { nextMessageId: createdMail.id },
                });
                strapi.log.debug(updateData);
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
          return list.length;
        };
        // get all auth
        let auth = await strapi.db
          .query("api::email-credential.email-credential")
          .findMany({});

        // let auth = await strapi
        //   .service('api::email-credential.email-credential')
        //   .find({ populate: "*" });
        // time client will auto reference emails if headerLines.references is present and known

        console.log(auth);
        let email_count = 0;
        if (auth.length > 0) {
          
            // for (let emailAuth of auth) {
              
            //   await setFlagShirtERP({ ...emailAuth });
            // }
           
          
          for (let emailAuth of auth) {
            console.log(emailAuth);
            email_count += await getMails({ ...emailAuth }).catch((err) =>
              console.error(err)
            );
          }
        }

        return { data: { success: true, newEmailFound: email_count } };
      },
    };
  }
);
