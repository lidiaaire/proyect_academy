'use strict';

// Contrato real:
//   GET  /api/courses/:courseId/units/:unitId/lessons → verifyToken, sin restricción de rol.
//     El servicio aplica las reglas de negocio: el curso debe estar publicado
//     salvo que el actor sea ADMIN, y un STUDENT debe estar matriculado.
//   POST /api/courses/:courseId/units/:unitId/lessons → verifyToken + requireRole(ADMIN).
//
// Verificación de coherencia: mismo patrón de autorización que el módulo units
// (creación restringida a ADMIN, lectura abierta a cualquier rol autenticado con
// reglas de negocio aplicadas a nivel de servicio). La autorización en sí es
// correcta, sin discrepancias.
//
// Bug encontrado y corregido (no es de autorización, sino de validación):
// en lesson.validator.js, createLessonSchema tenía un segundo bloque
// `body('type').not().exists()...` contradictorio con el primero (que exige
// `type` como obligatorio). Esto provocaba que CUALQUIER POST con un `type`
// válido devolviera siempre 400 VALIDATION_ERROR, dejando el endpoint
// efectivamente inservible para cualquier rol. Se eliminó el bloque
// contradictorio (código muerto) ya que el primer bloque ya valida `type`
// correctamente (obligatorio + enum).

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase } = require('./setup/db');
const { createAdmin, createStudent }          = require('./setup/user.factory');
const { getToken, authHeader }                = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let adminToken;
let studentToken;
let courseId;
let unitId;

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
      title:       'Curso para lessons',
      description: 'Descripción válida del curso usado para probar lessons.',
      level:       'A1',
    });
  courseId = courseRes.body.course._id;

  const unitRes = await request(app)
    .post(`/api/courses/${courseId}/units`)
    .set(authHeader(adminToken))
    .send({ title: 'Unidad para lessons' });
  unitId = unitRes.body.unit._id;
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/courses/:courseId/units/:unitId/lessons ─────────────────────────

describe('GET /api/courses/:courseId/units/:unitId/lessons', () => {
  test('ADMIN → 200 con lista paginada (bypassa la restricción de curso publicado)', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/units/${unitId}/lessons`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.docs)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/units/${unitId}/lessons`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── POST /api/courses/:courseId/units/:unitId/lessons ────────────────────────

describe('POST /api/courses/:courseId/units/:unitId/lessons', () => {
  test('ADMIN → 201 con la lección creada', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units/${unitId}/lessons`)
      .set(authHeader(adminToken))
      .send({ title: 'Lección 1: Saludos', type: 'text', content: 'Contenido de prueba' });

    expect(res.status).toBe(201);
    expect(res.body.lesson).toMatchObject({
      title: 'Lección 1: Saludos',
      type:  'text',
      unitId,
    });
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units/${unitId}/lessons`)
      .set(authHeader(studentToken))
      .send({ title: 'Lección no autorizada', type: 'text', content: 'Contenido' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units/${unitId}/lessons`)
      .send({ title: 'Lección sin token', type: 'text', content: 'Contenido' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});
