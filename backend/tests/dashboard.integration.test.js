'use strict';

// Diferencia respecto al contrato esperado:
// No existe GET /api/dashboard.
// El contrato define rutas separadas por rol:
//   GET /api/dashboard/student  → verifyToken + requireRole(STUDENT)
//   GET /api/dashboard/teacher  → verifyToken + requireRole(TEACHER)
//   GET /api/dashboard/admin    → verifyToken + requireRole(ADMIN)
//
// Se testea /student como ruta representativa para los casos "autenticado" y "sin token".

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

// ── GET /api/dashboard/student ────────────────────────────────────────────────

describe('GET /api/dashboard/student', () => {
  test('STUDENT autenticado → 200 con datos del dashboard', async () => {
    const res = await request(app)
      .get('/api/dashboard/student')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get('/api/dashboard/student');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});
