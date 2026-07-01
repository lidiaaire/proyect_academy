'use strict';

const request = require('supertest');
const app     = require('../src/app');

const { connectDatabase, disconnectDatabase } = require('./setup/db');
const { createAdmin }                         = require('./setup/user.factory');
const { login, getToken, authHeader }         = require('./setup/auth');

// ── Estado compartido ─────────────────────────────────────────────────────────

let adminEmail;
let adminPassword;
let adminToken;

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  await connectDatabase();

  const { user, password } = await createAdmin();
  adminEmail    = user.email;
  adminPassword = password;
  adminToken    = await getToken(adminEmail, adminPassword);
});

afterAll(async () => {
  await disconnectDatabase();
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  describe('login correcto', () => {
    let res;

    beforeAll(async () => {
      res = await login(adminEmail, adminPassword);
    });

    test('responde con status 201', () => {
      expect(res.status).toBe(201);
    });

    test('devuelve un token JWT (string no vacío)', () => {
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.length).toBeGreaterThan(0);
    });

    test('incluye expiresIn en el body', () => {
      expect(res.body.expiresIn).toBeDefined();
    });

    test('el objeto user contiene los campos esperados', () => {
      const { user } = res.body;
      expect(user).toMatchObject({
        email:     adminEmail,
        firstName: expect.any(String),
        lastName:  expect.any(String),
        role:      'admin',
      });
      expect(user.id).toBeDefined();
    });

    test('no expone passwordHash en la respuesta', () => {
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.passwordHash).toBeUndefined();
    });
  });

  describe('credenciales incorrectas', () => {
    test('contraseña errónea → 401 INVALID_CREDENTIALS', async () => {
      const res = await login(adminEmail, 'contraseniaEquivocada!');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('INVALID_CREDENTIALS');
    });

    test('email inexistente → 401 INVALID_CREDENTIALS', async () => {
      const res = await login('noexiste@test.com', 'cualquierCosa1!');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('INVALID_CREDENTIALS');
    });

    test('campo email ausente → 400 VALIDATION_ERROR', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'Admin2024!' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  test('token válido → 200 con datos del usuario', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      email: adminEmail,
      role:  'admin',
    });
  });

  test('token válido → no expone passwordHash', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set(authHeader(adminToken));

    expect(res.body.user.passwordHash).toBeUndefined();
  });

  test('sin token → 401 TOKEN_MISSING', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_MISSING');
  });

  test('token malformado → 401 TOKEN_INVALID', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set(authHeader('esto.no.es.un.jwt'));

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('TOKEN_INVALID');
  });
});
