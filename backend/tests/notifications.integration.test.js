'use strict';

// Diferencia respecto al contrato esperado:
// No existe GET /api/notifications.
// La ruta real es GET /api/notifications/me → verifyToken, sin restricción de rol.
// Respuesta: { notifications: Array }

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase } = require('./setup/db');
const { createStudent }                       = require('./setup/user.factory');
const { getToken, authHeader }                = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let studentToken;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: student, password: studentPass } = await createStudent();
  studentToken = await getToken(student.email, studentPass);
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/notifications/me ─────────────────────────────────────────────────

describe('GET /api/notifications/me', () => {
  test('usuario autenticado → 200 con array de notificaciones', async () => {
    const res = await request(app)
      .get('/api/notifications/me')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.notifications)).toBe(true);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get('/api/notifications/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});
