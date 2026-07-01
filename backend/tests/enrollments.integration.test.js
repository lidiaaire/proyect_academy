'use strict';

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase }          = require('./setup/db');
const { createAdmin, createStudent, createTeacher }    = require('./setup/user.factory');
const { getToken, authHeader }                         = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let adminToken;
let studentToken;
let studentId;
let publishedCourseId;
let teacherToken;
let cohortStudentId;
let cohortEnrollmentId;
let outsideCohortEnrollmentId;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: admin,   password: adminPass   } = await createAdmin();
  const { user: student, password: studentPass } = await createStudent();

  adminToken   = await getToken(admin.email,   adminPass);
  studentToken = await getToken(student.email, studentPass);
  studentId    = student._id.toString();

  // Crear y publicar un curso para satisfacer la precondición de enrollment
  const courseRes = await request(app)
    .post('/api/courses')
    .set(authHeader(adminToken))
    .send({
      title:       'Curso para matrícula',
      description: 'Descripción válida del curso que se usará para matricular estudiantes.',
      level:       'A1',
    });
  publishedCourseId = courseRes.body.course._id;

  await request(app)
    .post(`/api/courses/${publishedCourseId}/units`)
    .set(authHeader(adminToken))
    .send({ title: 'Unidad requerida para publicar' });

  await request(app)
    .patch(`/api/courses/${publishedCourseId}/publish`)
    .set(authHeader(adminToken));

  // Teacher con un alumno asignado (cohorte) para los tests de scope.
  const { user: teacher, password: teacherPass } = await createTeacher();
  teacherToken = await getToken(teacher.email, teacherPass);

  const { user: cohortStudent } = await createStudent({
    email:             'cohort.enrollments@test.com',
    assignedTeacherId: teacher._id,
  });
  cohortStudentId = cohortStudent._id.toString();

  const enrollRes = await request(app)
    .post('/api/enrollments')
    .set(authHeader(adminToken))
    .send({ studentId: cohortStudentId, courseId: publishedCourseId });
  cohortEnrollmentId = enrollRes.body.enrollment._id;
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── POST /api/enrollments ─────────────────────────────────────────────────────

describe('POST /api/enrollments', () => {
  test('ADMIN → 201 con la matrícula creada', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set(authHeader(adminToken))
      .send({ studentId, courseId: publishedCourseId });

    expect(res.status).toBe(201);
    expect(res.body.enrollment).toMatchObject({
      studentId,
      courseId: publishedCourseId,
      status:   'active',
    });

    outsideCohortEnrollmentId = res.body.enrollment._id;
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set(authHeader(studentToken))
      .send({ studentId, courseId: publishedCourseId });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .send({ studentId, courseId: publishedCourseId });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── GET /api/enrollments ──────────────────────────────────────────────────────

describe('GET /api/enrollments', () => {
  test('ADMIN → 200 con lista paginada de todas las matrículas', async () => {
    const res = await request(app)
      .get('/api/enrollments')
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.docs)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  test('STUDENT → 200 con sus propias matrículas', async () => {
    const res = await request(app)
      .get('/api/enrollments')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.docs)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app).get('/api/enrollments');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  test('TEACHER sin filtro → 200 solo con matrículas de su cohorte', async () => {
    const res = await request(app)
      .get('/api/enrollments')
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    const studentIds = res.body.docs.map((e) => e.studentId);
    expect(studentIds).toContain(cohortStudentId);
    expect(studentIds).not.toContain(studentId);
  });

  test('TEACHER filtrando por studentId fuera de su cohorte → 403 STUDENT_NOT_IN_COHORT', async () => {
    const res = await request(app)
      .get('/api/enrollments')
      .query({ studentId })
      .set(authHeader(teacherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('STUDENT_NOT_IN_COHORT');
  });

  test('TEACHER filtrando por studentId de su cohorte → 200', async () => {
    const res = await request(app)
      .get('/api/enrollments')
      .query({ studentId: cohortStudentId })
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.docs.every((e) => e.studentId === cohortStudentId)).toBe(true);
  });
});

// ── GET /api/enrollments/:id ──────────────────────────────────────────────────

describe('GET /api/enrollments/:id', () => {
  test('TEACHER consultando matrícula de su cohorte → 200', async () => {
    const res = await request(app)
      .get(`/api/enrollments/${cohortEnrollmentId}`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.enrollment.studentId).toBe(cohortStudentId);
  });

  test('TEACHER consultando matrícula fuera de su cohorte → 403 STUDENT_NOT_IN_COHORT', async () => {
    const res = await request(app)
      .get(`/api/enrollments/${outsideCohortEnrollmentId}`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('STUDENT_NOT_IN_COHORT');
  });

  test('ADMIN consultando cualquier matrícula → 200 (sin restricción de scope)', async () => {
    const res = await request(app)
      .get(`/api/enrollments/${cohortEnrollmentId}`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.enrollment.studentId).toBe(cohortStudentId);
  });
});

// ── Errores de negocio en POST /api/enrollments ───────────────────────────────

describe('POST /api/enrollments — errores de negocio', () => {
  let draftCourseId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/courses')
      .set(authHeader(adminToken))
      .send({
        title:       'Curso en draft para error de matrícula',
        description: 'Descripción válida del curso que permanecerá en draft.',
        level:       'B1',
      });
    draftCourseId = res.body.course._id;
  });

  test('matrícula duplicada → 409 ALREADY_ENROLLED', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set(authHeader(adminToken))
      .send({ studentId, courseId: publishedCourseId });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('ALREADY_ENROLLED');
  });

  test('curso no publicado → 422 COURSE_NOT_PUBLISHED', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set(authHeader(adminToken))
      .send({ studentId, courseId: draftCourseId });

    expect(res.status).toBe(422);
    expect(res.body.error).toBe('COURSE_NOT_PUBLISHED');
  });
});

// ── PATCH /api/enrollments/:id/suspend ────────────────────────────────────────

describe('PATCH /api/enrollments/:id/suspend', () => {
  let enrollmentId;

  beforeAll(async () => {
    const { user: target } = await createStudent({ email: 'suspend.target@test.com' });

    const res = await request(app)
      .post('/api/enrollments')
      .set(authHeader(adminToken))
      .send({ studentId: target._id.toString(), courseId: publishedCourseId });

    enrollmentId = res.body.enrollment._id;
  });

  test('ADMIN → 200, status suspended', async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/suspend`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.enrollment.status).toBe('suspended');
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/suspend`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});

// ── PATCH /api/enrollments/:id/activate ───────────────────────────────────────

describe('PATCH /api/enrollments/:id/activate', () => {
  let enrollmentId;

  beforeAll(async () => {
    const { user: target } = await createStudent({ email: 'activate.target@test.com' });

    const enrollRes = await request(app)
      .post('/api/enrollments')
      .set(authHeader(adminToken))
      .send({ studentId: target._id.toString(), courseId: publishedCourseId });

    enrollmentId = enrollRes.body.enrollment._id;

    await request(app)
      .patch(`/api/enrollments/${enrollmentId}/suspend`)
      .set(authHeader(adminToken));
  });

  test('ADMIN → 200, status active', async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/activate`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.enrollment.status).toBe('active');
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .patch(`/api/enrollments/${enrollmentId}/activate`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});
