'use strict';

/**
 *  ping controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ping.ping');
