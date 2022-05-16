"use strict";

const fs = require("fs");
const path = require("path");
const stream = require("stream");
const _ = require("lodash");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (
      ![
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
      ].includes(ctx.url.split("/")[1])
    ) {
      const index = fs.readFileSync(
        path.join(__dirname, "../../public/index.html"),
        "utf8"
      );
      const data = {};
      const content = _.template(index)(data);
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
