"use strict";

import { factories } from "@strapi/strapi";

let last_update = Math.floor(Date.now() / 1000);
// const refresh_min_wait = 60 * 5;
const refresh_min_wait = 0;

export default factories.createCoreController(
  "plugin::email-client.email-message",
  ({ strapi }) => ({
    async refresh(ctx) {
      const now = Math.floor(Date.now() / 1000);
      if (last_update > now) {
        try {
          ctx.body = "refresh in: " + (last_update - now).toString() + "s";
        } catch (err) {
          ctx.body = err;
        }
        return;
      }
      last_update = now + refresh_min_wait;
      // const { id } = ctx.params;
      // const { query } = ctx;

      // const entity = await strapi
      //   .service("api::restaurant.restaurant")
      //   .findOne(id, query);
      // const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      // return this.transformResponse(sanitizedEntity);
      try {
        ctx.body = "ok";
      } catch (err) {
        ctx.body = err;
      }
      return;
    },
  })
);
