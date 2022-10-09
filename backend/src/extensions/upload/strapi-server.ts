"use strict";

import controllers from "./controllers";
import secureFiles from "./middlewares/secure-files";

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
  /**  secure-files middleware MUST be added to ./config/middlewares.ts because it's hijacking koa static routeing
   * plugin::upload.secure-files
   */
  plugin.middlewares = { "secure-files": secureFiles };

  return plugin;
};
