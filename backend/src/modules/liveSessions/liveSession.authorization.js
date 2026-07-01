'use strict';

const { getLiveSessionByBooking, getLiveSessionByRoom } = require('./liveSession.service');
const bookingRepository = require('../../repositories/booking.repository');
const { ROLES }         = require('../../config/constants');

async function canAccessLiveSession(req, res, next) {
  try {
    let session;

    if (req.params.bookingId) {
      session = await getLiveSessionByBooking(req.params.bookingId);
    } else {
      session = await getLiveSessionByRoom(req.params.roomId);
    }

    if (!session) {
      return res.status(404).json({ message: 'Live session not found' });
    }

    const booking = await bookingRepository.findById(session.booking);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const userId = req.user.userId.toString();
    const isAdmin   = req.user.role === ROLES.ADMIN;
    const isStudent = booking.student.toString() === userId;
    const isTeacher = booking.teacher.toString() === userId;

    if (!isAdmin && !isStudent && !isTeacher) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.liveSession = session;
    req.booking     = booking;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { canAccessLiveSession };
