import url from "url";

export default (config, { strapi }) => {
  return (context, next) => {
    const urlParams = url.parse(context.request.url, true);

    console.log(urlParams);
    next();
  };
};
