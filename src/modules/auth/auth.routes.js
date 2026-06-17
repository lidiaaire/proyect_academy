'use strict';

/**
 * modules/auth/auth.routes.js
 *
 * Responsabilidad: Tabla de rutas del módulo de autenticación.
 * Montado en app.js bajo /api/auth
 *
 * Tabla de rutas:
 *
 *   POST   /api/auth/login
 *     Middlewares: loginLimiter, validate(loginSchema)
 *     Handler:     AuthController.login
 *
 *   POST   /api/auth/logout
 *     Middlewares: verifyToken
 *     Handler:     AuthController.logout
 *
 *   GET    /api/auth/me
 *     Middlewares: verifyToken, requireActiveUser
 *     Handler:     AuthController.me
 *
 *   PATCH  /api/auth/change-password
 *     Middlewares: verifyToken, requireActiveUser, validate(changePasswordSchema)
 *     Handler:     AuthController.changePassword
 */

const { Router }          = require('express');
const AuthController      = require('./auth.controller');
const { loginSchema, changePasswordSchema } = require('./auth.validator');
const validate            = require('../../middlewares/validate');
const verifyToken         = require('../../middlewares/verifyToken');
const requireActiveUser   = require('../../middlewares/requireActiveUser');
const { loginLimiter }    = require('../../middlewares/rateLimiter');

const router = Router();

router.post('/login',           loginLimiter, ...validate(loginSchema),          AuthController.login);
router.post('/logout',          verifyToken,                                      AuthController.logout);
router.get('/me',               verifyToken,  requireActiveUser,                  AuthController.me);
router.patch('/change-password',verifyToken,  requireActiveUser, ...validate(changePasswordSchema), AuthController.changePassword);

module.exports = router;
