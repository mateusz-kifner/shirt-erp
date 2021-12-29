"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    let count;
    if (ctx.query._q) {
      entities = await strapi.services.order.search(ctx.query);
      count = await strapi.services.order.countSearch(ctx.query);
    } else {
      entities = await strapi.services.order.find(ctx.query);
      count = await strapi.services.order.count(ctx.query);
    }
    return {
      orders: entities.map((entity) =>
        sanitizeEntity(entity, { model: strapi.models.order })
      ),
      count: count,
    };
  },

  // TODO: make this faster
  /**
   * Retrieve a record.
   * Populate all fields of product!!!
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.order.findOne({ id });
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
    return sanitizeEntity(entity, { model: strapi.models.order });
  },

  async archive(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.order.findOne({ id });
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

    let new_entity = await strapi.services["order-archive"].create(entity);
    if (new_entity === null) return null;

    const delete_entity = await strapi.services.order.delete({ id });
    if (delete_entity === null) return null;

    return sanitizeEntity(new_entity, {
      model: strapi.models["order-archive"],
    });
  },
};
