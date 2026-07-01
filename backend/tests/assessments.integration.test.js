'use strict';

// Contrato real:
//   GET  /api/courses/:courseId/units/:unitId/assessment → verifyToken, sin restricción
//     de rol. El servicio aplica las reglas de negocio: curso publicado salvo ADMIN,
//     STUDENT debe estar matriculado y haber completado todas las lecciones de la
//     unidad. El campo correctIndex de cada pregunta solo se expone a ADMIN.
//   POST /api/courses/:courseId/units/:unitId/assessment → verifyToken + requireRole(ADMIN).
//   Nota: la ruta de montaje es "assessment" en singular (un único assessment por unidad),
//   a diferencia de "lessons"/"units" en plural.
//
// Verificación de autorización: coherente con units/lessons (creación restringida a
// ADMIN, lectura abierta con reglas en el servicio). Sin discrepancias.
//
// Bug encontrado y corregido (regla de negocio, no autorización):
// createAssessment no comprobaba si el curso estaba archivado, a diferencia de
// createUnit y createLesson, que sí bloquean la creación de contenido nuevo en
// cursos ARCHIVED con el mismo error COURSE_ARCHIVED. Se añadió el mismo guard
// en assessment.service.js para mantener la coherencia entre los tres módulos.

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

const validAssessment = {
  title: 'Evaluación de la unidad',
  questions: [
    { text: '¿Cuál es la opción correcta?', options: ['A', 'B', 'C'], correctIndex: 1 },
  ],
};

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
      title:       'Curso para assessments',
      description: 'Descripción válida del curso usado para probar assessments.',
      level:       'A1',
    });
  courseId = courseRes.body.course._id;

  const unitRes = await request(app)
    .post(`/api/courses/${courseId}/units`)
    .set(authHeader(adminToken))
    .send({ title: 'Unidad para assessment' });
  unitId = unitRes.body.unit._id;
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/courses/:courseId/units/:unitId/assessment ──────────────────────

describe('GET /api/courses/:courseId/units/:unitId/assessment', () => {
  beforeAll(async () => {
    await request(app)
      .post(`/api/courses/${courseId}/units/${unitId}/assessment`)
      .set(authHeader(adminToken))
      .send(validAssessment);
  });

  test('ADMIN → 200 con el assessment, incluyendo correctIndex', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/units/${unitId}/assessment`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.assessment.title).toBe(validAssessment.title);
    expect(res.body.assessment.questions[0].correctIndex).toBeDefined();
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/units/${unitId}/assessment`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── POST /api/courses/:courseId/units/:unitId/assessment ─────────────────────

describe('POST /api/courses/:courseId/units/:unitId/assessment', () => {
  test('ADMIN → 201 con el assessment creado', async () => {
    const unitRes = await request(app)
      .post(`/api/courses/${courseId}/units`)
      .set(authHeader(adminToken))
      .send({ title: 'Unidad para crear assessment' });
    const freshUnitId = unitRes.body.unit._id;

    const res = await request(app)
      .post(`/api/courses/${courseId}/units/${freshUnitId}/assessment`)
      .set(authHeader(adminToken))
      .send(validAssessment);

    expect(res.status).toBe(201);
    expect(res.body.assessment.title).toBe(validAssessment.title);
  });

  test('crear un segundo assessment en la misma unidad → 409 ASSESSMENT_EXISTS', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units/${unitId}/assessment`)
      .set(authHeader(adminToken))
      .send(validAssessment);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('ASSESSMENT_EXISTS');
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const unitRes = await request(app)
      .post(`/api/courses/${courseId}/units`)
      .set(authHeader(adminToken))
      .send({ title: 'Unidad para test de student' });

    const res = await request(app)
      .post(`/api/courses/${courseId}/units/${unitRes.body.unit._id}/assessment`)
      .set(authHeader(studentToken))
      .send(validAssessment);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/units/${unitId}/assessment`)
      .send(validAssessment);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── Regla de negocio: curso archivado ─────────────────────────────────────────

describe('POST en un curso archivado', () => {
  test('ADMIN → 403 COURSE_ARCHIVED (fix aplicado, mismo guard que units/lessons)', async () => {
    const archivedCourseRes = await request(app)
      .post('/api/courses')
      .set(authHeader(adminToken))
      .send({
        title:       'Curso a archivar',
        description: 'Descripción válida del curso que se archivará.',
        level:       'B1',
      });
    const archivedCourseId = archivedCourseRes.body.course._id;

    const archivedUnitRes = await request(app)
      .post(`/api/courses/${archivedCourseId}/units`)
      .set(authHeader(adminToken))
      .send({ title: 'Unidad requerida para publicar' });
    const archivedUnitId = archivedUnitRes.body.unit._id;

    await request(app)
      .patch(`/api/courses/${archivedCourseId}/publish`)
      .set(authHeader(adminToken));
    await request(app)
      .patch(`/api/courses/${archivedCourseId}/archive`)
      .set(authHeader(adminToken));

    const res = await request(app)
      .post(`/api/courses/${archivedCourseId}/units/${archivedUnitId}/assessment`)
      .set(authHeader(adminToken))
      .send(validAssessment);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('COURSE_ARCHIVED');
  });
});
