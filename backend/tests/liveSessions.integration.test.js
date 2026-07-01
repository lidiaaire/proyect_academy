'use strict';

// Contrato real: GET /api/live-sessions/booking/:bookingId (no /:bookingId)
// Autorización: admin siempre accede; student y teacher solo si están en la reserva.
// Formato 403: { message: 'Forbidden' } — difiere del patrón { error, message } del resto de la API.

const request     = require('supertest');
const app         = require('../src/app');
const mongoose    = require('mongoose');
const Booking     = require('../src/models/booking.model');
const LiveSession = require('../src/models/liveSession.model');

const { connectDatabase, disconnectDatabase }        = require('./setup/db');
const { createAdmin, createStudent, createTeacher }  = require('./setup/user.factory');
const { getToken, authHeader }                       = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let adminToken;
let studentToken;   // student propietario de la reserva
let teacherToken;
let outsiderToken;  // student que no pertenece a la reserva
let bookingId;
let studentId;
let teacherId;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: admin,    password: adminPass    } = await createAdmin();
  const { user: student,  password: studentPass  } = await createStudent();
  const { user: outsider, password: outsiderPass } = await createStudent({
    email: 'outsider@test.com',
  });
  const { user: teacher, password: teacherPass } = await createTeacher();

  adminToken    = await getToken(admin.email,    adminPass);
  studentToken  = await getToken(student.email,  studentPass);
  teacherToken  = await getToken(teacher.email,  teacherPass);
  outsiderToken = await getToken(outsider.email, outsiderPass);
  studentId     = student._id;
  teacherId     = teacher._id;

  // Crear reserva y sesión directamente en BD:
  // no existe POST /api/bookings ni POST /api/live-sessions como rutas públicas.
  const booking = await Booking.create({
    student:     student._id,
    teacher:     teacher._id,
    course:      new mongoose.Types.ObjectId(),
    bookingDate: new Date('2027-06-10'),
    startTime:   '11:00',
    endTime:     '12:00',
    status:      'CONFIRMED',
  });
  bookingId = booking._id.toString();

  await LiveSession.create({
    booking:  booking._id,
    roomId:   `booking-${booking._id}`,
    joinUrl:  `https://meet.jit.si/booking-${booking._id}`,
    provider: 'JITSI',
    status:   'SCHEDULED',
  });
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/live-sessions/booking/:bookingId ─────────────────────────────────

describe('GET /api/live-sessions/booking/:bookingId', () => {
  test('ADMIN (usuario autorizado) → 200 con la sesión', async () => {
    const res = await request(app)
      .get(`/api/live-sessions/booking/${bookingId}`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.toString()).toBe(bookingId);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get(`/api/live-sessions/booking/${bookingId}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  test('usuario sin relación con la reserva → 403 Forbidden', async () => {
    const res = await request(app)
      .get(`/api/live-sessions/booking/${bookingId}`)
      .set(authHeader(outsiderToken));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });
});

// ── POST /api/live-sessions/booking/:bookingId/start ──────────────────────────
// Contrato real: POST (no PATCH), parámetro bookingId (no session id).
// canAccessLiveSession no distingue rol: student y teacher del booking pueden iniciar.

describe('POST /api/live-sessions/booking/:bookingId/start', () => {
  let teacherBookingId;
  let studentBookingId;

  beforeAll(async () => {
    const courseId = new mongoose.Types.ObjectId();

    const [tbooking, sbooking] = await Booking.insertMany([
      {
        student:     studentId,
        teacher:     teacherId,
        course:      courseId,
        bookingDate: new Date('2027-07-01'),
        startTime:   '09:00',
        endTime:     '10:00',
        status:      'CONFIRMED',
      },
      {
        student:     studentId,
        teacher:     teacherId,
        course:      courseId,
        bookingDate: new Date('2027-07-02'),
        startTime:   '09:00',
        endTime:     '10:00',
        status:      'CONFIRMED',
      },
    ]);

    teacherBookingId = tbooking._id.toString();
    studentBookingId = sbooking._id.toString();

    await LiveSession.insertMany([
      {
        booking:  tbooking._id,
        roomId:   `booking-${tbooking._id}`,
        joinUrl:  `https://meet.jit.si/booking-${tbooking._id}`,
        provider: 'JITSI',
        status:   'SCHEDULED',
      },
      {
        booking:  sbooking._id,
        roomId:   `booking-${sbooking._id}`,
        joinUrl:  `https://meet.jit.si/booking-${sbooking._id}`,
        provider: 'JITSI',
        status:   'SCHEDULED',
      },
    ]);
  });

  test('TEACHER → 200, status ACTIVE', async () => {
    const res = await request(app)
      .post(`/api/live-sessions/booking/${teacherBookingId}/start`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACTIVE');
  });

  test('STUDENT → 200, status ACTIVE (canAccessLiveSession no restringe el rol)', async () => {
    const res = await request(app)
      .post(`/api/live-sessions/booking/${studentBookingId}/start`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACTIVE');
  });
});

// ── POST /api/live-sessions/booking/:bookingId/finish ─────────────────────────
// Transición ACTIVE → FINISHED. Se insertan sesiones ya en ACTIVE para no
// acoplar este bloque al resultado de /start.

describe('POST /api/live-sessions/booking/:bookingId/finish', () => {
  let finishTeacherBookingId;
  let finishStudentBookingId;

  beforeAll(async () => {
    const courseId = new mongoose.Types.ObjectId();

    const [tbooking, sbooking] = await Booking.insertMany([
      {
        student:     studentId,
        teacher:     teacherId,
        course:      courseId,
        bookingDate: new Date('2027-08-01'),
        startTime:   '10:00',
        endTime:     '11:00',
        status:      'CONFIRMED',
      },
      {
        student:     studentId,
        teacher:     teacherId,
        course:      courseId,
        bookingDate: new Date('2027-08-02'),
        startTime:   '10:00',
        endTime:     '11:00',
        status:      'CONFIRMED',
      },
    ]);

    finishTeacherBookingId = tbooking._id.toString();
    finishStudentBookingId = sbooking._id.toString();

    await LiveSession.insertMany([
      {
        booking:  tbooking._id,
        roomId:   `booking-${tbooking._id}`,
        joinUrl:  `https://meet.jit.si/booking-${tbooking._id}`,
        provider: 'JITSI',
        status:   'ACTIVE',
      },
      {
        booking:  sbooking._id,
        roomId:   `booking-${sbooking._id}`,
        joinUrl:  `https://meet.jit.si/booking-${sbooking._id}`,
        provider: 'JITSI',
        status:   'ACTIVE',
      },
    ]);
  });

  test('TEACHER → 200, status FINISHED', async () => {
    const res = await request(app)
      .post(`/api/live-sessions/booking/${finishTeacherBookingId}/finish`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('FINISHED');
  });

  test('STUDENT → 200, status FINISHED (canAccessLiveSession no restringe el rol)', async () => {
    const res = await request(app)
      .post(`/api/live-sessions/booking/${finishStudentBookingId}/finish`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('FINISHED');
  });
});
