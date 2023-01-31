"use strict";

export default [
  {
    method: "GET",
    path: "/messages",
    handler: "email-message.find",
  },
  {
    method: "GET",
    path: "/messages/refresh",
    handler: "email-message.refresh",
  },
  {
    method: "GET",
    path: "/messages/:id",
    handler: "email-message.findOne",
  },
  {
    method: "DELETE",
    path: "/messages/:id",
    handler: "email-message.delete",
  },
  {
    method: "POST",
    path: "/messages",
    handler: "email-message.create",
  },
  {
    method: "PUT",
    path: "/messages/:id",
    handler: "email-message.update",
  },
];
