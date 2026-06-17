'use strict';

/**
 * modules/availability/availability.routes.js
 * Montado bajo /api/teachers
 *
 *   GET  /api/teachers/:teacherId/availability  → getTemplate     [admin, teacher(own), student(assigned)]
 *   PUT  /api/teachers/:teacherId/availability  → replaceTemplate [admin, teacher(own)] + requireActiveUser
 *   GET  /api/teachers/:teacherId/slots         → getSlots        [admin, teacher(own), student(assigned)]
 */

// TODO: Implementar en Phase 7

const { Router } = require('express');
const router = Router({ mergeParams: true });

module.exports = router;
