'use strict';

/**
 *  public controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::public.public');
