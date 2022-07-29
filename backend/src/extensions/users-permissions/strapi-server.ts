"use strict";

const strapi = require("@strapi/strapi");

module.exports = (plugin) => {
  // console.log(plugin);
  plugin.controllers["user"].setWelcomeMessageHash = async (ctx, next) => {
    try {
      console.log("test");
      if (typeof ctx?.request?.body?.welcomeMessageHash !== "string") {
        return ctx.badRequest("Type of welcomeMessageHash must be string");
      }
      console.log(strapi.plugins);
      const user = await strapi.plugins.upload.services.upload.update(id, {
        public: ctx.request.body.public,
      });
      console.log(user);
      // const sanitizedEntity = await sanitize.contentAPI.output(
      //   file,
      //   strapi.getModel("plugin::upload.file"),
      //   { auth: ctx?.state?.auth }
      // );
      // ctx.body = sanitizedEntity;
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  };
  // console.log(plugin.routes["content-api"].routes);
  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/users/setWelcomeMessageHash",
    handler: "user.setWelcomeMessageHash",
    config: { prefix: "" },
  });

  return plugin;
};
