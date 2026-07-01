'use strict';

// Las operaciones confirm/complete/cancel exigen, además del rol, que el actor
// sea el dueño de la reserva (student o teacher según corresponda) o ADMIN.
// Corregido tras auditoría IDOR — antes cualquier admin/teacher podía confirmar
// o completar reservas ajenas, y cualquier usuario autenticado podía cancelar
// reservas que no le pertenecían.

const request  = require('supertest');
const app      = require('../src/app');
const mongoose = require('mongoose');
const Booking  = require('../src/models/booking.model');

const { connectDatabase, disconnectDatabase }        = require('./setup/db');
const { createAdmin, createStudent, createTeacher }  = require('./setup/user.factory');
const { getToken, authHeader }                       = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let admin, student, teacher, otherTeacher;
let adminToken, teacherToken, studentToken, otherTeacherToken;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  ({ user: admin }   = await createAdmin());
  ({ user: student } = await createStudent());
  ({ user: teacher } = await createTeacher());
  ({ user: otherTeacher } = await createTeacher({ email: 'other-teacher@test.com' }));

  adminToken        = await getToken(admin.email,        'Admin2024!');
  teacherToken       = await getToken(teacher.email,       'Teacher2024!');
  studentToken       = await getToken(student.email,       'Student2024!');
  otherTeacherToken  = await getToken(otherTeacher.email,  'Teacher2024!');
});

afterAll(async () => {
  await disconnectDatabase();
});

const makeBooking = async (overrides = {}) => {
  const placeholder = new mongoose.Types.ObjectId();
  return Booking.create({
    student:     student._id,
    teacher:     teacher._id,
    course:      placeholder,
    bookingDate: new Date('2027-03-15'),
    startTime:   '10:00',
    endTime:     '11:00',
    status:      'PENDING',
    ...overrides,
  });
};

// ── GET /api/bookings/me ──────────────────────────────────────────────────────

describe('GET /api/bookings/me', () => {
  test('STUDENT → 200 con array de reservas', async () => {
    const res = await request(app)
      .get('/api/bookings/me')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
  });

  test('ADMIN → 200 con array de reservas', async () => {
    const res = await request(app)
      .get('/api/bookings/me')
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app).get('/api/bookings/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── PATCH /api/bookings/:id/confirm ───────────────────────────────────────────

describe('PATCH /api/bookings/:id/confirm', () => {
  test('ADMIN → 200, status CONFIRMED', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/confirm`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('CONFIRMED');
  });

  test('TEACHER dueño de la reserva → 200, status CONFIRMED', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/confirm`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('CONFIRMED');
  });

  test('TEACHER ajeno a la reserva → 403 BOOKING_FORBIDDEN', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/confirm`)
      .set(authHeader(otherTeacherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('BOOKING_FORBIDDEN');
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/confirm`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});

// ── PATCH /api/bookings/:id/cancel ────────────────────────────────────────────

describe('PATCH /api/bookings/:id/cancel', () => {
  test('STUDENT dueño de la reserva → 200, status CANCELLED', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/cancel`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });

  test('TEACHER dueño de la reserva → 200, status CANCELLED', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/cancel`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });

  test('ADMIN → 200, status CANCELLED', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/cancel`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('CANCELLED');
  });

  test('TEACHER ajeno a la reserva → 403 BOOKING_FORBIDDEN', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/cancel`)
      .set(authHeader(otherTeacherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('BOOKING_FORBIDDEN');
  });
});

// ── PATCH /api/bookings/:id/complete ─────────────────────────────────────────

describe('PATCH /api/bookings/:id/complete', () => {
  test('TEACHER dueño de la reserva → 200, status COMPLETED', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/complete`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('COMPLETED');
  });

  test('TEACHER ajeno a la reserva → 403 BOOKING_FORBIDDEN', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/complete`)
      .set(authHeader(otherTeacherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('BOOKING_FORBIDDEN');
  });

  test('ADMIN → 200, status COMPLETED', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/complete`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('COMPLETED');
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const booking = await makeBooking();
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/complete`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});
