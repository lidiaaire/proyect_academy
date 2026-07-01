'use strict';

// Contrato real:
//   GET /api/teacher-analytics/assessment-breakdown → verifyToken + requireRole(TEACHER).
//   Es la primera ruta definida en teacher-analytics.routes.js.
//   Respuesta: array plano (no envuelto en { ... }), vacío si el teacher no tiene
//   alumnos asignados (assignedTeacherId) o si ninguno tiene intentos de assessment.
//
// Verificación de autorización: solo TEACHER puede acceder (ni ADMIN ni STUDENT).
// Coincide con el contrato documentado en las rutas. Sin discrepancias detectadas.

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase } = require('./setup/db');
const { createTeacher, createStudent }        = require('./setup/user.factory');
const { getToken, authHeader }                = require('./setup/auth');

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

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/teacher-analytics/assessment-breakdown ──────────────────────────

describe('GET /api/teacher-analytics/assessment-breakdown', () => {
  test('TEACHER autenticado → 200 con array (vacío sin alumnos asignados)', async () => {
    const res = await request(app)
      .get('/api/teacher-analytics/assessment-breakdown')
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get('/api/teacher-analytics/assessment-breakdown');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  test('STUDENT autenticado → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .get('/api/teacher-analytics/assessment-breakdown')
      .set(authHeader(studentToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});
