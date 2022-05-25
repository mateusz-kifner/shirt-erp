'use strict';

/**
 * email-auth service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::email-auth.email-auth');
