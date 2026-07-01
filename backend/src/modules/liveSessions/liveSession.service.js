const LiveSession = require('../../models/liveSession.model');

function generateJitsiRoomId(bookingId) {
  return `booking-${bookingId}`;
}

function generateJitsiJoinUrl(roomId) {
  return `https://meet.jit.si/${roomId}`;
}

async function createLiveSession(data) {
  const roomId  = data.roomId  || generateJitsiRoomId(data.booking);
  const joinUrl = data.joinUrl || generateJitsiJoinUrl(roomId);
  return LiveSession.create({ ...data, roomId, joinUrl });
}

async function getLiveSessionByBooking(bookingId) {
  return LiveSession.findOne({ booking: bookingId }) ?? null;
}

async function getLiveSessionByRoom(roomId) {
  return LiveSession.findOne({ roomId }) ?? null;
}

const VALID_TRANSITIONS = {
  SCHEDULED: 'ACTIVE',
  ACTIVE:    'FINISHED',
};

async function updateLiveSessionStatus(id, status, extra = {}) {
  const current = await LiveSession.findById(id);
  if (!current || VALID_TRANSITIONS[current.status] !== status) {
    throw new Error('Invalid live session status transition');
  }
  return LiveSession.findByIdAndUpdate(
    id,
    { status, ...extra },
    { new: true, runValidators: true }
  );
}

module.exports = {
  createLiveSession,
  getLiveSessionByBooking,
  getLiveSessionByRoom,
  updateLiveSessionStatus,
};
