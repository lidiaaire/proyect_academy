'use strict';

const { validationResult } = require('express-validator');
const {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
  listUsersSchema,
} = require('../src/modules/users/user.validator');

// Ejecuta un array de validators sobre un req mock y devuelve los errores
const runSchema = async (schema, req) => {
  for (const validator of schema) {
    await validator.run(req);
  }
  return validationResult(req);
};

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides,
});

// ---------------------------------------------------------------------------
// idParamSchema
// ---------------------------------------------------------------------------
describe('idParamSchema', () => {
  test('acepta un ObjectId válido', async () => {
    const req = mockReq({ params: { id: '507f1f77bcf86cd799439011' } });
    const result = await runSchema(idParamSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza un id no-MongoId', async () => {
    const req = mockReq({ params: { id: 'no-valido' } });
    const result = await runSchema(idParamSchema, req);
    expect(result.isEmpty()).toBe(false);
    expect(result.array()[0].path).toBe('id');
  });

  test('rechaza id vacío', async () => {
    const req = mockReq({ params: { id: '' } });
    const result = await runSchema(idParamSchema, req);
    expect(result.isEmpty()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// createUserSchema
// ---------------------------------------------------------------------------
describe('createUserSchema', () => {
  const validBody = {
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana@example.com',
    password: 'Password1',
    role: 'student',
  };

  test('acepta body mínimo válido', async () => {
    const req = mockReq({ body: { ...validBody } });
    const result = await runSchema(createUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza si falta firstName', async () => {
    const req = mockReq({ body: { ...validBody, firstName: undefined } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'firstName')).toBe(true);
  });

  test('rechaza firstName con menos de 2 caracteres', async () => {
    const req = mockReq({ body: { ...validBody, firstName: 'A' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'firstName')).toBe(true);
  });

  test('rechaza email inválido', async () => {
    const req = mockReq({ body: { ...validBody, email: 'no-email' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'email')).toBe(true);
  });

  test('rechaza password sin mayúscula', async () => {
    const req = mockReq({ body: { ...validBody, password: 'sinmayus1' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'password')).toBe(true);
  });

  test('rechaza password sin número', async () => {
    const req = mockReq({ body: { ...validBody, password: 'SinNumero' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'password')).toBe(true);
  });

  test('rechaza password de más de 72 caracteres (límite bcrypt)', async () => {
    const req = mockReq({ body: { ...validBody, password: 'A1' + 'a'.repeat(71) } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'password')).toBe(true);
  });

  test('rechaza role inválido', async () => {
    const req = mockReq({ body: { ...validBody, role: 'superadmin' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'role')).toBe(true);
  });

  test('acepta los tres roles válidos', async () => {
    for (const role of ['admin', 'teacher', 'student']) {
      const req = mockReq({ body: { ...validBody, role } });
      const result = await runSchema(createUserSchema, req);
      expect(result.isEmpty()).toBe(true);
    }
  });

  test('rechaza si se intenta pasar passwordHash', async () => {
    const req = mockReq({ body: { ...validBody, passwordHash: '$2b$10$xxx' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'passwordHash')).toBe(true);
  });

  test('acepta assignedTeacherId como ObjectId válido', async () => {
    const req = mockReq({
      body: { ...validBody, assignedTeacherId: '507f1f77bcf86cd799439011' },
    });
    const result = await runSchema(createUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('acepta assignedTeacherId como null', async () => {
    const req = mockReq({ body: { ...validBody, assignedTeacherId: null } });
    const result = await runSchema(createUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza assignedTeacherId no-MongoId', async () => {
    const req = mockReq({ body: { ...validBody, assignedTeacherId: 'no-valido' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'assignedTeacherId')).toBe(true);
  });

  test('acepta avatarUrl http válida', async () => {
    const req = mockReq({ body: { ...validBody, avatarUrl: 'https://cdn.example.com/img.png' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza avatarUrl con protocolo no permitido', async () => {
    const req = mockReq({ body: { ...validBody, avatarUrl: 'javascript:alert(1)' } });
    const result = await runSchema(createUserSchema, req);
    expect(result.array().some((e) => e.path === 'avatarUrl')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// updateUserSchema
// ---------------------------------------------------------------------------
describe('updateUserSchema', () => {
  test('acepta body con un campo actualizable', async () => {
    const req = mockReq({ body: { firstName: 'María' } });
    const result = await runSchema(updateUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('acepta body vacío (sin campos — lógica de "al menos uno" es del Service)', async () => {
    const req = mockReq({ body: {} });
    const result = await runSchema(updateUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza si se intenta enviar password', async () => {
    const req = mockReq({ body: { firstName: 'Ana', password: 'Secret1' } });
    const result = await runSchema(updateUserSchema, req);
    expect(result.array().some((e) => e.path === 'password')).toBe(true);
  });

  test('rechaza si se intenta enviar passwordHash', async () => {
    const req = mockReq({ body: { passwordHash: '$2b$10$xxx' } });
    const result = await runSchema(updateUserSchema, req);
    expect(result.array().some((e) => e.path === 'passwordHash')).toBe(true);
  });

  test('acepta email válido', async () => {
    const req = mockReq({ body: { email: 'nuevo@example.com' } });
    const result = await runSchema(updateUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza email inválido', async () => {
    const req = mockReq({ body: { email: 'no-email' } });
    const result = await runSchema(updateUserSchema, req);
    expect(result.array().some((e) => e.path === 'email')).toBe(true);
  });

  test('acepta avatarUrl null (desasignar avatar)', async () => {
    const req = mockReq({ body: { avatarUrl: null } });
    const result = await runSchema(updateUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('acepta assignedTeacherId null (desasignar profesor)', async () => {
    const req = mockReq({ body: { assignedTeacherId: null } });
    const result = await runSchema(updateUserSchema, req);
    expect(result.isEmpty()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// listUsersSchema
// ---------------------------------------------------------------------------
describe('listUsersSchema', () => {
  test('acepta query vacía', async () => {
    const req = mockReq({ query: {} });
    const result = await runSchema(listUsersSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('acepta role válido', async () => {
    const req = mockReq({ query: { role: 'teacher' } });
    const result = await runSchema(listUsersSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza role inválido', async () => {
    const req = mockReq({ query: { role: 'superadmin' } });
    const result = await runSchema(listUsersSchema, req);
    expect(result.array().some((e) => e.path === 'role')).toBe(true);
  });

  test('sanitiza isActive "true" a booleano true', async () => {
    const req = mockReq({ query: { isActive: 'true' } });
    await runSchema(listUsersSchema, req);
    expect(req.query.isActive).toBe(true);
  });

  test('sanitiza isActive "false" a booleano false', async () => {
    const req = mockReq({ query: { isActive: 'false' } });
    await runSchema(listUsersSchema, req);
    expect(req.query.isActive).toBe(false);
  });

  test('convierte page a entero', async () => {
    const req = mockReq({ query: { page: '3' } });
    await runSchema(listUsersSchema, req);
    expect(req.query.page).toBe(3);
  });

  test('rechaza page 0', async () => {
    const req = mockReq({ query: { page: '0' } });
    const result = await runSchema(listUsersSchema, req);
    expect(result.array().some((e) => e.path === 'page')).toBe(true);
  });

  test('rechaza limit mayor a 100', async () => {
    const req = mockReq({ query: { limit: '101' } });
    const result = await runSchema(listUsersSchema, req);
    expect(result.array().some((e) => e.path === 'limit')).toBe(true);
  });

  test('acepta sortBy válido', async () => {
    const req = mockReq({ query: { sortBy: 'createdAt' } });
    const result = await runSchema(listUsersSchema, req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza sortBy fuera de whitelist', async () => {
    const req = mockReq({ query: { sortBy: 'passwordHash' } });
    const result = await runSchema(listUsersSchema, req);
    expect(result.array().some((e) => e.path === 'sortBy')).toBe(true);
  });

  test('acepta sortOrder asc y desc', async () => {
    for (const sortOrder of ['asc', 'desc']) {
      const req = mockReq({ query: { sortOrder } });
      const result = await runSchema(listUsersSchema, req);
      expect(result.isEmpty()).toBe(true);
    }
  });

  test('rechaza sortOrder inválido', async () => {
    const req = mockReq({ query: { sortOrder: 'ASC' } });
    const result = await runSchema(listUsersSchema, req);
    expect(result.array().some((e) => e.path === 'sortOrder')).toBe(true);
  });
});
