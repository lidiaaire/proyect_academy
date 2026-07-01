'use strict';

// Limitación conocida MVP: Teacher puede consultar cualquier perfil vía GET /users/:id.
// La restricción relacional "solo sus propios alumnos" queda fuera del alcance de esta fase.
// Se implementará en una fase posterior cuando se añada autorización relacional.

const asyncHandler = require('../../utils/asyncHandler');
const userService  = require('./user.service');

// ---------------------------------------------------------------------------
// listUsers — GET /api/users
// Extrae filtros y opciones de paginación de req.query.
// Pasa req.user completo: el Service decide el scope según el rol del caller.
// ---------------------------------------------------------------------------
const listUsers = asyncHandler(async (req, res) => {
  const filters = {
    role:              req.query.role,
    isActive:          req.query.isActive,
    assignedTeacherId: req.query.assignedTeacherId,
  };

  const pagination = {
    page:      req.query.page,
    limit:     req.query.limit,
    sortBy:    req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await userService.listUsers(filters, pagination, req.user);
  res.json(result);
});

// ---------------------------------------------------------------------------
// getUserById — GET /api/users/:id
// ---------------------------------------------------------------------------
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ user });
});

// ---------------------------------------------------------------------------
// createUser — POST /api/users
// Destructuring explícito: campos no permitidos del body nunca llegan al Service.
// Status 201 porque se crea un recurso nuevo.
// ---------------------------------------------------------------------------
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, assignedTeacherId, avatarUrl } = req.body;

  const user = await userService.createUser({
    firstName,
    lastName,
    email,
    password,
    role,
    assignedTeacherId,
    avatarUrl,
  });

  res.status(201).json({ user });
});

// ---------------------------------------------------------------------------
// updateUser — PATCH /api/users/:id
// Solo extrae campos de perfil actualizables. isActive, role y password
// no se extraen aquí — sus operaciones tienen handlers dedicados.
// ---------------------------------------------------------------------------
const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, avatarUrl, assignedTeacherId } = req.body;

  const user = await userService.updateUser(req.params.id, {
    firstName,
    lastName,
    email,
    avatarUrl,
    assignedTeacherId,
  });

  res.json({ user });
});

// ---------------------------------------------------------------------------
// activateUser — PATCH /api/users/:id/activate
// No lee el body — la operación no necesita datos adicionales.
// ---------------------------------------------------------------------------
const activateUser = asyncHandler(async (req, res) => {
  const user = await userService.activateUser(req.params.id);
  res.json({ user });
});

// ---------------------------------------------------------------------------
// deactivateUser — PATCH /api/users/:id/deactivate
// currentUserId viene de req.user.userId (puesto por verifyToken), nunca del body.
// Garantiza que la protección de auto-desactivación no puede ser bypasseada.
// ---------------------------------------------------------------------------
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id, req.user.userId);
  res.json({ user });
});

module.exports = { listUsers, getUserById, createUser, updateUser, activateUser, deactivateUser };
