'use strict';

/**
 * modules/bookings/booking.routes.js
 * Montado bajo /api/bookings
 *
 *   GET    /api/bookings                          → list     [todos]
 *   GET    /api/bookings/:bookingId               → getById  [todos]
 *   POST   /api/bookings                          → create   [admin, student] + requireActiveUser
 *   PATCH  /api/bookings/:bookingId/confirm       → confirm  [admin, teacher dueño]  + requireActiveUser
 *   PATCH  /api/bookings/:bookingId/complete      → complete [admin, teacher dueño]  + requireActiveUser
 *   PATCH  /api/bookings/:bookingId/cancel        → cancel   [admin, student/teacher dueño] + requireActiveUser
 */

const { Router }           = require('express');
const verifyToken          = require('../../middlewares/verifyToken');
const requireRole          = require('../../middlewares/requireRole');
const BookingController    = require('./booking.controller');
const { ROLES }            = require('../../config/constants');

const router = Router();

const adminOrTeacher = requireRole(ROLES.ADMIN, ROLES.TEACHER);

router.get('/me',              verifyToken,                        BookingController.getMyBookings);
router.patch('/:id/confirm',  verifyToken, adminOrTeacher,        BookingController.confirm);
router.patch('/:id/cancel',   verifyToken,                        BookingController.cancel);
router.patch('/:id/complete', verifyToken, adminOrTeacher, BookingController.complete);

module.exports = router;
