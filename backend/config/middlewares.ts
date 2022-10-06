module.exports = [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        // useDefaults: true
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:"],
          "media-src": ["'self'", "data:", "blob:"],
          "worker-src": ["'self'", "data:", "blob:"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      formidable: {
        maxFileSize: 4 * 1024 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  "strapi::session",
  // "global::secure-files",
  "plugin::upload.secure-route",
  "strapi::favicon",
  "strapi::public",
];
