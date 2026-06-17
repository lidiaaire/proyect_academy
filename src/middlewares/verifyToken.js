'use strict';

const { UnauthorizedError } = require('../utils/ApiError');
const authService = require('../modules/auth/auth.service');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('TOKEN_MISSING', 'Token de autenticación requerido'));
  }

  const token = authHeader.slice(7);
  const payload = authService.verifyToken(token);
  req.user = { userId: payload.userId, role: payload.role };
  next();
};

module.exports = verifyToken;
