'use strict';

const { Router }            = require('express');
const AssessmentController  = require('./assessment.controller');
const {
  courseIdParamSchema,
  unitIdParamSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
  submitAttemptSchema,
} = require('./assessment.validator');
const validate    = require('../../middlewares/validate');
const verifyToken = require('../../middlewares/verifyToken');
const requireRole = require('../../middlewares/requireRole');
const { ROLES }   = require('../../config/constants');

const router = Router({ mergeParams: true });

const adminOnly   = requireRole(ROLES.ADMIN);
const studentOnly = requireRole(ROLES.STUDENT);
const params      = [...validate(courseIdParamSchema), ...validate(unitIdParamSchema)];

// CRUD — un único assessment por unidad (sin :id en la ruta)
router.get('/',
  verifyToken,
  ...params,
  AssessmentController.get
);

router.post('/',
  verifyToken,
  adminOnly,
  ...params,
  ...validate(createAssessmentSchema),
  AssessmentController.create
);

router.patch('/',
  verifyToken,
  adminOnly,
  ...params,
  ...validate(updateAssessmentSchema),
  AssessmentController.update
);

router.delete('/',
  verifyToken,
  adminOnly,
  ...params,
  AssessmentController.remove
);

// Intentos
router.post('/attempts',
  verifyToken,
  studentOnly,
  ...params,
  ...validate(submitAttemptSchema),
  AssessmentController.submitAttempt
);

router.get('/attempts',
  verifyToken,
  ...params,
  AssessmentController.listAttempts
);

module.exports = router;
