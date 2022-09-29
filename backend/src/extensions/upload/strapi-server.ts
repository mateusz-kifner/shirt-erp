"use strict";

import controllers from "./controllers";

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

  return plugin;
};
