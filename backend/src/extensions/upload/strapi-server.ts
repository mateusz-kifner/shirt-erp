"use strict";

import controllers from "./controllers";
import secureRoute from "./middlewares/secure-route";

import routes from "./routes";

import file_content_type from "./content-types/file";

export default (plugin) => {
  plugin.controllers["content-api"] = {
    ...plugin.controllers["content-api"],
    ...controllers,
  };

  plugin.routes["content-api"].routes = [
    ...plugin.routes["content-api"].routes,
    ...routes,
  ];

  plugin.contentTypes.file = file_content_type;
  plugin.middlewares = { "secure-route": secureRoute };

  for (let route of plugin.routes["content-api"].routes) {
    route.config = { middlewares: ["plugin::upload.secure-route"] };
    console.log(route);
  }
  console.log(plugin);

  return plugin;
};
