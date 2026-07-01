const { Router } = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const { canAccessLiveSession } = require('./liveSession.authorization');
const { getByBooking, getByRoom, startSession, finishSession } = require('./liveSession.controller');

const router = Router();

router.get('/booking/:bookingId',        verifyToken, canAccessLiveSession, getByBooking);
router.get('/room/:roomId',              verifyToken, canAccessLiveSession, getByRoom);
router.post('/booking/:bookingId/start', verifyToken, canAccessLiveSession, startSession);
router.post('/booking/:bookingId/finish',verifyToken, canAccessLiveSession, finishSession);

module.exports = router;
