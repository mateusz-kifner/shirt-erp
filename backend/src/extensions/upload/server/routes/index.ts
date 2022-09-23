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
  },
];
