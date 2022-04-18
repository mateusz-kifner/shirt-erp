"use strict";

/**
 * `secure_files` middleware.
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    const split_url = ctx.request.url.split("/");
    // console.log(ctx.request.url, split_url.length);
    if (
      (split_url.length > 1 && split_url[1] === "uploads") ||
      (split_url.length > 2 &&
        split_url[1] === "api" &&
        split_url[2] === "upload")
    ) {
      // console.log("In secure_files middleware.", { ...ctx });
      if (ctx?.request?.header?.authorization) {
        try {
          const jwt_data = await strapi.plugins[
            "users-permissions"
          ].services.jwt.getToken(ctx);
          console.log(jwt_data);
          const user = await strapi.plugins[
            "users-permissions"
          ].services.user.fetch({ id: jwt_data.id }, ["role"]);

          console.log(user.role.name);
          if (user.role.name === "Employee") {
            return await next();
          }
        } catch (err) {
          return ctx.unauthorized(ctx, "bad token");
        }
      } else {
        return ctx.unauthorized(ctx, "bad token");
      }
      return ctx.unauthorized(ctx, "no permissions");
    }
    return await next();
  };
};
