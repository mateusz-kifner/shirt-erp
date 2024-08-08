import type { ImapFlow } from "imapflow";

export async function fetchEmailByUid(
  client: ImapFlow,
  uid?: string,
  mailbox = "INBOX",
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

export async function emailSearch(
  client: ImapFlow,
  mailbox = "INBOX",
  query = "",
  take = 10,
  // skip: number = 0,
) {
  try {
    await client.connect();
    const mailboxObj = await client.mailboxOpen(mailbox);
    const messagesCount = mailboxObj.exists;

    // console.log(mailboxObj);
    const messages = [];

    // const last_message = await client.fetchOne("*", { envelope: true });

    // let start = last_message.seq - take - skip;
    // let stop = last_message.seq - skip;
    // if (start < 1) start = 1;
    // if (stop < 1) stop = 1;

    // console.log(last_message, `${start}:${stop}`);

    const mails = await client.search({
      or: [{ from: query }, { subject: query }],
    });
    if (!mails) return { results: [], totalItems: 0 };

    const seq: string = mails
      .filter((_, i) => i < take)
      .reduce((p, n, i) => (i === 0 ? `${n}` : `${p},${n}`), "");

    for await (const msg of client.fetch(
      { seq },
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

export async function fetchEmails(
  client: ImapFlow,
  mailbox = "INBOX",
  take = 10,
  skip = 0,
) {
  try {
    await client.connect();
    const mailboxObj = await client.mailboxOpen(mailbox);
    const messagesCount = mailboxObj.exists;

    // console.log(mailboxObj);
    const messages = [];
    // let query: number[] | string;

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
