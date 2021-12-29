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
       entities = await strapi.plugins['users-permissions'].services.user.fetchAll(ctx.query);
       count = await strapi.plugins['users-permissions'].services.user.countSearch(ctx.query);
       console.log("unknown file user.js line 21")
    
      } else {
       entities = await strapi.plugins['users-permissions'].services.user.fetchAll(ctx.query);
       count = await strapi.plugins['users-permissions'].services.user.count(ctx.query);
      }
     return {users: entities.map(entity => sanitizeEntity(entity, { model: strapi.plugins['users-permissions'].models.user })),count:count};
   },
};
  