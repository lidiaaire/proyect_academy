'use strict';

/**
 * modules/auth/auth.controller.js
 *
 * Responsabilidad: Capa HTTP del módulo de autenticación.
 * Cada método extrae datos de req, llama al servicio, escribe en res.
 * NO contiene lógica de negocio. Usa asyncHandler para propagación de errores.
 *
 * Métodos:
 *
 *   login(req, res)
 *     Extrae: req.body.email, req.body.password
 *     Llama:  AuthService.login(email, password)
 *     Res:    201 { token, expiresIn, user }
 *
 *   logout(req, res)
 *     Extrae: nada (token ya verificado por verifyToken middleware)
 *     Res:    200 { message: 'Sesión cerrada correctamente' }
 *     Nota:   En MVP sin blacklist — el cliente descarta el token
 *
 *   me(req, res)
 *     Extrae: req.user.userId (adjuntado por verifyToken)
 *     Llama:  UserRepository.findById para obtener datos frescos
 *     Res:    200 { user completo sin passwordHash }
 *
 *   changePassword(req, res)
 *     Extrae: req.user.userId, req.body.{ currentPassword, newPassword }
 *     Llama:  AuthService.changePassword
 *     Res:    200 { message: 'Contraseña actualizada correctamente' }
 */

const asyncHandler    = require('../../utils/asyncHandler');
const AuthService     = require('./auth.service');
const UserRepository  = require('../../repositories/user.repository');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  res.status(201).json(result);
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

const me = asyncHandler(async (req, res) => {
  const user = await UserRepository.findById(req.user.userId);
  res.status(200).json({ user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await AuthService.changePassword(req.user.userId, currentPassword, newPassword);
  res.status(200).json({ message: 'Contraseña actualizada correctamente' });
});

module.exports = { login, logout, me, changePassword };
