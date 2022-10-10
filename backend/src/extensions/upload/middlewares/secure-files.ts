import url from "url";

let permissions: any[] = [];

export default (config, { strapi }) => {
  return async (context, next) => {
    const urlParams = url.parse(context.request.url, true);
    const split_pathname = urlParams.pathname.split("/");

    const is_file_path = urlParams.pathname.startsWith("/uploads/");
    const is_download_path = urlParams.pathname.startsWith(
      "/api/upload/download/"
    );
    if (!(is_file_path || is_download_path)) return await next();

    let file;
    // find from hash name
    if (is_file_path) {
      let file_hash = split_pathname[split_pathname.length - 1]
        .split("?")[0]
        .split(".")[0];
      // remove thumbnail from hash
      if (file_hash.startsWith("thumbnail_"))
        file_hash = file_hash.substring(10);
      file = await strapi.plugins["upload"].services.upload.findMany({
        filters: { hash: file_hash },
      });
    }
    // find file from id
    if (is_download_path) {
      file = await strapi.plugins["upload"].services.upload.findMany({
        filters: { id: split_pathname[split_pathname.length - 1] },
      });
    }

    // if it is public allow
    if (file[0]?.public) return await next();

    //check if has token and token is correct
    if (file[0]?.token) {
      const token = context.request.query.token;
      //console.log(file[0]?.token, token);
      if (token && token === file[0].token) {
        return await next();
      }
    }

    if (context?.request?.header?.authorization) {
      try {
        // get auth data from token
        const jwt_data = await strapi.plugins[
          "users-permissions"
        ].services.jwt.getToken(context);
        // find auth user
        const user = await strapi.plugins[
          "users-permissions"
        ].services.user.fetch(jwt_data.id, { populate: ["role"] });
        // populate permissions cache
        if (permissions.length === 0) {
          // get all permissions (limited fields)
          const permissions_list = await strapi
            .query("plugin::users-permissions.role")
            .findMany();
          // populate all fields in permissions
          permissions = await Promise.all(
            permissions_list.map(
              async (permission) =>
                await strapi.plugins["users-permissions"].services.role.findOne(
                  permission.id
                )
            )
          );
        }
        // get permissions from user role
        const route_permissions = permissions.filter(
          (permission) => permission.id === user.role.id
        )[0].permissions["plugin::upload"].controllers["content-api"];
        // if can access files allow
        if (is_file_path && route_permissions.allow_access_to_uploads.enabled) {
          return await next();
        }
        // if can download files allow
        if (
          is_download_path &&
          route_permissions.allow_access_to_api_file_download.enabled
        ) {
          return await next();
        }
      } catch (err) {
        strapi.log.error(err);
        return await context.unauthorized("Missing or invalid credentials");
      }
    }

    return await context.unauthorized("Missing or invalid credentials");
  };
};
