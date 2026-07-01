const liveSessionService = require('./liveSession.service');
const { createAttendance, getAttendance } = require('../attendance/attendance.service');

async function getByBooking(req, res, next) {
  try {
    const session = await liveSessionService.getLiveSessionByBooking(req.params.bookingId);
    if (!session) return res.status(404).json({ message: 'Live session not found' });
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

async function getByRoom(req, res, next) {
  try {
    const session = await liveSessionService.getLiveSessionByRoom(req.params.roomId);
    if (!session) return res.status(404).json({ message: 'Live session not found' });
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

async function startSession(req, res, next) {
  try {
    const session = await liveSessionService.updateLiveSessionStatus(
      req.liveSession._id,
      'ACTIVE',
      { startedAt: new Date() }
    );

    const booking = req.booking;
    const existing = await getAttendance(req.liveSession._id, booking.student);
    if (!existing) {
      await createAttendance({
        liveSession: req.liveSession._id,
        student:     booking.student,
        status:      'ABSENT',
      });
    }

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

async function finishSession(req, res, next) {
  try {
    const session = await liveSessionService.updateLiveSessionStatus(
      req.liveSession._id,
      'FINISHED',
      { endedAt: new Date() }
    );
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

module.exports = { getByBooking, getByRoom, startSession, finishSession };
