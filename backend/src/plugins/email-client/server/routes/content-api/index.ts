"use strict";

import emailMessages from "./email-message";

export default {
  type: "content-api",
  routes: [...emailMessages],
};
