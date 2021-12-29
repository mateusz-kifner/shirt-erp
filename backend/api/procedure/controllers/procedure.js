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
       entities = await strapi.services.procedure.search(ctx.query);
       count = await strapi.services.procedure.countSearch(ctx.query);
     } else {
       entities = await strapi.services.procedure.find(ctx.query);
       count = await strapi.services.procedure.count(ctx.query);
     }
     return {procedures: entities.map(entity => sanitizeEntity(entity, { model: strapi.models.procedure })),count:count};
   },
 };
  