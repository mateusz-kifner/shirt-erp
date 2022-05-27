'use strict';

/**
 * workstation service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::workstation.workstation');
