'use strict';

/**
 * workstation router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::workstation.workstation');
