export default [
  {
    method: "PUT",
    path: "/public/:id",
    handler: "content-api.public",
  },
  {
    method: "GET",
    path: "/download/:id",
    handler: "content-api.download",
    config: {
      auth: false,
    },
  },

  {
    method: "GET",
    path: "/allow_access_to_api_file_download",
    handler: "content-api.allow_access_to_api_file_download",
  },
  {
    method: "GET",
    path: "/allow_access_to_uploads",
    handler: "content-api.allow_access_to_uploads",
  },
];
