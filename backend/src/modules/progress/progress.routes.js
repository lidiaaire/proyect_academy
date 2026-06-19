'use strict';

/**
 * modules/progress/progress.routes.js
 * Montado bajo /api/progress
 *
 *   PATCH  /api/progress/lessons/:lessonId/complete   → completeLesson    [student] + requireActiveUser
 *   GET    /api/progress/courses/:courseId            → getCourseProgress  [student]
 *   GET    /api/progress/overview                     → getOverview        [student]
 *   GET    /api/progress/students/:studentId/courses/:courseId → getStudentCourseProgress [admin, teacher]
 *   GET    /api/progress/students/:studentId          → getStudentOverview  [admin, teacher]
 */

const { Router }            = require('express');
const ProgressController    = require('./progress.controller');
const { lessonIdParamSchema, courseIdParamSchema, studentIdParamSchema } = require('./progress.validator');
const validate              = require('../../middlewares/validate');
const verifyToken           = require('../../middlewares/verifyToken');
const requireRole           = require('../../middlewares/requireRole');
const requireActiveUser     = require('../../middlewares/requireActiveUser');
const { ROLES }             = require('../../config/constants');

const router = Router();

const adminOrTeacher = requireRole(ROLES.ADMIN, ROLES.TEACHER);
const studentOnly    = requireRole(ROLES.STUDENT);

router.patch('/lessons/:lessonId/complete',
  verifyToken,
  studentOnly,
  requireActiveUser,
  ...validate(lessonIdParamSchema),
  ProgressController.completeLesson
);

router.get('/courses/:courseId',
  verifyToken,
  studentOnly,
  ...validate(courseIdParamSchema),
  ProgressController.getCourseProgress
);

router.get('/overview',
  verifyToken,
  studentOnly,
  ProgressController.getOverview
);

router.get('/students/:studentId/courses/:courseId',
  verifyToken,
  adminOrTeacher,
  ...validate(studentIdParamSchema),
  ...validate(courseIdParamSchema),
  ProgressController.getStudentCourseProgress
);

router.get('/students/:studentId',
  verifyToken,
  adminOrTeacher,
  ...validate(studentIdParamSchema),
  ProgressController.getStudentOverview
);

module.exports = router;
