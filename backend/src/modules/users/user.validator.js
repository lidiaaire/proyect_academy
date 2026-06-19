'use strict';

const { body, param, query } = require('express-validator');
const { ROLES } = require('../../config/constants');

const SORT_FIELDS = ['firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt', 'lastLoginAt'];

// ---------------------------------------------------------------------------
// idParamSchema — valida :id en todos los endpoints /:id
// ---------------------------------------------------------------------------
const idParamSchema = [
  param('id')
    .trim()
    .isMongoId()
    .withMessage('El id debe ser un ObjectId de MongoDB válido'),
];

// ---------------------------------------------------------------------------
// createUserSchema — POST /api/users
// ---------------------------------------------------------------------------
const createUserSchema = [
  // Bloquea intentos de inyectar el hash directamente
  body('passwordHash')
    .not().exists()
    .withMessage('El campo passwordHash no está permitido'),

  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El formato del email no es válido')
    .normalizeEmail({ gmail_remove_dots: false }),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    // bcrypt silently trunca a 72 bytes — lo rechazamos antes
    .isLength({ max: 72 }).withMessage('La contraseña no puede superar 72 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),

  body('role')
    .trim()
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(Object.values(ROLES))
    .withMessage(`El rol debe ser uno de: ${Object.values(ROLES).join(', ')}`),

  body('assignedTeacherId')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .isMongoId().withMessage('assignedTeacherId debe ser un ObjectId de MongoDB válido'),

  body('avatarUrl')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('El avatar debe ser una URL válida (http o https)')
    .isLength({ max: 500 }).withMessage('La URL del avatar no puede superar 500 caracteres'),
];

// ---------------------------------------------------------------------------
// updateUserSchema — PATCH /api/users/:id
// Todos los campos son opcionales. No acepta role, isActive ni password.
// ---------------------------------------------------------------------------
const updateUserSchema = [
  body('passwordHash')
    .not().exists()
    .withMessage('El campo passwordHash no está permitido'),

  // Orientativo: el cambio de contraseña tiene endpoint dedicado en Auth
  body('password')
    .not().exists()
    .withMessage('Usa el endpoint PATCH /auth/change-password para cambiar la contraseña'),

  body('firstName')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('lastName')
    .optional()
    .trim()
    .notEmpty().withMessage('Los apellidos no pueden estar vacíos')
    .isLength({ min: 2, max: 50 }).withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('El formato del email no es válido')
    .normalizeEmail({ gmail_remove_dots: false }),

  body('avatarUrl')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('El avatar debe ser una URL válida (http o https)')
    .isLength({ max: 500 }).withMessage('La URL del avatar no puede superar 500 caracteres'),

  body('assignedTeacherId')
    .optional({ nullable: true })
    .if((value) => value !== null)
    .isMongoId().withMessage('assignedTeacherId debe ser un ObjectId de MongoDB válido'),
];

// ---------------------------------------------------------------------------
// listUsersSchema — GET /api/users
// ---------------------------------------------------------------------------
const listUsersSchema = [
  query('role')
    .optional()
    .trim()
    .isIn(Object.values(ROLES))
    .withMessage(`El rol debe ser uno de: ${Object.values(ROLES).join(', ')}`),

  query('isActive')
    .optional()
    .customSanitizer((v) => v === 'true'),

  query('assignedTeacherId')
    .optional()
    .trim()
    .isMongoId().withMessage('assignedTeacherId debe ser un ObjectId de MongoDB válido'),

  query('page')
    .optional()
    .toInt()
    .isInt({ min: 1 }).withMessage('page debe ser un entero mayor o igual a 1'),

  query('limit')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 100 }).withMessage('limit debe ser un entero entre 1 y 100'),

  query('sortBy')
    .optional()
    .trim()
    .isIn(SORT_FIELDS)
    .withMessage(`sortBy debe ser uno de: ${SORT_FIELDS.join(', ')}`),

  query('sortOrder')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder debe ser "asc" o "desc"'),
];

module.exports = { idParamSchema, createUserSchema, updateUserSchema, listUsersSchema };
