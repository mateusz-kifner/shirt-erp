/**
 * email-message router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/email-messages",
      handler: "email-message.find",
    },
    {
      method: "GET",
      path: "/email-messages/refresh",
      handler: "email-message.refresh",
    },
    {
      method: "GET",
      path: "/email-messages/:id",
      handler: "email-message.findOne",
    },
    {
      method: "DELETE",
      path: "/email-messages/:id",
      handler: "email-message.delete",
    },
    {
      method: "POST",
      path: "/email-messages",
      handler: "email-message.create",
    },
    {
      method: "PUT",
      path: "/email-messages/:id",
      handler: "email-message.update",
    },
  ],
};
