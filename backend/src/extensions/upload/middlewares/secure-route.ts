import url from "url";

export default (config, { strapi }) => {
  return async (context, next) => {
    const urlParams = url.parse(context.request.url, true);

    if (
      urlParams.pathname.startsWith("/upload") ||
      urlParams.pathname.startsWith("/api/upload")
    ) {
      return context.forbidden();
    }
    return await next();
  };
};
