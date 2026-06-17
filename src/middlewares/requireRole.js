'use strict';

/**
 * middlewares/requireRole.js
 *
 * Responsabilidad: Verificar que el rol del usuario autenticado está
 * en la lista de roles permitidos para el endpoint.
 * Debe ejecutarse DESPUÉS de verifyToken (req.user debe existir).
 *
 * Es una función de orden superior que devuelve un middleware.
 *
 * Uso:
 *   requireRole('admin')
 *   requireRole('admin', 'teacher')
 *   requireRole('admin', 'teacher', 'student')
 *
 * Errores lanzados:
 *   403 FORBIDDEN → req.user.role no está en la lista de roles permitidos
 */

const { ForbiddenError } = require('../utils/ApiError');

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new ForbiddenError('INSUFFICIENT_ROLE', 'No tienes permiso para realizar esta acción'));
  }
  next();
};

module.exports = requireRole;
