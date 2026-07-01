'use strict';

const { Router }    = require('express');
const verifyToken   = require('../../middlewares/verifyToken');
const { canAccessAttendance } = require('./attendance.authorization');
const { getBySession, getStudentAttendance, joinSession, leaveSession } = require('./attendance.controller');

const router = Router();

router.use(verifyToken);

router.get('/session/:sessionId',                             canAccessAttendance, getBySession);
router.get('/session/:sessionId/student/:studentId',          canAccessAttendance, getStudentAttendance);
router.post('/session/:sessionId/student/:studentId/join',    canAccessAttendance, joinSession);
router.post('/session/:sessionId/student/:studentId/leave',   canAccessAttendance, leaveSession);

module.exports = router;
