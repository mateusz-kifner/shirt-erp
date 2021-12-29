'use strict';
const { sanitizeEntity } = require('strapi-utils');

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
       entities = await strapi.services.client.search(ctx.query);
       count = await strapi.services.client.countSearch(ctx.query);
     } else {
       entities = await strapi.services.client.find(ctx.query);
       count = await strapi.services.client.count(ctx.query);
     }
     return {clients: entities.map(entity => sanitizeEntity(entity, { model: strapi.models.client })),count:count};
   },
 };
  