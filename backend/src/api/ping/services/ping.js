'use strict';

/**
 * ping service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ping.ping');
