"use strict";

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
      ctx.body = file;
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

  return plugin;
};
