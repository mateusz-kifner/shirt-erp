"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    let count;
    if (ctx.query._q) {
      entities = await strapi.services["order-archive"].search(ctx.query);
      count = await strapi.services["order-archive"].countSearch(ctx.query);
    } else {
      entities = await strapi.services["order-archive"].find(ctx.query);
      count = await strapi.services["order-archive"].count(ctx.query);
    }
    return {
      orders: entities.map((entity) =>
        sanitizeEntity(entity, { model: strapi.models["order-archive"] })
      ),
      count: count,
    };
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services["order-archive"].findOne({ id });
    if (entity === null) return null;

    const product_list = [];
    for (let product_component of entity.products) {
      if (product_component.product !== null) {
        const new_product = await strapi.services.product.findOne({
          id: product_component.product.id,
        });
        product_list.push({ ...product_component, product: new_product });
      } else {
        product_list.push(product_component);
      }
    }
    entity.products = product_list;
    return sanitizeEntity(entity, { model: strapi.models["order-archive"] });
  },

  async unarchive(ctx) {
    const { id } = ctx.params;
    //console.log(ctx.params);
    const entity = await strapi.services["order-archive"].findOne({ id });
    if (entity === null) return null;
    const product_list = [];
    for (let product_component of entity.products) {
      if (product_component.product !== null) {
        const new_product = await strapi.services.product.findOne({
          id: product_component.product.id,
        });
        product_list.push({ ...product_component, product: new_product });
      } else {
        product_list.push(product_component);
      }
    }
    entity.products = product_list;
    //console.log(entity);

    let new_entity = await strapi.services.order.create(entity);
    if (new_entity === null) return null;

    const delete_entity = await strapi.services["order-archive"].delete({ id });
    if (delete_entity === null) return null;

    return sanitizeEntity(new_entity, {
      model: strapi.models.order,
    });
  },
};
