export default {
  routes: [
    {
      method: "GET",
      path: "/order-archives/unarchive/:id",
      handler: "order-archive.unarchive",
    },
  ],
};
