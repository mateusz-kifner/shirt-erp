"use strict";
import url from "url";

// TODO: find better way to handle thumbnails, current imp strips "thumbnail_"

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const urlParams = url.parse(ctx.request.url, true);
    const split_url = urlParams.pathname.split("/");
    // check if is file request
    const is_file_path = urlParams.pathname.startsWith("/uploads/");
    // check if is download request
    const is_download_path = urlParams.pathname.startsWith(
      "/api/upload/download/"
    );

    // if not file or download go next
    if (!(is_file_path || is_download_path)) return await next();
    let file;
    // find from hash name
    if (is_file_path) {
      let file_hash = split_url[2].split("?")[0].split(".")[0];
      // remove thumbnail from hash
      if (file_hash.startsWith("thumbnail_"))
        file_hash = file_hash.substring(10);
      file = await strapi.plugins["upload"].services.upload.findMany({
        filters: { hash: file_hash },
      });
    }
    // find from id
    if (is_download_path) {
      file = await strapi.plugins["upload"].services.upload.findMany({
        filters: { id: split_url[4] },
      });
    }
    // check if it is public
    if (file[0]?.public) return next();
    //check if has token and token is correct
    if (file[0]?.token) {
      const token = ctx.request.query.token;
      console.log(file[0]?.token, token);
      if (token && token === file[0].token) {
        return next();
      }
    }

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
