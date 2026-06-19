'use strict';

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const env     = require('../../config/env');
const UserRepository = require('../../repositories/user.repository');
const { UnauthorizedError, ForbiddenError } = require('../../utils/ApiError');
const { ROLES } = require('../../config/constants');

const TTL_BY_ROLE = {
  [ROLES.ADMIN]:   env.jwtTtlAdmin,
  [ROLES.TEACHER]: env.jwtTtlTeacher,
  [ROLES.STUDENT]: env.jwtTtlStudent,
};

const generateToken = (userId, role) =>
  jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: TTL_BY_ROLE[role] });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('TOKEN_EXPIRED', 'El token ha expirado');
    }
    throw new UnauthorizedError('TOKEN_INVALID', 'Token inválido');
  }
};

const login = async (email, password) => {
  const user = await UserRepository.findByEmailWithPassword(email);

  const validPassword = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !validPassword) {
    throw new UnauthorizedError('INVALID_CREDENTIALS', 'Credenciales incorrectas');
  }

  if (!user.isActive) {
    throw new ForbiddenError('ACCOUNT_INACTIVE', 'La cuenta está desactivada');
  }

  const token = generateToken(user._id, user.role);
  const expiresIn = TTL_BY_ROLE[user.role];

  UserRepository.updateLastLogin(user._id);

  return {
    token,
    expiresIn,
    user: {
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      role:      user.role,
      avatarUrl: user.avatarUrl,
    },
  };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await UserRepository.findByIdWithPassword(userId);

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new ForbiddenError('WRONG_CURRENT_PASSWORD', 'La contraseña actual es incorrecta');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await UserRepository.updatePassword(userId, passwordHash);
};

module.exports = { login, changePassword, generateToken, verifyToken };
