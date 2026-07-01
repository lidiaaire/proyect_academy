'use strict';

const mongoose   = require('mongoose');
const request    = require('supertest');
const app        = require('../src/app');
const Assignment = require('../src/models/assignment.model');

const { connectDatabase, clearDatabase, disconnectDatabase } = require('./setup/db');
const { createStudent }                                      = require('./setup/user.factory');
const { generateToken }                                      = require('../src/modules/auth/auth.service');

// ── helpers ────────────────────────────────────────────────────────────────

const buildAssignment = (courseId, lessonId) => ({
  course:      courseId,
  lesson:      lessonId,
  title:       'Test Assignment',
  description: 'Integration test assignment',
  dueDate:     new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  maxScore:    100,
  isPublished: true,
});

// ── lifecycle ──────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── tests ──────────────────────────────────────────────────────────────────

describe('POST /api/submissions — crear una Submission válida', () => {
  test('un estudiante autenticado puede crear una Submission y recibe 201', async () => {
    // 1. Crear usuario estudiante con los campos correctos del modelo actual
    const { user: student } = await createStudent();

    // 2. Usar ObjectIds reales para course y lesson (sin necesidad de docs completos)
    const courseId = new mongoose.Types.ObjectId();
    const lessonId = new mongoose.Types.ObjectId();

    // 3. Crear Assignment publicado con fecha futura
    const assignment = await Assignment.create(buildAssignment(courseId, lessonId));

    // 4. Generar token válido para el estudiante directamente (sin pasar por login)
    const token = generateToken(student._id, student.role);

    // 5. Llamar al endpoint
    const res = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        assignment: assignment._id.toString(),
        content:    'Mi respuesta de prueba',
      });

    // 6. Verificar 201
    expect(res.status).toBe(201);

    // 7a. assignment correcto
    expect(res.body.assignment.toString()).toBe(assignment._id.toString());

    // 7b. student igual al usuario autenticado (no al body)
    expect(res.body.student.toString()).toBe(student._id.toString());

    // 7c. status inicial = SUBMITTED
    expect(res.body.status).toBe('SUBMITTED');
  });
});
