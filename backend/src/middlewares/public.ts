"use strict";

import fs from "fs";
import path from "path";
import _ from "lodash";
import stream from "stream";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (
      !(
        [
          "admin",
          "api",
          "upload",
          "uploads",
          "assets",
          "i18n",
          "content-manager",
          "users-permissions",
          "email",
          "webhooks",
          "content-type-builder",
          "api-tokens",
          "roles",
          "users",
          "manifest.json",
          "shirterp-192x192.png",
          "shirterp-384x384.png",
          "shirterp-512x512.png",
          "robots.txt",
          "connect",
          "manifest.webmanifest",
          "registerSW.js",
          "sw.js",
        ].includes(ctx.url.split("/")[1]) ||
        ctx.url.split("/")[1].startsWith("workbox")
      )
    ) {
      const index = fs.readFileSync(
        path.join(__dirname, "../../public/index.html"),
        "utf8"
      );
      const data = {};
      const content = _.template(index)(data);
      // @ts-ignore
      const body = stream.Readable({
        read() {
          this.push(Buffer.from(content));
          this.push(null);
        },
      });
      // Serve static.
      ctx.type = "html";
      ctx.body = body;
    }

    await next();
  };
};
