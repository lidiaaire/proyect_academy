'use strict';

const bcrypt = require('bcryptjs');
const User   = require('../../src/models/user.model');
const { ROLES } = require('../../src/config/constants');

// Coste de bcrypt reducido a 4 en tests para minimizar tiempo de ejecución.
// En producción el servicio usa 12.
const BCRYPT_ROUNDS_TEST = 4;

// Base de datos de defaults por rol para tests repetibles.
const ROLE_DEFAULTS = {
  [ROLES.ADMIN]: {
    firstName: 'Admin',
    lastName:  'Test',
    email:     'admin@test.com',
    password:  'Admin2024!',
    role:      ROLES.ADMIN,
  },
  [ROLES.TEACHER]: {
    firstName: 'Teacher',
    lastName:  'Test',
    email:     'teacher@test.com',
    password:  'Teacher2024!',
    role:      ROLES.TEACHER,
  },
  [ROLES.STUDENT]: {
    firstName: 'Student',
    lastName:  'Test',
    email:     'student@test.com',
    password:  'Student2024!',
    role:      ROLES.STUDENT,
  },
};

/**
 * Crea un usuario en la base de datos con los datos proporcionados.
 *
 * @param {object} overrides — Campos a sobreescribir sobre los defaults mínimos.
 *   Acepta un campo virtual `password` (string plano) que se hashea automáticamente.
 *   El campo `passwordHash` nunca debe pasarse directamente — usa `password`.
 * @returns {{ user: UserDocument, password: string }}
 */
const createUser = async (overrides = {}) => {
  const {
    password = 'Default1234!',
    ...fields
  } = overrides;

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS_TEST);

  const user = await User.create({
    firstName: 'Generic',
    lastName:  'User',
    email:     `user-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
    role:      ROLES.STUDENT,
    isActive:  true,
    ...fields,
    passwordHash,
  });

  return { user, password };
};

const createAdmin = (overrides = {}) =>
  createUser({ ...ROLE_DEFAULTS[ROLES.ADMIN], ...overrides });

const createTeacher = (overrides = {}) =>
  createUser({ ...ROLE_DEFAULTS[ROLES.TEACHER], ...overrides });

const createStudent = (overrides = {}) =>
  createUser({ ...ROLE_DEFAULTS[ROLES.STUDENT], ...overrides });

module.exports = { createUser, createAdmin, createTeacher, createStudent };
