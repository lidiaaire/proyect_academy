'use strict';

// Mismo patrón de ownership que liveSession.authorization.js (canAccessLiveSession):
// admin siempre puede; student/teacher solo si son parte de la reserva de la sesión.
// Además, si la ruta incluye :studentId, un STUDENT solo puede operar sobre su propio registro.

const LiveSession       = require('../../models/liveSession.model');
const bookingRepository = require('../../repositories/booking.repository');
const { ROLES }         = require('../../config/constants');

async function canAccessAttendance(req, res, next) {
  try {
    const session = await LiveSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Live session not found' });
    }

    const booking = await bookingRepository.findById(session.booking);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const userId    = req.user.userId.toString();
    const isAdmin   = req.user.role === ROLES.ADMIN;
    const isStudent = booking.student.toString() === userId;
    const isTeacher = booking.teacher.toString() === userId;

    if (!isAdmin && !isStudent && !isTeacher) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.params.studentId && req.user.role === ROLES.STUDENT && req.params.studentId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.liveSession = session;
    req.booking     = booking;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { canAccessAttendance };
