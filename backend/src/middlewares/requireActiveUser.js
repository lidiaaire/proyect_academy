'use strict';

/**
 * middlewares/requireActiveUser.js
 *
 * Responsabilidad: Verificar en base de datos que el usuario autenticado
 * sigue activo (isActive = true). Protege contra el caso de un usuario
 * desactivado que aún tiene un JWT válido no expirado.
 *
 * Se aplica SELECTIVAMENTE solo en endpoints de escritura críticos:
 *   POST /api/users, PATCH /api/users/:id, DELETE /api/users/:id
 *   PATCH /api/auth/change-password, GET /api/auth/me
 *   POST /api/bookings, PATCH /api/bookings/:id/*
 *
 * NO se aplica en endpoints de lectura donde la degradación es aceptable.
 *
 * Realiza UNA query: User.findById(req.user.userId).select('isActive')
 *
 * Errores lanzados:
 *   403 ACCOUNT_INACTIVE → isActive = false
 *   404 USER_NOT_FOUND   → el userId del token no existe en BD (caso extremo)
 */

const UserRepository  = require('../repositories/user.repository');
const { ForbiddenError, NotFoundError } = require('../utils/ApiError');

const requireActiveUser = async (req, res, next) => {
  try {
    const user = await UserRepository.findById(req.user.userId, { isActive: 1 });

    if (!user) {
      return next(new NotFoundError('USER_NOT_FOUND', 'Usuario no encontrado'));
    }
    if (!user.isActive) {
      return next(new ForbiddenError('ACCOUNT_INACTIVE', 'La cuenta está desactivada'));
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireActiveUser;
