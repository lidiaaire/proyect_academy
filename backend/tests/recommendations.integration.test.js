'use strict';

// Contrato real: GET /api/recommendations/me → verifyToken, sin restricción de rol.
// Respuesta: { recommendations: Array }
//
// Verificación de autorización: coherente con el contrato (recomendaciones son
// individuales por usuario, mismo patrón que achievements/me, certificates/me y
// notifications/me). Sin discrepancias detectadas.

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

// ── GET /api/recommendations/me ───────────────────────────────────────────────

describe('GET /api/recommendations/me', () => {
  test('usuario autenticado → 200 con array de recomendaciones', async () => {
    const res = await request(app)
      .get('/api/recommendations/me')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.recommendations)).toBe(true);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get('/api/recommendations/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});
