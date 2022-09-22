"use strict";

export default [
  {
    method: "GET",
    path: "/mail-messages",
    handler: "email-message.find",
    config: {
      prefix: "api",
    },
  },
  {
    method: "GET",
    path: "/mail-messages/:id",
    handler: "email-message.findOne",
    config: {
      prefix: "api",
    },
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
