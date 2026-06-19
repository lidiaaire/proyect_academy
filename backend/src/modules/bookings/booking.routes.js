'use strict';

/**
 * modules/bookings/booking.routes.js
 * Montado bajo /api/bookings
 *
 *   GET    /api/bookings                          → list     [todos]
 *   GET    /api/bookings/:bookingId               → getById  [todos]
 *   POST   /api/bookings                          → create   [admin, student] + requireActiveUser
 *   PATCH  /api/bookings/:bookingId/confirm       → confirm  [admin, teacher] + requireActiveUser
 *   PATCH  /api/bookings/:bookingId/complete      → complete [admin, teacher] + requireActiveUser
 *   PATCH  /api/bookings/:bookingId/cancel        → cancel   [todos]         + requireActiveUser
 */

// TODO: Implementar en Phase 7

const { Router } = require('express');
const router = Router();

module.exports = router;
