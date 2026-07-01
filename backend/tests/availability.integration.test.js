'use strict';

// Contrato real:
//   GET  /api/availability/me → verifyToken, sin restricción de rol [bug, ver abajo]
//   POST /api/availability    → verifyToken, sin restricción de rol [bug, ver abajo]
//
// Incoherencia detectada y corregida:
//   El controlador de POST asigna `teacher: req.user.userId` directamente, sin
//   comprobar el rol del usuario autenticado. Esto permitía que un STUDENT creara
//   slots de "disponibilidad de profesor" con su propio id, contaminando el modelo
//   que usa el sistema de bookings para localizar profesores disponibles.
//   Mismo patrón de bug ya corregido en bookings/attendance/assignments.
//   Fix aplicado en availability.routes.js: ambas rutas ahora exigen
//   requireRole(ROLES.TEACHER).

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, clearDatabase, disconnectDatabase } = require('./setup/db');
const { createTeacher, createStudent }                       = require('./setup/user.factory');
const { getToken, authHeader }                               = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let teacherToken;
let studentToken;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: teacher, password: teacherPass } = await createTeacher();
  teacherToken = await getToken(teacher.email, teacherPass);

  const { user: student, password: studentPass } = await createStudent();
  studentToken = await getToken(student.email, studentPass);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/availability/me ──────────────────────────────────────────────────

describe('GET /api/availability/me', () => {
  test('TEACHER autenticado → 200 con array de disponibilidad', async () => {
    const res = await request(app)
      .get('/api/availability/me')
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.availability)).toBe(true);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get('/api/availability/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── POST /api/availability ────────────────────────────────────────────────────

describe('POST /api/availability', () => {
  test('TEACHER autenticado puede crear un slot de disponibilidad y recibe 201', async () => {
    const res = await request(app)
      .post('/api/availability')
      .set(authHeader(teacherToken))
      .send({ dayOfWeek: 1, startTime: '09:00', endTime: '10:00' });

    expect(res.status).toBe(201);
    expect(res.body.availability.teacher).toBeDefined();
    expect(res.body.availability.dayOfWeek).toBe(1);
  });

  test('STUDENT autenticado → 403 INSUFFICIENT_ROLE (no puede crear disponibilidad de profesor)', async () => {
    const res = await request(app)
      .post('/api/availability')
      .set(authHeader(studentToken))
      .send({ dayOfWeek: 1, startTime: '09:00', endTime: '10:00' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post('/api/availability')
      .send({ dayOfWeek: 1, startTime: '09:00', endTime: '10:00' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  // Validación de entrada (corregido tras auditoría: antes un dayOfWeek fuera de
  // rango o campos ausentes llegaban sin validar a Mongoose y devolvían 500).

  test('dayOfWeek fuera de rango → 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/availability')
      .set(authHeader(teacherToken))
      .send({ dayOfWeek: 9, startTime: '09:00', endTime: '10:00' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  test('campos ausentes → 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/availability')
      .set(authHeader(teacherToken))
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  test('startTime con formato inválido → 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/availability')
      .set(authHeader(teacherToken))
      .send({ dayOfWeek: 1, startTime: '9:00', endTime: '10:00' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });
});
