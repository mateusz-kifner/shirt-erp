"use strict";

const { sanitize } = require("@strapi/utils");
const Crypto = require("crypto");

function randomString(size = 48) {
  return Crypto.randomBytes(size).toString("base64").slice(0, size);
}

module.exports = (plugin) => {
  plugin.controllers["content-api"].public = async (ctx, next) => {
    try {
      const { id } = ctx.params;
      if (typeof ctx?.request?.body?.public !== "boolean") {
        return ctx.badRequest("Type of public must be boolean");
      }
      const file = await strapi.plugins.upload.services.upload.update(id, {
        public: ctx.request.body.public,
      });

      const sanitizedEntity = await sanitize.contentAPI.output(
        file,
        strapi.getModel("plugin::upload.file"),
        { auth: ctx?.state?.auth }
      );

      ctx.body = sanitizedEntity;
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  };

  plugin.controllers["content-api"].token = async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const file = await strapi.plugins.upload.services.upload.findOne(id);

      if (!file) return ctx.badRequest("File not found");
      let token = file.token;
      if (token === null) {
        token = randomString().replace(/\//, "_").replace(/\+/, "-");
        const file2 = await strapi.plugins.upload.services.upload.update(id, {
          token: token,
        });
      }

      ctx.body = { token: token };
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/public/:id",
    handler: "content-api.public",
  });

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/token/:id",
    handler: "content-api.token",
  });

  return plugin;
};
