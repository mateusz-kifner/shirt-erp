'use strict';

/**
 *  plugin controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::plugin.plugin');
