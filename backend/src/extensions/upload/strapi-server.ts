"use strict";

import publicController from "./server/controllers/public";
import downloadController from "./server/controllers/download";
import controllers from "./server/controllers";

import routes from "./server/routes";

import file_content_type from "./server/content-types/file";

export default (plugin) => {
  plugin.controllers["content-api"] = {
    ...plugin.controllers["content-api"],
    ...controllers,
  };

  plugin.routes["content-api"].routes = [
    ...plugin.routes["content-api"].routes,
    ...routes,
  ];

  plugin.contentTypes.file.schema = file_content_type.schema;

  return plugin;
};
