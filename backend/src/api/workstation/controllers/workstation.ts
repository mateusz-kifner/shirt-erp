'use strict';

/**
 *  workstation controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::workstation.workstation');
