'use strict';

// Diferencia respecto al contrato esperado:
// No existe GET /api/progress/me.
// La ruta equivalente es GET /api/progress/overview → verifyToken + requireRole(STUDENT).
// Respuesta: { overview }
//
// GET /api/progress/students/:studentId y .../courses/:courseId requieren
// validateTeacherScope para TEACHER: solo puede consultar alumnos de su cohorte
// (student.assignedTeacherId === teacherId). Corregido tras auditoría IDOR.

const request    = require('supertest');
const app        = require('../src/app');
const mongoose   = require('mongoose');

const { connectDatabase, disconnectDatabase }       = require('./setup/db');
const { createStudent, createTeacher, createAdmin } = require('./setup/user.factory');
const { getToken, authHeader }                      = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let studentToken;
let teacherToken;
let adminToken;
let ownStudentId;
let otherStudentId;
let courseId;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: student, password: studentPass } = await createStudent();
  studentToken = await getToken(student.email, studentPass);

  const { user: teacher, password: teacherPass } = await createTeacher();
  teacherToken = await getToken(teacher.email, teacherPass);

  const { user: admin, password: adminPass } = await createAdmin();
  adminToken = await getToken(admin.email, adminPass);

  const { user: ownStudent } = await createStudent({
    email: 'own-student@test.com',
    assignedTeacherId: teacher._id,
  });
  ownStudentId = ownStudent._id;

  const { user: otherStudent } = await createStudent({
    email: 'other-student@test.com',
  });
  otherStudentId = otherStudent._id;

  courseId = new mongoose.Types.ObjectId();
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/progress/overview ────────────────────────────────────────────────

describe('GET /api/progress/overview', () => {
  test('STUDENT autenticado → 200 con overview de progreso', async () => {
    const res = await request(app)
      .get('/api/progress/overview')
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(res.body.overview).toBeDefined();
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get('/api/progress/overview');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── GET /api/progress/students/:studentId ─────────────────────────────────────

describe('GET /api/progress/students/:studentId', () => {
  test('TEACHER consultando alumno de su cohorte → 200', async () => {
    const res = await request(app)
      .get(`/api/progress/students/${ownStudentId}`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.progress).toBeDefined();
  });

  test('TEACHER consultando alumno fuera de su cohorte → 403 STUDENT_NOT_IN_COHORT', async () => {
    const res = await request(app)
      .get(`/api/progress/students/${otherStudentId}`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('STUDENT_NOT_IN_COHORT');
  });

  test('ADMIN consultando cualquier alumno → 200 (sin restricción de scope)', async () => {
    const res = await request(app)
      .get(`/api/progress/students/${otherStudentId}`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.progress).toBeDefined();
  });
});

// ── GET /api/progress/students/:studentId/courses/:courseId ──────────────────

describe('GET /api/progress/students/:studentId/courses/:courseId', () => {
  test('TEACHER consultando alumno de su cohorte → 200', async () => {
    const res = await request(app)
      .get(`/api/progress/students/${ownStudentId}/courses/${courseId}`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(res.body.progress).toBeDefined();
  });

  test('TEACHER consultando alumno fuera de su cohorte → 403 STUDENT_NOT_IN_COHORT', async () => {
    const res = await request(app)
      .get(`/api/progress/students/${otherStudentId}/courses/${courseId}`)
      .set(authHeader(teacherToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('STUDENT_NOT_IN_COHORT');
  });
});
