"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const split_url = ctx.request.url.split("/");
    if (
      (split_url.length > 1 && split_url[1] === "uploads") ||
      (split_url.length > 2 &&
        split_url[1] === "api" &&
        split_url[2] === "upload")
    ) {
      const file_name_from_url = split_url[2].split("?")[0];
      const public_files = await strapi.service("api::public.public").find({
        populate: "*",
      });
      // console.log(public_files, file_name_from_url);
      const is_public =
        split_url.length > 2 &&
        split_url[1] === "uploads" &&
        public_files &&
        public_files.files &&
        public_files.files.length > 0 &&
        public_files.files
          .map((val) => val.hash + val.ext)
          .filter((val) => val === file_name_from_url).length > 0;
      if (is_public) {
        return await next();
      }
      if (ctx?.request?.header?.authorization) {
        try {
          const jwt_data = await strapi.plugins[
            "users-permissions"
          ].services.jwt.getToken(ctx);
          const user = await strapi.plugins[
            "users-permissions"
          ].services.user.fetch({ id: jwt_data.id }, ["role"]);

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
