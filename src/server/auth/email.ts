import { env } from "@/env.mjs";
import { Theme } from "next-auth";
import { SendVerificationRequestParams } from "next-auth/providers/email";
import { createTransport } from "nodemailer";

export async function sendVerificationRequest(
  params: SendVerificationRequestParams,
) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);
  console.log(host);
  const lang = url.indexOf(`${host}/en`) !== -1 ? "en" : "pl";
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${env.ORGANIZATION_NAME}`,
    text: text({ url, host, lang }),
    html: html({ url, host, theme, lang }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: {
  url: string;
  host: string;
  theme: Theme;
  lang: "en" | "pl";
}) {
  const { url, host, theme, lang } = params;

  const brandColor = theme.brandColor || "#346df1";

  return `
<body style="background: #141213;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: #141213; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px">
        <img src="https://shirterp.eu/logo.png" alt="ShirtERP"
        >
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #eee;">
        ${
          lang === "pl"
            ? `Zaloguj się do <strong>${env.ORGANIZATION_NAME}</strong>`
            : `Sign in to <strong>${env.ORGANIZATION_NAME}</strong>`
        }
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${brandColor}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #eee; text-decoration: none; border-radius: 5px; padding: 10px 20px; display: inline-block; font-weight: bold;">${
                  lang === "pl" ? "Zaloguj" : "Sign in"
                }</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #eee;">
        ${
          lang === "pl"
            ? "Jeśli nie żądałeś/łaś tego e-maila, możesz go bezpiecznie zignorować."
            : "If you did not request this email you can safely ignore it."
        }
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({
  url,
  host,
  lang,
}: {
  url: string;
  host: string;
  lang: "en" | "pl";
}) {
  if (lang === "pl") {
    return `Zaloguj się do ${env.ORGANIZATION_NAME}\n${url}\n\n`;
  }

  return `Sign in to ${env.ORGANIZATION_NAME}\n${url}\n\n`;
}
