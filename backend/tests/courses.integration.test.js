'use strict';

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase } = require('./setup/db');
const { createAdmin, createStudent }          = require('./setup/user.factory');
const { getToken, authHeader }                = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let adminToken;
let studentToken;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: admin,   password: adminPass   } = await createAdmin();
  const { user: student, password: studentPass } = await createStudent();

  adminToken   = await getToken(admin.email,   adminPass);
  studentToken = await getToken(student.email, studentPass);
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/courses ──────────────────────────────────────────────────────────

describe('GET /api/courses', () => {
  test('ADMIN → 200 con lista paginada', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.docs)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  test('STUDENT → 200 con lista de cursos matriculados', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.docs)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app).get('/api/courses');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── POST /api/courses ─────────────────────────────────────────────────────────

const newCourse = {
  title:       'Curso de prueba',
  description: 'Descripción mínima válida del curso de prueba.',
  level:       'A1',
};

describe('POST /api/courses', () => {
  test('ADMIN → 201 con el curso creado en estado draft', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set(authHeader(adminToken))
      .send(newCourse);

    expect(res.status).toBe(201);
    expect(res.body.course).toMatchObject({
      title:  newCourse.title,
      level:  newCourse.level,
      status: 'draft',
    });
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set(authHeader(studentToken))
      .send(newCourse);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send(newCourse);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── PATCH /api/courses/:id ────────────────────────────────────────────────────

describe('PATCH /api/courses/:id', () => {
  let courseId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/courses')
      .set(authHeader(adminToken))
      .send({
        title:       'Curso para actualizar',
        description: 'Descripción inicial del curso que será actualizado.',
        level:       'B1',
      });
    courseId = res.body.course._id;
  });

  test('ADMIN → 200 con el curso actualizado', async () => {
    const res = await request(app)
      .patch(`/api/courses/${courseId}`)
      .set(authHeader(adminToken))
      .send({ title: 'Título actualizado' });

    expect(res.status).toBe(200);
    expect(res.body.course.title).toBe('Título actualizado');
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .patch(`/api/courses/${courseId}`)
      .set(authHeader(studentToken))
      .send({ title: 'Intento no autorizado' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});

// ── PATCH /api/courses/:id/publish y /archive ─────────────────────────────────

describe('PATCH /api/courses/:id/publish y archive', () => {
  let courseId;

  // Crea un curso con una unidad para satisfacer la precondición de publish.
  // publish y archive se ejecutan en secuencia sobre el mismo curso.
  beforeAll(async () => {
    const courseRes = await request(app)
      .post('/api/courses')
      .set(authHeader(adminToken))
      .send({
        title:       'Curso para publicar y archivar',
        description: 'Descripción válida del curso que se publicará y archivará.',
        level:       'B2',
      });
    courseId = courseRes.body.course._id;

    await request(app)
      .post(`/api/courses/${courseId}/units`)
      .set(authHeader(adminToken))
      .send({ title: 'Unidad requerida para publicar' });
  });

  test('ADMIN publica el curso → 200, status published', async () => {
    const res = await request(app)
      .patch(`/api/courses/${courseId}/publish`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.course.status).toBe('published');
  });

  test('ADMIN archiva el curso → 200, status archived', async () => {
    const res = await request(app)
      .patch(`/api/courses/${courseId}/archive`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.course.status).toBe('archived');
  });
});

// ── Transiciones de estado inválidas ─────────────────────────────────────────

describe('transiciones de estado inválidas', () => {
  let draftCourseId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/courses')
      .set(authHeader(adminToken))
      .send({
        title:       'Curso sin unidades para errores',
        description: 'Descripción válida del curso que se usará para probar errores de estado.',
        level:       'A2',
      });
    draftCourseId = res.body.course._id;
  });

  test('publicar un curso sin unidades → 422 COURSE_REQUIRES_UNIT', async () => {
    const res = await request(app)
      .patch(`/api/courses/${draftCourseId}/publish`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(422);
    expect(res.body.error).toBe('COURSE_REQUIRES_UNIT');
  });

  test('archivar un curso en draft → 409 INVALID_STATUS_TRANSITION', async () => {
    const res = await request(app)
      .patch(`/api/courses/${draftCourseId}/archive`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('INVALID_STATUS_TRANSITION');
  });
});
