'use strict';

const asyncHandler     = require('../../utils/asyncHandler');
const bookingService   = require('./booking.service');

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user.userId);
  res.status(200).json({ bookings });
});

const list     = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const getById  = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const create   = asyncHandler(async (req, res) => { res.status(501).json({ error: 'NOT_IMPLEMENTED' }); });
const confirm  = asyncHandler(async (req, res) => {
  const booking = await bookingService.confirmBooking(req.user.role, req.user.userId, req.params.id);
  res.status(200).json({ booking });
});
const complete = asyncHandler(async (req, res) => {
  const booking = await bookingService.completeBooking(req.user.role, req.user.userId, req.params.id);
  res.status(200).json({ booking });
});
const cancel   = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.user.role, req.user.userId, req.params.id);
  res.status(200).json({ booking });
});

module.exports = { getMyBookings, list, getById, create, confirm, complete, cancel };
