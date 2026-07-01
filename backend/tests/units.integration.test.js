'use strict';

// Contrato real:
//   GET  /api/courses/:courseId/units → verifyToken, sin restricción de rol.
//     El servicio aplica las reglas de negocio: el curso debe estar publicado
//     salvo que el actor sea ADMIN, y un STUDENT debe estar matriculado.
//   POST /api/courses/:courseId/units → verifyToken + requireRole(ADMIN).
//
// Verificación de coherencia: la autorización coincide con el contrato esperado
// (creación de unidades restringida a ADMIN, igual que la creación de cursos).
// No se detecta ninguna discrepancia ni bug que corregir en esta iteración.

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase } = require('./setup/db');
const { createAdmin, createStudent }          = require('./setup/user.factory');
const { getToken, authHeader }                = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let adminToken;
let studentToken;
let courseId;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: admin,   password: adminPass   } = await createAdmin();
  const { user: student, password: studentPass } = await createStudent();

  adminToken   = await getToken(admin.email,   adminPass);
  studentToken = await getToken(student.email, studentPass);

  const courseRes = await request(app)
    .post('/api/courses')
    .set(authHeader(adminToken))
    .send({
      title:       'Curso para unidades',
      description: 'Descripción válida del curso usado para probar unidades.',
      level:       'A1',
    });
  courseId = courseRes.body.course._id;
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/courses/:courseId/units ──────────────────────────────────────────

describe('GET /api/courses/:courseId/units', () => {
  test('ADMIN → 200 con lista paginada (bypassa la restricción de curso publicado)', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/units`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.docs)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/units`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── POST /api/courses/:courseId/units ─────────────────────────────────────────

describe('POST /api/courses/:courseId/units', () => {
  test('ADMIN → 201 con la unidad creada', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units`)
      .set(authHeader(adminToken))
      .send({ title: 'Unidad 1: Introducción' });

    expect(res.status).toBe(201);
    expect(res.body.unit).toMatchObject({
      title:    'Unidad 1: Introducción',
      courseId,
    });
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units`)
      .set(authHeader(studentToken))
      .send({ title: 'Unidad no autorizada' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units`)
      .send({ title: 'Unidad sin token' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});
