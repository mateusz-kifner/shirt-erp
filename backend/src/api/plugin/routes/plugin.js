'use strict';

/**
 * plugin router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::plugin.plugin');
