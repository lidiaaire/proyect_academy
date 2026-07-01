'use strict';

const attendanceService = require('./attendance.service');

async function getBySession(req, res, next) {
  try {
    const records = await attendanceService.getAttendanceBySession(req.params.sessionId);
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}

async function getStudentAttendance(req, res, next) {
  try {
    const record = await attendanceService.getAttendance(req.params.sessionId, req.params.studentId);
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

async function joinSession(req, res, next) {
  try {
    const { sessionId, studentId } = req.params;
    const record = await attendanceService.getAttendance(sessionId, studentId);
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    if (record.joinedAt) return res.status(409).json({ message: 'Student has already joined the session' });
    const updated = await attendanceService.markAttendance(record._id, 'PRESENT', { joinedAt: new Date() });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

async function leaveSession(req, res, next) {
  try {
    const { sessionId, studentId } = req.params;
    const record = await attendanceService.getAttendance(sessionId, studentId);
    if (!record) return res.status(404).json({ message: 'Attendance record not found' });
    if (!record.joinedAt) return res.status(400).json({ message: 'Student has not joined the session' });
    if (record.leftAt)   return res.status(409).json({ message: 'Student has already left the session' });

    const leftAt          = new Date();
    const durationMinutes = Math.floor((leftAt - new Date(record.joinedAt)) / 60000);

    const updated = await attendanceService.markAttendance(record._id, 'PRESENT', { leftAt, durationMinutes });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = { getBySession, getStudentAttendance, joinSession, leaveSession };
