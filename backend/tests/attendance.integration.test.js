'use strict';

// Diferencias respecto al contrato esperado:
//
// 1. La ruta no es POST /api/attendance.
//    La ruta real es POST /api/attendance/session/:sessionId/student/:studentId/join
//
// 2. Control de acceso (corregido tras auditoría IDOR): las rutas exigen que el
//    actor sea ADMIN, o el student/teacher de la reserva asociada a la LiveSession
//    (canAccessAttendance, mismo patrón que canAccessLiveSession). Un STUDENT
//    además solo puede operar sobre su propio :studentId.

const request     = require('supertest');
const app         = require('../src/app');
const mongoose    = require('mongoose');
const Attendance  = require('../src/models/attendance.model');
const Booking     = require('../src/models/booking.model');
const LiveSession = require('../src/models/liveSession.model');

const { connectDatabase, disconnectDatabase }       = require('./setup/db');
const { createTeacher, createStudent }              = require('./setup/user.factory');
const { getToken, authHeader }                      = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let teacherToken;       // dueño de la reserva
let studentToken;       // dueño de la reserva
let otherTeacherToken;  // ajeno a la reserva
let otherStudentToken;  // ajeno a la reserva
let student;
let sessionId;          // LiveSession._id de la reserva teacher/student

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: teacher, password: teacherPass } = await createTeacher();
  const { user: studentUser, password: studentPass } = await createStudent();
  const { user: otherTeacher, password: otherTeacherPass } = await createTeacher({ email: 'other-teacher@test.com' });
  const { user: otherStudent, password: otherStudentPass } = await createStudent({ email: 'other-student@test.com' });

  student = studentUser;

  teacherToken      = await getToken(teacher.email, teacherPass);
  studentToken       = await getToken(student.email, studentPass);
  otherTeacherToken  = await getToken(otherTeacher.email, otherTeacherPass);
  otherStudentToken  = await getToken(otherStudent.email, otherStudentPass);

  const booking = await Booking.create({
    student:     student._id,
    teacher:     teacher._id,
    course:      new mongoose.Types.ObjectId(),
    bookingDate: new Date('2027-03-15'),
    startTime:   '10:00',
    endTime:     '11:00',
    status:      'CONFIRMED',
  });

  const liveSession = await LiveSession.create({
    booking,
    roomId:   `booking-${booking._id}`,
    joinUrl:  'https://meet.jit.si/test-room',
    status:   'SCHEDULED',
  });

  sessionId = liveSession._id;
});

afterAll(async () => {
  await disconnectDatabase();
});

const makeAttendanceRecord = () => Attendance.create({ liveSession: sessionId, student: student._id, status: 'ABSENT' });

// ── POST /api/attendance/session/:sessionId/student/:studentId/join ───────────

describe('POST /api/attendance/session/:sessionId/student/:studentId/join', () => {
  test('TEACHER dueño de la reserva → 200, status PRESENT con joinedAt registrado', async () => {
    await makeAttendanceRecord();
    const res = await request(app)
      .post(`/api/attendance/session/${sessionId}/student/${student._id}/join`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('PRESENT');
    expect(res.body.joinedAt).not.toBeNull();
  });

  test('STUDENT titular del registro → 200, status PRESENT con joinedAt registrado', async () => {
    await Attendance.deleteMany({ liveSession: sessionId, student: student._id });
    await makeAttendanceRecord();
    const res = await request(app)
      .post(`/api/attendance/session/${sessionId}/student/${student._id}/join`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('PRESENT');
    expect(res.body.joinedAt).not.toBeNull();
    expect(res.body.student.toString()).toBe(student._id.toString());
  });

  test('TEACHER ajeno a la reserva → 403 Forbidden', async () => {
    await Attendance.deleteMany({ liveSession: sessionId, student: student._id });
    await makeAttendanceRecord();
    const res = await request(app)
      .post(`/api/attendance/session/${sessionId}/student/${student._id}/join`)
      .set(authHeader(otherTeacherToken));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });

  test('STUDENT ajeno al registro → 403 Forbidden', async () => {
    await Attendance.deleteMany({ liveSession: sessionId, student: student._id });
    await makeAttendanceRecord();
    const res = await request(app)
      .post(`/api/attendance/session/${sessionId}/student/${student._id}/join`)
      .set(authHeader(otherStudentToken));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post(`/api/attendance/session/${sessionId}/student/${student._id}/join`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  test('LiveSession inexistente → 404 Live session not found', async () => {
    const unknownSessionId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/attendance/session/${unknownSessionId}/student/${student._id}/join`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Live session not found');
  });
});

// ── GET /api/attendance/session/:sessionId/student/:studentId ─────────────────

describe('GET /api/attendance/session/:sessionId/student/:studentId', () => {
  test('STUDENT titular → 200', async () => {
    await Attendance.deleteMany({ liveSession: sessionId, student: student._id });
    await makeAttendanceRecord();
    const res = await request(app)
      .get(`/api/attendance/session/${sessionId}/student/${student._id}`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(res.body.student.toString()).toBe(student._id.toString());
  });

  test('STUDENT ajeno → 403 Forbidden', async () => {
    const res = await request(app)
      .get(`/api/attendance/session/${sessionId}/student/${student._id}`)
      .set(authHeader(otherStudentToken));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });

  test('TEACHER ajeno a la reserva → 403 Forbidden', async () => {
    const res = await request(app)
      .get(`/api/attendance/session/${sessionId}/student/${student._id}`)
      .set(authHeader(otherTeacherToken));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });
});

// ── GET /api/attendance/session/:sessionId ─────────────────────────────────────

describe('GET /api/attendance/session/:sessionId', () => {
  test('TEACHER dueño de la reserva → 200 con array', async () => {
    const res = await request(app)
      .get(`/api/attendance/session/${sessionId}`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('usuario ajeno a la reserva → 403 Forbidden', async () => {
    const res = await request(app)
      .get(`/api/attendance/session/${sessionId}`)
      .set(authHeader(otherStudentToken));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });
});
