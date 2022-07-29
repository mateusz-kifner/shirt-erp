"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

/**
 * A set of functions called "actions" for `icon`
 */

module.exports = createCoreController("api::icon.icon", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: "*" };
    let response = await super.find(ctx);
    const query_arr = {};
    for (let field in response.data.attributes) {
      if (
        ["id", "createdAt", "updatedAt", "createdBy", "updatedBy"].includes(
          field
        )
      )
        continue;

      query_arr[field] = { populate: "*" };
    }
    ctx.query = { ...ctx.query, populate: query_arr };
    response = await super.find(ctx);

    let new_response = { data: {} };
    for (let field in response.data.attributes) {
      if (
        ["id", "createdAt", "updatedAt", "createdBy", "updatedBy"].includes(
          field
        )
      )
        continue;
      new_response.data[field] = [];
      for (let icon of response.data.attributes[field]) {
        new_response.data[field].push({
          id: icon.id,
          name: icon.name,
          url: icon.icon.data.attributes.url,
        });
      }
    }

    return new_response;
  },
}));
