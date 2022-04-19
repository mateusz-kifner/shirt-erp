module.exports = [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  // {
  //   name: "strapi::body",
  //   config: {
  //     formidable: {
  //       maxFileSize: 4 * 1024 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
  //     },
  //   },
  // },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  // "global::secure_files",
];
