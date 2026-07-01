'use strict';

// Diferencias respecto al contrato esperado:
//
// 1. No existe GET /api/assignments.
//    La ruta real para listar por curso es GET /api/assignments/course/:courseId.
//
// 2. GET no tiene restricciones de rol: cualquier usuario autenticado puede leer.
//    POST/PUT/DELETE están restringidos a TEACHER y ADMIN (corregido tras auditoría IDOR).

const request    = require('supertest');
const app        = require('../src/app');
const mongoose   = require('mongoose');
const Assignment = require('../src/models/assignment.model');

const { connectDatabase, disconnectDatabase }      = require('./setup/db');
const { createStudent, createTeacher, createAdmin } = require('./setup/user.factory');
const { getToken, authHeader }                      = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let studentToken;
let teacherToken;
let adminToken;
let courseId;
let lessonId;
let assignmentId;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: student, password: studentPass } = await createStudent();
  studentToken = await getToken(student.email, studentPass);

  const { user: teacher, password: teacherPass } = await createTeacher();
  teacherToken = await getToken(teacher.email, teacherPass);

  const { user: admin, password: adminPass } = await createAdmin();
  adminToken = await getToken(admin.email, adminPass);

  courseId = new mongoose.Types.ObjectId();
  lessonId = new mongoose.Types.ObjectId();

  const assignment = await Assignment.create({
    course:      courseId,
    lesson:      lessonId,
    title:       'Tarea de prueba',
    description: 'Descripción de la tarea de prueba para el test de integración.',
    dueDate:     new Date('2027-09-01'),
    maxScore:    100,
    isPublished: true,
  });
  assignmentId = assignment._id;
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/assignments/course/:courseId ─────────────────────────────────────

describe('GET /api/assignments/course/:courseId', () => {
  test('STUDENT autenticado → 200 con array de assignments del curso', async () => {
    const res = await request(app)
      .get(`/api/assignments/course/${courseId}`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Tarea de prueba');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get(`/api/assignments/course/${courseId}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  test('courseId inexistente → 200 con array vacío (sin validación de existencia)', async () => {
    const unknownCourseId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/assignments/course/${unknownCourseId}`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  // "Usuario sin acceso" no aplica: el contrato no define restricciones de rol
  // más allá de verifyToken. Cualquier usuario autenticado puede listar assignments.
});

// ── POST /api/assignments ──────────────────────────────────────────────────────

describe('POST /api/assignments', () => {
  const validPayload = () => ({
    course:      courseId,
    lesson:      lessonId,
    title:       'Nueva tarea',
    description: 'Descripción de la nueva tarea de prueba.',
    dueDate:     new Date('2027-10-01'),
    maxScore:    100,
  });

  test('STUDENT autenticado → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .post('/api/assignments')
      .set(authHeader(studentToken))
      .send(validPayload());

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('TEACHER autenticado → 201', async () => {
    const res = await request(app)
      .post('/api/assignments')
      .set(authHeader(teacherToken))
      .send(validPayload());

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Nueva tarea');
  });

  test('ADMIN autenticado → 201', async () => {
    const res = await request(app)
      .post('/api/assignments')
      .set(authHeader(adminToken))
      .send(validPayload());

    expect(res.status).toBe(201);
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post('/api/assignments')
      .send(validPayload());

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── PUT /api/assignments/:id ───────────────────────────────────────────────────

describe('PUT /api/assignments/:id', () => {
  test('STUDENT autenticado → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .put(`/api/assignments/${assignmentId}`)
      .set(authHeader(studentToken))
      .send({ title: 'Tarea modificada' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('TEACHER autenticado → 200', async () => {
    const res = await request(app)
      .put(`/api/assignments/${assignmentId}`)
      .set(authHeader(teacherToken))
      .send({ title: 'Tarea modificada por teacher' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Tarea modificada por teacher');
  });
});

// ── DELETE /api/assignments/:id ────────────────────────────────────────────────

describe('DELETE /api/assignments/:id', () => {
  test('STUDENT autenticado → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .delete(`/api/assignments/${assignmentId}`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('ADMIN autenticado → 200', async () => {
    const res = await request(app)
      .delete(`/api/assignments/${assignmentId}`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
  });
});
