'use strict';

/**
 * modules/enrollments/enrollment.routes.js
 * Montado bajo /api/enrollments
 *
 *   GET    /api/enrollments           → list   [admin, teacher, student]
 *   GET    /api/enrollments/:id       → getById
 *   POST   /api/enrollments           → create [admin] + requireActiveUser
 *   PATCH  /api/enrollments/:id       → updateStatus [admin]
 */

const { Router }              = require('express');
const EnrollmentController    = require('./enrollment.controller');
const { idParamSchema, createEnrollmentSchema, updateStatusSchema } = require('./enrollment.validator');
const validate                = require('../../middlewares/validate');
const verifyToken             = require('../../middlewares/verifyToken');
const requireRole             = require('../../middlewares/requireRole');
const requireActiveUser       = require('../../middlewares/requireActiveUser');
const { ROLES }               = require('../../config/constants');

const router = Router();

const adminOnly = requireRole(ROLES.ADMIN);

router.get('/',
  verifyToken,
  EnrollmentController.list
);

router.get('/:id',
  verifyToken,
  ...validate(idParamSchema),
  EnrollmentController.getById
);

router.post('/',
  verifyToken,
  adminOnly,
  requireActiveUser,
  ...validate(createEnrollmentSchema),
  EnrollmentController.create
);

router.patch('/:id/suspend',
  verifyToken,
  adminOnly,
  ...validate(idParamSchema),
  (req, res, next) => { req.body.status = 'suspended'; next(); },
  EnrollmentController.updateStatus
);

router.patch('/:id/activate',
  verifyToken,
  adminOnly,
  ...validate(idParamSchema),
  (req, res, next) => { req.body.status = 'active'; next(); },
  EnrollmentController.updateStatus
);

module.exports = router;
