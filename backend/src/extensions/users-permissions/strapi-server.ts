"use strict";

import setWelcomeMessageHash from "./controllers/setWelcomeMessageHash";
import routes from "./routes";

export default (plugin) => {
  plugin.controllers["user"].setWelcomeMessageHash = setWelcomeMessageHash;
  plugin.routes["content-api"].routes = [
    ...plugin.routes["content-api"].routes,
    ...routes,
  ];

  return plugin;
};
