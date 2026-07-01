'use strict';

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase }       = require('./setup/db');
const { createAdmin, createTeacher, createStudent, createUser } = require('./setup/user.factory');
const { getToken, authHeader }                      = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let adminToken;
let teacherToken;
let studentToken;
let studentId;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user: admin,   password: adminPass   } = await createAdmin();
  const { user: teacher, password: teacherPass } = await createTeacher();
  const { user: student, password: studentPass } = await createStudent();

  adminToken   = await getToken(admin.email,   adminPass);
  teacherToken = await getToken(teacher.email, teacherPass);
  studentToken = await getToken(student.email, studentPass);
  studentId    = student._id.toString();
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── GET /api/users ────────────────────────────────────────────────────────────

describe('GET /api/users', () => {
  test('ADMIN → 200 con lista paginada', async () => {
    const res = await request(app)
      .get('/api/users')
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  test('TEACHER → 200 con lista paginada', async () => {
    const res = await request(app)
      .get('/api/users')
      .set(authHeader(teacherToken));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .get('/api/users')
      .set(authHeader(studentToken));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── POST /api/users ───────────────────────────────────────────────────────────

describe('POST /api/users', () => {
  test('ADMIN → 201 con el usuario creado', async () => {
    const res = await request(app)
      .post('/api/users')
      .set(authHeader(adminToken))
      .send({
        firstName: 'Nueva',
        lastName:  'Alumna',
        email:     'nueva.alumna@test.com',
        password:  'Segura123!',
        role:      'student',
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      firstName: 'Nueva',
      lastName:  'Alumna',
      email:     'nueva.alumna@test.com',
      role:      'student',
    });
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .post('/api/users')
      .set(authHeader(studentToken))
      .send({
        firstName: 'Otro',
        lastName:  'Usuario',
        email:     'otro@test.com',
        password:  'Segura123!',
        role:      'student',
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        firstName: 'Otro',
        lastName:  'Usuario',
        email:     'otro2@test.com',
        password:  'Segura123!',
        role:      'student',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });
});

// ── PATCH /api/users/:id ──────────────────────────────────────────────────────

describe('PATCH /api/users/:id', () => {
  test('ADMIN → 200 con el usuario actualizado', async () => {
    const res = await request(app)
      .patch(`/api/users/${studentId}`)
      .set(authHeader(adminToken))
      .send({ firstName: 'Modificado' });

    expect(res.status).toBe(200);
    expect(res.body.user.firstName).toBe('Modificado');
  });

  test('STUDENT → 403 INSUFFICIENT_ROLE', async () => {
    const res = await request(app)
      .patch(`/api/users/${studentId}`)
      .set(authHeader(studentToken))
      .send({ firstName: 'Intento' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('INSUFFICIENT_ROLE');
  });
});

// ── PATCH /api/users/:id/deactivate y /activate ───────────────────────────────

describe('PATCH /api/users/:id/deactivate y activate', () => {
  let targetId;

  // Usuario dedicado para no interferir con el estado de otros tests
  // ni activar la protección de último admin.
  beforeAll(async () => {
    const { user } = await createUser({
      firstName: 'Target',
      lastName:  'Deactivate',
      email:     'target.deactivate@test.com',
      password:  'Target123!',
      role:      'student',
    });
    targetId = user._id.toString();
  });

  test('ADMIN desactiva un usuario → 200, isActive false', async () => {
    const res = await request(app)
      .patch(`/api/users/${targetId}/deactivate`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.user.isActive).toBe(false);
  });

  test('ADMIN reactiva el mismo usuario → 200, isActive true', async () => {
    const res = await request(app)
      .patch(`/api/users/${targetId}/activate`)
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.user.isActive).toBe(true);
  });
});
