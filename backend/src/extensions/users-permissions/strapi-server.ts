"use strict";

module.exports = (plugin) => {
  // console.log(plugin);
  plugin.controllers["user"].setWelcomeMessageHash = async (ctx, next) => {
    try {
      if (typeof ctx?.request?.body?.welcomeMessageHash !== "string") {
        return ctx.badRequest("Type of welcomeMessageHash must be string");
      }
      if (!ctx?.state?.user?.id) throw new Error("user not found");
      await strapi
        .plugin("users-permissions")
        .service("user")
        .edit(ctx.state.user.id, {
          welcomeMessageHash: ctx?.request?.body?.welcomeMessageHash,
        });

      ctx.body = { success: true };
    } catch (err) {
      strapi.log.error(err);
      ctx.body = { success: false };
    }
  };
  // console.log(plugin.routes["content-api"].routes);
  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/setWelcomeMessageHash",
    handler: "user.setWelcomeMessageHash",
  });

  return plugin;
};
