'use strict';

/**
 * email-message service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::email-message.email-message');
