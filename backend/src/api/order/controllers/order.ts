"use strict";

/**
 *  order controller
 */

import { factories } from "@strapi/strapi";
import { sanitize } from "@strapi/utils";

import { omit } from "lodash";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async archive(ctx) {
      const { id } = ctx.params;
      let entity = await omit(
        await strapi.services["api::order.order"].findOne(id, {
          populate: "*",
        }),
        ["id", "updatedBy", "createdBy", "updatedAt", "createdAt"]
      );
      if (entity === null) return null;

      entity.address = await omit(entity.address, ["id"]);

      await console.log(entity);
      let new_entity = await strapi.services[
        "api::order-archive.order-archive"
      ].create({
        data: entity,
      });
      console.log(new_entity);
      if (new_entity === null) return null;

      const delete_entity = await strapi.services["api::order.order"].delete(
        id
      );
      if (delete_entity === null) return null;

      const sanitizedEntity = await sanitize.contentAPI.output(new_entity);

      return { data: sanitizedEntity, meta: {} };
    },
  })
);
