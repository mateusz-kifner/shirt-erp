'use strict';

/**
 * public service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::public.public');
