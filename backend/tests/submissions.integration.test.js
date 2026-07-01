'use strict';

// Contrato: POST /api/submissions → verifyToken + requireRole(STUDENT)
// Solo STUDENT puede entregar. TEACHER y ADMIN reciben 403 INSUFFICIENT_ROLE.
// Respuesta 201: documento de submission directo (sin wrapper).

const request    = require('supertest');
const app        = require('../src/app');
const mongoose   = require('mongoose');
const Assignment = require('../src/models/assignment.model');

const { connectDatabase, disconnectDatabase }       = require('./setup/db');
const { createStudent, createTeacher }              = require('./setup/user.factory');
const { getToken, authHeader }                      = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let studentToken;
let teacherToken;
let assignmentId;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: student, password: studentPass } = await createStudent();
  const { user: teacher, password: teacherPass } = await createTeacher();

  studentToken = await getToken(student.email, studentPass);
  teacherToken = await getToken(teacher.email, teacherPass);

  // Assignment publicado con plazo futuro — precondiciones del controlador.
  const assignment = await Assignment.create({
    course:      new mongoose.Types.ObjectId(),
    lesson:      new mongoose.Types.ObjectId(),
    title:       'Tarea de entrega',
    description: 'Descripción de la tarea para el test de submissions.',
    dueDate:     new Date('2028-01-01'),
    maxScore:    100,
    isPublished: true,
  });
  assignmentId = assignment._id.toString();
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── POST /api/submissions ─────────────────────────────────────────────────────

describe('POST /api/submissions', () => {
  test('STUDENT → 201 con la submission creada', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .set(authHeader(studentToken))
      .send({ assignment: assignmentId, content: 'Mi respuesta a la tarea.' });

    expect(res.status).toBe(201);
    expect(res.body.assignment.toString()).toBe(assignmentId);
    expect(res.body.content).toBe('Mi respuesta a la tarea.');
    expect(res.body.status).toBe('SUBMITTED');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({ assignment: assignmentId, content: 'Sin token.' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  test('TEACHER → 403 INSUFFICIENT_ROLE (solo STUDENT puede entregar)', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .set(authHeader(teacherToken))
      .send({ assignment: assignmentId, content: 'Intento de teacher.' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});

// ── GET /api/submissions/assignment/:assignmentId ─────────────────────────────
// No existe GET /api/submissions/me.
// La ruta equivalente para que un STUDENT consulte su entrega es
// GET /assignment/:assignmentId, que canAccessSubmission filtra por usuario.
// Respuesta: { items, total, page, pages }
// Depende de que el POST anterior haya creado la entrega (--runInBand garantiza el orden).

describe('GET /api/submissions/assignment/:assignmentId', () => {
  test('STUDENT → 200 con su propia entrega', async () => {
    const res = await request(app)
      .get(`/api/submissions/assignment/${assignmentId}`)
      .set(authHeader(studentToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0].assignment.toString()).toBe(assignmentId);
    expect(res.body.items[0].status).toBe('SUBMITTED');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .get(`/api/submissions/assignment/${assignmentId}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});
