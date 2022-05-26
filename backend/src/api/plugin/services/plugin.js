'use strict';

/**
 * plugin service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::plugin.plugin');
