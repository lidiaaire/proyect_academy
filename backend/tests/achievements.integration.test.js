'use strict';

// Contrato real: GET /api/achievements/me → verifyToken, sin restricción de rol.
// Respuesta: { achievements: Array }
//
// Verificación de autorización: coherente con el contrato (logros son individuales
// por usuario, sin necesidad de restricción de rol, igual que certificates/me y
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

// ── GET /api/achievements/me ──────────────────────────────────────────────────

describe('GET /api/achievements/me', () => {
  test('usuario autenticado → 200 con array de logros', async () => {
    const res = await request(app)
      .get('/api/achievements/me')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.achievements)).toBe(true);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get('/api/achievements/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});
