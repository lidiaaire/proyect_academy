'use strict';

const { Router } = require('express');

const verifyToken       = require('../../middlewares/verifyToken');
const requireRole       = require('../../middlewares/requireRole');
const requireActiveUser = require('../../middlewares/requireActiveUser');
const validate          = require('../../middlewares/validate');

const {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
  listUsersSchema,
} = require('./user.validator');

const userController = require('./user.controller');

const router = Router();

// Todos los endpoints del módulo requieren JWT válido
router.use(verifyToken);

// GET /api/users — Admin y Teacher pueden listar
router.get(
  '/',
  requireRole('admin', 'teacher'),
  validate(listUsersSchema),
  userController.listUsers,
);

// GET /api/users/:id — Admin y Teacher pueden consultar cualquier perfil
// MVP: Teacher puede ver perfiles ajenos (restricción relacional fuera de alcance)
router.get(
  '/:id',
  requireRole('admin', 'teacher'),
  validate(idParamSchema),
  userController.getUserById,
);

// POST /api/users — Solo Admin puede crear usuarios
router.post(
  '/',
  requireRole('admin'),
  requireActiveUser,
  validate(createUserSchema),
  userController.createUser,
);

// PATCH /api/users/:id/activate — ANTES de /:id para evitar shadowing
router.patch(
  '/:id/activate',
  requireRole('admin'),
  requireActiveUser,
  validate(idParamSchema),
  userController.activateUser,
);

// PATCH /api/users/:id/deactivate — ANTES de /:id para evitar shadowing
router.patch(
  '/:id/deactivate',
  requireRole('admin'),
  requireActiveUser,
  validate(idParamSchema),
  userController.deactivateUser,
);

// PATCH /api/users/:id — Actualización de perfil, solo Admin
router.patch(
  '/:id',
  requireRole('admin'),
  requireActiveUser,
  validate(updateUserSchema.concat(idParamSchema)),
  userController.updateUser,
);

module.exports = router;
