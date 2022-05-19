"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const split_url = ctx.request.url.split("/");
    const is_file_path = split_url.length > 1 && split_url[1] === "uploads";
    if (!is_file_path) return await next();
    // check if it is public
    const file = await strapi.plugins["upload"].services.upload.findMany({
      filters: { hash: split_url[2].split("?")[0].split(".")[0] },
    });
    if (file?.public) return next();

    // auth if user is Employee
    if (ctx?.request?.header?.authorization) {
      try {
        const jwt_data = await strapi.plugins[
          "users-permissions"
        ].services.jwt.getToken(ctx);
        const user = await strapi.plugins[
          "users-permissions"
        ].services.user.fetch(jwt_data.id, { populate: ["role"] });
        if (user.role.name === "Employee") {
          return await next();
        }
      } catch (err) {
        strapi.log.error(err);
        return ctx.forbidden();
      }
    }
    return ctx.forbidden();
  };
};
