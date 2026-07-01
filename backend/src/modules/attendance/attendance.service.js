'use strict';

const Attendance = require('../../models/attendance.model');

async function createAttendance(data) {
  return Attendance.create(data);
}

async function getAttendanceBySession(sessionId) {
  return Attendance.find({ liveSession: sessionId }).sort({ createdAt: 1 });
}

async function getAttendance(sessionId, studentId) {
  return Attendance.findOne({ liveSession: sessionId, student: studentId }) ?? null;
}

async function markAttendance(id, status, extra = {}) {
  return Attendance.findByIdAndUpdate(
    id,
    { status, ...extra },
    { new: true, runValidators: true }
  );
}

module.exports = {
  createAttendance,
  getAttendanceBySession,
  getAttendance,
  markAttendance,
};
