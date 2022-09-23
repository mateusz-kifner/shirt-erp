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

  // {
  //   method: "POST",
  //   path: "/mail-messages",
  //   handler: "email-message.create",
  //   config: {
  //     prefix: "api",
  //   },
  // },
  // {
  //   method: "PUT",
  //   path: "/mail-messages/:id",
  //   handler: "email-message.update",
  //   config: {
  //     prefix: "api",
  //   },
  // },
];
