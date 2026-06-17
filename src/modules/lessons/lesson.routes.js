'use strict';

const { Router }        = require('express');
const LessonController  = require('./lesson.controller');
const {
  idParamSchema,
  courseIdParamSchema,
  unitIdParamSchema,
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
} = require('./lesson.validator');
const validate        = require('../../middlewares/validate');
const verifyToken     = require('../../middlewares/verifyToken');
const requireRole     = require('../../middlewares/requireRole');
const { ROLES }       = require('../../config/constants');

const router = Router({ mergeParams: true });

const adminOnly = requireRole(ROLES.ADMIN);
const params    = [...validate(courseIdParamSchema), ...validate(unitIdParamSchema)];

router.get('/',
  verifyToken,
  ...params,
  LessonController.list
);

router.post('/',
  verifyToken,
  adminOnly,
  ...params,
  ...validate(createLessonSchema),
  LessonController.create
);

router.patch('/reorder',
  verifyToken,
  adminOnly,
  ...params,
  ...validate(reorderLessonsSchema),
  LessonController.reorder
);

router.get('/:id',
  verifyToken,
  ...params,
  ...validate(idParamSchema),
  LessonController.getById
);

router.patch('/:id',
  verifyToken,
  adminOnly,
  ...params,
  ...validate(idParamSchema),
  ...validate(updateLessonSchema),
  LessonController.update
);

router.delete('/:id',
  verifyToken,
  adminOnly,
  ...params,
  ...validate(idParamSchema),
  LessonController.remove
);

module.exports = router;
