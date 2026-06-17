'use strict';

const { Router }       = require('express');
const UnitController   = require('./unit.controller');
const lessonRoutes     = require('../lessons/lesson.routes');
const {
  idParamSchema,
  courseIdParamSchema,
  createUnitSchema,
  updateUnitSchema,
  reorderUnitsSchema,
} = require('./unit.validator');
const validate         = require('../../middlewares/validate');
const verifyToken      = require('../../middlewares/verifyToken');
const requireRole      = require('../../middlewares/requireRole');
const { ROLES }        = require('../../config/constants');

const router = Router({ mergeParams: true });

const adminOnly = requireRole(ROLES.ADMIN);

router.get('/',
  verifyToken,
  ...validate(courseIdParamSchema),
  UnitController.list
);

router.post('/',
  verifyToken,
  adminOnly,
  ...validate(courseIdParamSchema),
  ...validate(createUnitSchema),
  UnitController.create
);

router.patch('/reorder',
  verifyToken,
  adminOnly,
  ...validate(courseIdParamSchema),
  ...validate(reorderUnitsSchema),
  UnitController.reorder
);

router.get('/:id',
  verifyToken,
  ...validate(courseIdParamSchema),
  ...validate(idParamSchema),
  UnitController.getById
);

router.patch('/:id',
  verifyToken,
  adminOnly,
  ...validate(courseIdParamSchema),
  ...validate(idParamSchema),
  ...validate(updateUnitSchema),
  UnitController.update
);

router.delete('/:id',
  verifyToken,
  adminOnly,
  ...validate(courseIdParamSchema),
  ...validate(idParamSchema),
  UnitController.remove
);

router.use('/:unitId/lessons', lessonRoutes);

const assessmentRoutes = require('../assessments/assessment.routes');
router.use('/:unitId/assessment', assessmentRoutes);

module.exports = router;
